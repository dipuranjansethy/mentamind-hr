import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import WellnessProgram from '@/models/WellnessProgram';
import UserProgram from '@/models/UserProgram';
import { getUserFromRequest } from '@/lib/jwt';

// GET endpoint to retrieve wellness programs for the authenticated user
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
    
    // Get all programs for the company
    const programs = await WellnessProgram.find({ 
      companyId: userData.companyId,
      isActive: true 
    });
    
    // Get user's program progress
    const userPrograms = await UserProgram.find({
      userId: userData.userId
    });
    
    // Combine program data with user progress
    const programsWithProgress = programs.map(program => {
      const userProgram = userPrograms.find(
        up => up.programId.toString() === program._id.toString()
      );
      
      return {
        id: program._id,
        title: program.name,
        description: program.description,
        duration: program.duration,
        modules: program.modules.map((module: any) => ({
          id: module._id,
          name: module.name,
          description: module.description,
          order: module.order,
          completed: userProgram ? 
            userProgram.completedModules.includes(module.order) : 
            false
        })),
        progress: userProgram ? userProgram.progress : 0,
        startDate: userProgram ? userProgram.startDate : null,
        completionDate: userProgram ? userProgram.completionDate : null,
        isCompleted: userProgram ? userProgram.isCompleted : false
      };
    });
    
    return NextResponse.json({
      success: true,
      data: programsWithProgress
    });
  } catch (error) {
    console.error('Error fetching wellness programs:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
