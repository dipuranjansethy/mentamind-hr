import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Review from '@/models/Review';
import { getUserFromRequest } from '@/lib/jwt';
import mongoose from 'mongoose';

// GET endpoint to retrieve a specific review for HR/Admin
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    const reviewId = params.id;
    
    // Validate reviewId
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid review ID' },
        { status: 400 }
      );
    }
    
    // Get review
    const review = await Review.findById(reviewId)
      .populate({
        path: 'userId',
        select: 'name email department position',
        // Don't include user details if review is anonymous
        match: { anonymous: false }
      });
    
    if (!review) {
      return NextResponse.json(
        { success: false, message: 'Review not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('Error fetching review:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT endpoint to update a review status (archive/unarchive) for HR/Admin
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    const reviewId = params.id;
    
    // Validate reviewId
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid review ID' },
        { status: 400 }
      );
    }
    
    // Check if review exists
    const existingReview = await Review.findById(reviewId);
    
    if (!existingReview) {
      return NextResponse.json(
        { success: false, message: 'Review not found' },
        { status: 404 }
      );
    }
    
    const body = await req.json();
    const { isArchived } = body;
    
    if (isArchived === undefined) {
      return NextResponse.json(
        { success: false, message: 'isArchived field is required' },
        { status: 400 }
      );
    }
    
    // Update review archive status
    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { isArchived },
      { new: true }
    );
    
    return NextResponse.json({
      success: true,
      data: updatedReview
    });
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
