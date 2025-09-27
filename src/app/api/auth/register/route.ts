import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import Company from '@/models/Company';
import { signToken } from '@/lib/jwt';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const body = await req.json();
    const { name, email, password, companyName } = body;
    
    if (!name || !email || !password || !companyName) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User already exists' },
        { status: 409 }
      );
    }
    
    // Create new company
    const company = await Company.create({
      name: companyName,
      subscriptionPlan: 'basic',
      subscriptionStatus: 'trial',
      subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days trial
    });
    
    // Create new user with admin role
    const user = await User.create({
      name,
      email,
      password,
      role: 'admin',
      companyId: company._id
    });
    
    // Generate JWT token
    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      companyId: company._id.toString()
    });
    
    // Create response with cookie
    const response = NextResponse.json(
      { 
        success: true, 
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        company: {
          id: company._id,
          name: company.name
        }
      },
      { status: 201 }
    );
    
    // Set HTTP-only cookie
    response.cookies.set({
      name: 'auth-token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400, // 1 day
      path: '/'
    });
    
    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
