import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { getUserFromRequest } from '@/lib/jwt';

// GET endpoint to retrieve all departments in the company
export async function GET(req: NextRequest) {
  try {
    const userData = getUserFromRequest(req);
    
    if (!userData) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Check if user is admin or HR
    if (userData.role !== 'admin' && userData.role !== 'hr') {
      return NextResponse.json(
        { success: false, message: 'Forbidden - Insufficient permissions' },
        { status: 403 }
      );
    }
    
    await connectToDatabase();
    
    // Get all unique departments in the company
    const departments = await User.distinct('department', { companyId: userData.companyId });
    
    // Filter out null or undefined departments
    const validDepartments = departments.filter(dept => dept);
    
    return NextResponse.json({
      success: true,
      data: validDepartments
    });
  } catch (error) {
    console.error('Error fetching departments:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
