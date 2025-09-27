/**
 * Custom API client for making authenticated requests
 */

/**
 * Makes an authenticated API request
 * @param url The URL to fetch
 * @param options Additional fetch options
 * @returns The response data
 */
export async function apiRequest<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  // Merge default options with provided options
  const mergedOptions: RequestInit = {
    credentials: 'include', // Always include credentials
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    // Make the request
    const response = await fetch(url, mergedOptions);

    // Parse the response
    const data = await response.json();

    // Handle error responses
    if (!response.ok) {
      console.error('API request failed:', { url, status: response.status, data });
      throw new Error(data.message || `API request failed with status ${response.status}`);
    }

    return data;
  } catch (error: any) {
    // Add request details to the error
    if (error instanceof Error) {
      console.error(`API request to ${url} failed:`, error.message);
    } else {
      console.error(`API request to ${url} failed with unknown error`);
    }
    
    // Rethrow the error with additional context
    throw new Error(error.message || 'API request failed');
  }
}

/**
 * Makes a GET request
 * @param url The URL to fetch
 * @param options Additional fetch options
 * @returns The response data
 */
export function get<T = any>(url: string, options: RequestInit = {}): Promise<T> {
  return apiRequest<T>(url, { ...options, method: 'GET' });
}

/**
 * Makes a POST request
 * @param url The URL to fetch
 * @param body The request body
 * @param options Additional fetch options
 * @returns The response data
 */
export function post<T = any>(
  url: string,
  body: any,
  options: RequestInit = {}
): Promise<T> {
  return apiRequest<T>(url, {
    ...options,
    method: 'POST',
    body: JSON.stringify(body),
  });
}

/**
 * Makes a PUT request
 * @param url The URL to fetch
 * @param body The request body
 * @param options Additional fetch options
 * @returns The response data
 */
export function put<T = any>(
  url: string,
  body: any,
  options: RequestInit = {}
): Promise<T> {
  return apiRequest<T>(url, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

/**
 * Makes a DELETE request
 * @param url The URL to fetch
 * @param options Additional fetch options
 * @returns The response data
 */
export function del<T = any>(url: string, options: RequestInit = {}): Promise<T> {
  return apiRequest<T>(url, { ...options, method: 'DELETE' });
}
