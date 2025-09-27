import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import WellnessData from '@/models/WellnessData';
import { getUserFromRequest } from '@/lib/jwt';

// GET endpoint to retrieve wellness data for the authenticated user
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
    
    // Get query parameters for date filtering
    const url = new URL(req.url);
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    
    // Build query
    const query: any = { userId: userData.userId };
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    // Get wellness data
    const wellnessData = await WellnessData.find(query).sort({ date: -1 });
    
    return NextResponse.json({
      success: true,
      data: wellnessData
    });
  } catch (error) {
    console.error('Error fetching wellness data:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST endpoint to create new wellness data entry
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
    const { 
      moodScore, 
      stressLevel, 
      sleepHours, 
      focusScore, 
      journalEntry, 
      meditationMinutes,
      wellnessActivities,
      date 
    } = body;
    
    // Validate required fields
    if (moodScore === undefined || stressLevel === undefined) {
      return NextResponse.json(
        { success: false, message: 'Mood score and stress level are required' },
        { status: 400 }
      );
    }
    
    // Check if an entry already exists for the given date
    const existingEntry = await WellnessData.findOne({
      userId: userData.userId,
      date: date ? new Date(date) : new Date()
    });
    
    let wellnessData;
    
    if (existingEntry) {
      // Update existing entry
      wellnessData = await WellnessData.findByIdAndUpdate(
        existingEntry._id,
        {
          moodScore,
          stressLevel,
          sleepHours,
          focusScore,
          journalEntry,
          meditationMinutes,
          wellnessActivities,
          // Calculate burnout risk score (simplified example)
          burnoutRiskScore: calculateBurnoutRisk(moodScore, stressLevel, sleepHours)
        },
        { new: true }
      );
    } else {
      // Create new entry
      wellnessData = await WellnessData.create({
        userId: userData.userId,
        date: date ? new Date(date) : new Date(),
        moodScore,
        stressLevel,
        sleepHours,
        focusScore,
        journalEntry,
        meditationMinutes,
        wellnessActivities,
        burnoutRiskScore: calculateBurnoutRisk(moodScore, stressLevel, sleepHours)
      });
    }
    
    return NextResponse.json({
      success: true,
      data: wellnessData
    }, { status: existingEntry ? 200 : 201 });
  } catch (error) {
    console.error('Error saving wellness data:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to calculate burnout risk score
function calculateBurnoutRisk(moodScore: number, stressLevel: number, sleepHours?: number): number {
  // Simple algorithm for burnout risk calculation
  // Low mood, high stress, and low sleep hours increase burnout risk
  let risk = 0;
  
  // Mood score contribution (1-10 scale, lower is worse)
  risk += Math.max(0, 70 - (moodScore * 7)); // Max 70 points
  
  // Stress level contribution (1-10 scale, higher is worse)
  risk += stressLevel * 3; // Max 30 points
  
  // Sleep hours contribution (if available)
  if (sleepHours !== undefined) {
    if (sleepHours < 6) {
      risk += Math.max(0, (6 - sleepHours) * 5); // Up to 30 points for very low sleep
    }
  }
  
  // Normalize to 0-100 scale
  return Math.min(100, Math.max(0, risk));
}
