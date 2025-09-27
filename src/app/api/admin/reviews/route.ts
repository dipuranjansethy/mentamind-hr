import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Review from '@/models/Review';
import User from '@/models/User';
import { getUserFromRequest } from '@/lib/jwt';

// GET endpoint to retrieve and analyze reviews for HR/Admin
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
    
    // Get query parameters for filtering
    const url = new URL(req.url);
    const type = url.searchParams.get('type');
    const department = url.searchParams.get('department');
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate') || new Date().toISOString();
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const page = parseInt(url.searchParams.get('page') || '1');
    const skip = (page - 1) * limit;
    
    // Build query
    const query: any = { companyId: userData.companyId };
    
    if (type && (type === 'workplace' || type === 'self')) {
      query.type = type;
    }
    
    if (department) {
      query.department = department;
    }
    
    // Build date range query
    if (startDate || endDate) {
      query.createdAt = {};
      
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }
    
    // Get reviews
    const reviews = await Review.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'userId',
        select: 'name email department position -_id',
        // Don't include user details if review is anonymous
        match: { anonymous: false }
      });
    
    // Get total count for pagination
    const totalCount = await Review.countDocuments(query);
    
    // Get analytics
    const analytics = await calculateReviewAnalytics(query);
    
    return NextResponse.json({
      success: true,
      data: {
        reviews,
        analytics,
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

// Helper function to calculate review analytics
async function calculateReviewAnalytics(baseQuery: any) {
  // Get average ratings by type
  const avgRatingsByType = await Review.aggregate([
    { $match: baseQuery },
    { $group: {
      _id: '$type',
      avgRating: { $avg: '$rating' },
      count: { $sum: 1 }
    }}
  ]);
  
  // Get average ratings by department
  const avgRatingsByDepartment = await Review.aggregate([
    { $match: baseQuery },
    { $group: {
      _id: { department: '$department', type: '$type' },
      avgRating: { $avg: '$rating' },
      count: { $sum: 1 }
    }},
    { $sort: { '_id.department': 1, '_id.type': 1 } }
  ]);
  
  // Get rating distribution
  const ratingDistribution = await Review.aggregate([
    { $match: baseQuery },
    { $group: {
      _id: { rating: '$rating', type: '$type' },
      count: { $sum: 1 }
    }},
    { $sort: { '_id.type': 1, '_id.rating': 1 } }
  ]);
  
  // Get recent trend (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  const monthlyTrend = await Review.aggregate([
    { 
      $match: { 
        ...baseQuery,
        createdAt: { $gte: sixMonthsAgo } 
      } 
    },
    {
      $group: {
        _id: { 
          month: { $month: '$createdAt' },
          year: { $year: '$createdAt' },
          type: '$type'
        },
        avgRating: { $avg: '$rating' },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.type': 1 } }
  ]);
  
  // Format the results
  return {
    overview: {
      totalReviews: await Review.countDocuments(baseQuery),
      workplaceReviews: await Review.countDocuments({ ...baseQuery, type: 'workplace' }),
      selfReviews: await Review.countDocuments({ ...baseQuery, type: 'self' })
    },
    avgRatingsByType: avgRatingsByType.reduce((acc, item) => {
      acc[item._id] = {
        avgRating: parseFloat(item.avgRating.toFixed(2)),
        count: item.count
      };
      return acc;
    }, {}),
    departmentAnalytics: avgRatingsByDepartment.reduce((acc, item) => {
      const dept = item._id.department;
      const type = item._id.type;
      
      if (!acc[dept]) {
        acc[dept] = {};
      }
      
      acc[dept][type] = {
        avgRating: parseFloat(item.avgRating.toFixed(2)),
        count: item.count
      };
      
      return acc;
    }, {}),
    ratingDistribution: ratingDistribution.reduce((acc, item) => {
      const rating = item._id.rating;
      const type = item._id.type;
      
      if (!acc[type]) {
        acc[type] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      }
      
      acc[type][rating] = item.count;
      return acc;
    }, {}),
    monthlyTrend: monthlyTrend.reduce((acc, item) => {
      const month = item._id.month;
      const year = item._id.year;
      const type = item._id.type;
      const key = `${year}-${month.toString().padStart(2, '0')}`;
      
      if (!acc[key]) {
        acc[key] = {};
      }
      
      acc[key][type] = {
        avgRating: parseFloat(item.avgRating.toFixed(2)),
        count: item.count
      };
      
      return acc;
    }, {})
  };
}
