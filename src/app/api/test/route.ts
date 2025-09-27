import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // Get user ID and role from the request headers
  const userId = req.headers.get('x-user-id');
  const userRole = req.headers.get('x-user-role');
  
  return NextResponse.json({
    success: true,
    message: 'Authentication successful',
    data: {
      userId,
      userRole,
      timestamp: new Date().toISOString()
    }
  });
}
