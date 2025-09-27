import { NextResponse, NextRequest } from 'next/server';
import { getUserFromRequest } from './lib/jwt';

export function middleware(request: NextRequest) {
  // Define paths that require authentication
  const isAuthPath = request.nextUrl.pathname.startsWith('/api/auth');
  const isDashboardPath = request.nextUrl.pathname.startsWith('/dashboard');
  const isEmployeePath = request.nextUrl.pathname.startsWith('/employee');
  const isApiPath = request.nextUrl.pathname.startsWith('/api') && !isAuthPath;

  // Skip authentication for public paths
  if (!isDashboardPath && !isEmployeePath && !isApiPath) {
    return NextResponse.next();
  }

  // For API routes (except auth routes), check for valid token
  if (isApiPath) {
    const user = getUserFromRequest(request);
    
    if (!user) {
      console.log('API authentication failed:', request.nextUrl.pathname);
      return new NextResponse(
        JSON.stringify({ success: false, message: 'Authentication required' }),
        { 
          status: 401, 
          headers: { 
            'content-type': 'application/json',
            // Add CORS headers
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          } 
        }
      );
    }
    
    // Clone the request headers to a mutable object
    const requestHeaders = new Headers(request.headers);
    // Add the user ID and role to the request headers
    requestHeaders.set('x-user-id', user.userId);
    requestHeaders.set('x-user-role', user.role);
    
    // Create a new request with the modified headers
    const modifiedRequest = new NextRequest(request.url, {
      headers: requestHeaders,
      method: request.method,
      body: request.body,
      cache: request.cache,
      credentials: request.credentials,
      integrity: request.integrity,
      keepalive: request.keepalive,
      mode: request.mode,
      redirect: request.redirect,
      referrer: request.referrer,
      referrerPolicy: request.referrerPolicy,
      signal: request.signal,
    });
    
    return NextResponse.next({
      request: modifiedRequest,
    });
  }

  // For dashboard and employee routes, check if user is logged in via cookies
  const authToken = request.cookies.get('auth-token')?.value;
  
  if (!authToken) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/login';
    url.search = `?redirectTo=${request.nextUrl.pathname}`;
    return NextResponse.redirect(url);
  }

  // If user is trying to access dashboard, check if they have admin/hr role
  if (isDashboardPath) {
    try {
      const payload = JSON.parse(atob(authToken.split('.')[1]));
      if (payload.role !== 'admin' && payload.role !== 'hr') {
        const url = request.nextUrl.clone();
        url.pathname = '/employee';
        return NextResponse.redirect(url);
      }
    } catch (error) {
      const url = request.nextUrl.clone();
      url.pathname = '/auth/login';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
