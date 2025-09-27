import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Review from '@/models/Review';
import User from '@/models/User';
import { getUserFromRequest } from '@/lib/jwt';

// GET endpoint to retrieve reviews for the current user
export async function GET(req: NextRequest) {
  try {
    const userData = getUserFromRequest(req);
    
    if (!userData) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await connectToDatabase();
    
    // Get query parameters for filtering
    const url = new URL(req.url);
    const type = url.searchParams.get('type');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const page = parseInt(url.searchParams.get('page') || '1');
    const skip = (page - 1) * limit;
    
    // Build query
    const query: any = { userId: userData.userId };
    if (type && (type === 'workplace' || type === 'self')) {
      query.type = type;
    }
    
    // Get reviews
    const reviews = await Review.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const totalCount = await Review.countDocuments(query);
    
    return NextResponse.json({
      success: true,
      data: {
        reviews,
        pagination: {
          total: totalCount,
          page,
          limit,
          pages: Math.ceil(totalCount / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST endpoint to create a new review
export async function POST(req: NextRequest) {
  try {
    const userData = getUserFromRequest(req);
    
    if (!userData) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await connectToDatabase();
    
    const body = await req.json();
    const { type, title, content, rating, suggestions, anonymous } = body;
    
    // Validate required fields
    if (!type || !title || !content || !rating) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Validate type
    if (type !== 'workplace' && type !== 'self') {
      return NextResponse.json(
        { success: false, message: 'Invalid review type' },
        { status: 400 }
      );
    }
    
    // Validate rating
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, message: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }
    
    // Get user's department
    const user = await User.findById(userData.userId).select('department');
    if (!user || !user.department) {
      return NextResponse.json(
        { success: false, message: 'User department not found' },
        { status: 400 }
      );
    }
    
    // Create new review
    const newReview = new Review({
      userId: userData.userId,
      type,
      title,
      content,
      rating,
      suggestions: suggestions || '',
      anonymous: anonymous || false,
      department: user.department
    });
    
    await newReview.save();
    
    return NextResponse.json({
      success: true,
      data: newReview
    });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
