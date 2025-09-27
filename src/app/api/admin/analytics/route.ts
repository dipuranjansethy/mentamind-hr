import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import WellnessData from '@/models/WellnessData';
import UserProgram from '@/models/UserProgram';
import Review from '@/models/Review';
import { getUserFromRequest } from '@/lib/jwt';

// GET endpoint to retrieve company-wide analytics
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
    const department = url.searchParams.get('department');
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate') || new Date().toISOString();
    
    // Get all users in the company
    const userQuery: any = { companyId: userData.companyId };
    if (department) {
      userQuery.department = department;
    }
    
    const users = await User.find(userQuery).select('_id department position');
    const userIds = users.map(user => user._id);
    
    // Build date range query
    const dateQuery: any = {};
    if (startDate) {
      dateQuery.$gte = new Date(startDate);
    }
    if (endDate) {
      dateQuery.$lte = new Date(endDate);
    }
    
    // Get wellness data for all users
    const wellnessDataQuery: any = { userId: { $in: userIds } };
    if (startDate || endDate) {
      wellnessDataQuery.date = dateQuery;
    }
    
    const wellnessData = await WellnessData.find(wellnessDataQuery);
    
    // Get program data for all users
    const userPrograms = await UserProgram.find({ userId: { $in: userIds } });
    
    // Get review data for all users
    const reviewQuery: any = { userId: { $in: userIds } };
    if (startDate || endDate) {
      reviewQuery.createdAt = dateQuery;
    }
    const reviews = await Review.find(reviewQuery);
    
    // Calculate analytics
    const analytics = calculateAnalytics(users, wellnessData, userPrograms, reviews, department);
    
    return NextResponse.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to calculate analytics
function calculateAnalytics(
  users: any[], 
  wellnessData: any[], 
  userPrograms: any[],
  reviews: any[],
  department?: string | null
) {
  // Group users by department
  const departments: Record<string, any[]> = {};
  users.forEach(user => {
    const dept = user.department || 'Unassigned';
    if (!departments[dept]) {
      departments[dept] = [];
    }
    departments[dept].push(user);
  });
  
  // Calculate overall metrics
  const totalUsers = users.length;
  const activeUsers = new Set(wellnessData.map(data => data.userId.toString())).size;
  const activePercentage = totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0;
  
  // Calculate average wellness metrics
  let totalMoodScore = 0;
  let totalStressLevel = 0;
  let totalSleepHours = 0;
  let totalBurnoutRisk = 0;
  let moodCount = 0;
  let stressCount = 0;
  let sleepCount = 0;
  let burnoutCount = 0;
  
  wellnessData.forEach(data => {
    if (data.moodScore) {
      totalMoodScore += data.moodScore;
      moodCount++;
    }
    if (data.stressLevel) {
      totalStressLevel += data.stressLevel;
      stressCount++;
    }
    if (data.sleepHours) {
      totalSleepHours += data.sleepHours;
      sleepCount++;
    }
    if (data.burnoutRiskScore) {
      totalBurnoutRisk += data.burnoutRiskScore;
      burnoutCount++;
    }
  });
  
  const avgMoodScore = moodCount > 0 ? totalMoodScore / moodCount : 0;
  const avgStressLevel = stressCount > 0 ? totalStressLevel / stressCount : 0;
  const avgSleepHours = sleepCount > 0 ? totalSleepHours / sleepCount : 0;
  const avgBurnoutRisk = burnoutCount > 0 ? totalBurnoutRisk / burnoutCount : 0;
  
  // Calculate program metrics
  const totalProgramsStarted = userPrograms.length;
  const completedPrograms = userPrograms.filter(program => program.isCompleted).length;
  const programCompletionRate = totalProgramsStarted > 0 ? 
    (completedPrograms / totalProgramsStarted) * 100 : 0;
    
  // Calculate review metrics
  const totalReviews = reviews.length;
  const workplaceReviews = reviews.filter(review => review.type === 'workplace').length;
  const selfReviews = reviews.filter(review => review.type === 'self').length;
  
  // Calculate average ratings
  let totalWorkplaceRating = 0;
  let totalSelfRating = 0;
  let workplaceRatingCount = 0;
  let selfRatingCount = 0;
  
  reviews.forEach(review => {
    if (review.type === 'workplace') {
      totalWorkplaceRating += review.rating;
      workplaceRatingCount++;
    } else if (review.type === 'self') {
      totalSelfRating += review.rating;
      selfRatingCount++;
    }
  });
  
  const avgWorkplaceRating = workplaceRatingCount > 0 ? totalWorkplaceRating / workplaceRatingCount : 0;
  const avgSelfRating = selfRatingCount > 0 ? totalSelfRating / selfRatingCount : 0;
  
  // Calculate department-specific metrics
  const departmentMetrics: Record<string, any> = {};
  
  Object.keys(departments).forEach(dept => {
    const deptUserIds = departments[dept].map(user => user._id.toString());
    
    // Filter wellness data for this department
    const deptWellnessData = wellnessData.filter(
      data => deptUserIds.includes(data.userId.toString())
    );
    
    // Calculate department averages
    let deptMoodScore = 0;
    let deptStressLevel = 0;
    let deptBurnoutRisk = 0;
    let deptMoodCount = 0;
    let deptStressCount = 0;
    let deptBurnoutCount = 0;
    
    deptWellnessData.forEach(data => {
      if (data.moodScore) {
        deptMoodScore += data.moodScore;
        deptMoodCount++;
      }
      if (data.stressLevel) {
        deptStressLevel += data.stressLevel;
        deptStressCount++;
      }
      if (data.burnoutRiskScore) {
        deptBurnoutRisk += data.burnoutRiskScore;
        deptBurnoutCount++;
      }
    });
    
    const deptAvgMoodScore = deptMoodCount > 0 ? deptMoodScore / deptMoodCount : 0;
    const deptAvgStressLevel = deptStressCount > 0 ? deptStressLevel / deptStressCount : 0;
    const deptAvgBurnoutRisk = deptBurnoutCount > 0 ? deptBurnoutRisk / deptBurnoutCount : 0;
    
    // Calculate department program metrics
    const deptPrograms = userPrograms.filter(
      program => deptUserIds.includes(program.userId.toString())
    );
    
    // Calculate department review metrics
    const deptReviews = reviews.filter(
      review => deptUserIds.includes(review.userId.toString())
    );
    
    const deptWorkplaceReviews = deptReviews.filter(review => review.type === 'workplace');
    const deptSelfReviews = deptReviews.filter(review => review.type === 'self');
    
    let deptTotalWorkplaceRating = 0;
    let deptTotalSelfRating = 0;
    
    deptWorkplaceReviews.forEach(review => {
      deptTotalWorkplaceRating += review.rating;
    });
    
    deptSelfReviews.forEach(review => {
      deptTotalSelfRating += review.rating;
    });
    
    const deptAvgWorkplaceRating = deptWorkplaceReviews.length > 0 ? 
      deptTotalWorkplaceRating / deptWorkplaceReviews.length : 0;
    const deptAvgSelfRating = deptSelfReviews.length > 0 ? 
      deptTotalSelfRating / deptSelfReviews.length : 0;
    
    const deptTotalUsers = departments[dept].length;
    const deptActiveUsers = new Set(
      deptWellnessData.map(data => data.userId.toString())
    ).size;
    
    departmentMetrics[dept] = {
      totalUsers: deptTotalUsers,
      activeUsers: deptActiveUsers,
      activePercentage: deptTotalUsers > 0 ? (deptActiveUsers / deptTotalUsers) * 100 : 0,
      avgMoodScore: deptAvgMoodScore,
      avgStressLevel: deptAvgStressLevel,
      avgBurnoutRisk: deptAvgBurnoutRisk,
      programsStarted: deptPrograms.length,
      programsCompleted: deptPrograms.filter(program => program.isCompleted).length,
      reviews: {
        total: deptReviews.length,
        workplace: deptWorkplaceReviews.length,
        self: deptSelfReviews.length,
        avgWorkplaceRating: parseFloat(deptAvgWorkplaceRating.toFixed(2)),
        avgSelfRating: parseFloat(deptAvgSelfRating.toFixed(2))
      }
    };
  });
  
  // Return aggregated analytics
  return {
    overall: {
      totalUsers,
      activeUsers,
      activePercentage,
      avgMoodScore,
      avgStressLevel,
      avgSleepHours,
      avgBurnoutRisk,
      programsStarted: totalProgramsStarted,
      programsCompleted: completedPrograms,
      programCompletionRate,
      reviews: {
        total: totalReviews,
        workplace: workplaceReviews,
        self: selfReviews,
        avgWorkplaceRating: parseFloat(avgWorkplaceRating.toFixed(2)),
        avgSelfRating: parseFloat(avgSelfRating.toFixed(2))
      }
    },
    departments: departmentMetrics,
    // If department filter is applied, only return that department's data
    filteredDepartment: department ? departmentMetrics[department] : null
  };
}
