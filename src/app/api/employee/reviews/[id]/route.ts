import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Review from '@/models/Review';
import { getUserFromRequest } from '@/lib/jwt';
import mongoose from 'mongoose';

// GET endpoint to retrieve a specific review
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
    const review = await Review.findOne({ 
      _id: reviewId,
      userId: userData.userId
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

// PUT endpoint to update a review
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
    
    await connectToDatabase();
    
    const reviewId = params.id;
    
    // Validate reviewId
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid review ID' },
        { status: 400 }
      );
    }
    
    // Check if review exists and belongs to user
    const existingReview = await Review.findOne({
      _id: reviewId,
      userId: userData.userId
    });
    
    if (!existingReview) {
      return NextResponse.json(
        { success: false, message: 'Review not found' },
        { status: 404 }
      );
    }
    
    const body = await req.json();
    const { title, content, rating, suggestions, anonymous } = body;
    
    // Validate rating if provided
    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { success: false, message: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }
    
    // Update review
    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      {
        title: title || existingReview.title,
        content: content || existingReview.content,
        rating: rating !== undefined ? rating : existingReview.rating,
        suggestions: suggestions !== undefined ? suggestions : existingReview.suggestions,
        anonymous: anonymous !== undefined ? anonymous : existingReview.anonymous
      },
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

// DELETE endpoint to delete a review
export async function DELETE(
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
    
    await connectToDatabase();
    
    const reviewId = params.id;
    
    // Validate reviewId
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid review ID' },
        { status: 400 }
      );
    }
    
    // Check if review exists and belongs to user
    const existingReview = await Review.findOne({
      _id: reviewId,
      userId: userData.userId
    });
    
    if (!existingReview) {
      return NextResponse.json(
        { success: false, message: 'Review not found' },
        { status: 404 }
      );
    }
    
    // Delete review
    await Review.findByIdAndDelete(reviewId);
    
    return NextResponse.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
