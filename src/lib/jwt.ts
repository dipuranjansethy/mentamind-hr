import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  companyId: string;
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

export function getTokenFromRequest(req: NextRequest): string | null {
  // Check Authorization header first
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // Then check for cookies
  const authCookie = req.cookies.get('auth-token');
  if (authCookie && authCookie.value) {
    return authCookie.value;
  }
  
  return null;
}

export function getUserFromRequest(req: NextRequest): JwtPayload | null {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return null;
    
    return verifyToken(token);
  } catch (error) {
    return null;
  }
}
