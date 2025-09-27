import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import WellnessProgram from '@/models/WellnessProgram';
import UserProgram from '@/models/UserProgram';
import { getUserFromRequest } from '@/lib/jwt';
import mongoose from 'mongoose';

// GET endpoint to retrieve a specific wellness program with user progress
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
    
    const programId = params.id;
    
    // Validate programId
    if (!mongoose.Types.ObjectId.isValid(programId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid program ID' },
        { status: 400 }
      );
    }
    
    // Get program details
    const program = await WellnessProgram.findOne({ 
      _id: programId,
      companyId: userData.companyId,
      isActive: true 
    });
    
    if (!program) {
      return NextResponse.json(
        { success: false, message: 'Program not found' },
        { status: 404 }
      );
    }
    
    // Get user's program progress
    const userProgram = await UserProgram.findOne({
      userId: userData.userId,
      programId: programId
    });
    
    // Determine which modules are locked based on progress
    const modulesWithStatus = program.modules.map((module: any) => {
      const isCompleted = userProgram ? 
        userProgram.completedModules.includes(module.order) : 
        false;
      
      // A module is locked if:
      // 1. User hasn't started the program, and it's not the first module
      // 2. User has started the program, but hasn't completed the previous module
      const isLocked = !userProgram ? 
        module.order > 1 : 
        module.order > userProgram.currentModule + 1;
      
      return {
        id: module._id,
        name: module.name,
        description: module.description,
        content: !isLocked ? module.content : null, // Only send content for unlocked modules
        order: module.order,
        resources: module.resources || [],
        completed: isCompleted,
        locked: isLocked
      };
    });
    
    return NextResponse.json({
      success: true,
      data: {
        id: program._id,
        title: program.name,
        description: program.description,
        duration: program.duration,
        modules: modulesWithStatus,
        progress: userProgram ? userProgram.progress : 0,
        startDate: userProgram ? userProgram.startDate : null,
        completionDate: userProgram ? userProgram.completionDate : null,
        isCompleted: userProgram ? userProgram.isCompleted : false
      }
    });
  } catch (error) {
    console.error('Error fetching wellness program:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST endpoint to start or update progress in a program
export async function POST(
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
    
    const programId = params.id;
    const { action, moduleOrder } = await req.json();
    
    // Validate programId
    if (!mongoose.Types.ObjectId.isValid(programId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid program ID' },
        { status: 400 }
      );
    }
    
    // Get program details
    const program = await WellnessProgram.findOne({ 
      _id: programId,
      companyId: userData.companyId,
      isActive: true 
    });
    
    if (!program) {
      return NextResponse.json(
        { success: false, message: 'Program not found' },
        { status: 404 }
      );
    }
    
    // Get or create user program
    let userProgram = await UserProgram.findOne({
      userId: userData.userId,
      programId: programId
    });
    
    if (action === 'start' && !userProgram) {
      // Start the program
      userProgram = await UserProgram.create({
        userId: userData.userId,
        programId: programId,
        progress: 0,
        currentModule: 1,
        completedModules: [],
        startDate: new Date(),
        isCompleted: false
      });
      
      return NextResponse.json({
        success: true,
        message: 'Program started successfully',
        data: userProgram
      });
    } else if (action === 'complete_module' && moduleOrder) {
      if (!userProgram) {
        return NextResponse.json(
          { success: false, message: 'You need to start the program first' },
          { status: 400 }
        );
      }
      
      // Validate module order
      const moduleIndex = program.modules.findIndex((m: any) => m.order === moduleOrder);
      if (moduleIndex === -1) {
        return NextResponse.json(
          { success: false, message: 'Invalid module order' },
          { status: 400 }
        );
      }
      
      // Check if module is accessible
      if (moduleOrder > userProgram.currentModule + 1) {
        return NextResponse.json(
          { success: false, message: 'You need to complete previous modules first' },
          { status: 400 }
        );
      }
      
      // Add to completed modules if not already completed
      if (!userProgram.completedModules.includes(moduleOrder)) {
        userProgram.completedModules.push(moduleOrder);
      }
      
      // Update current module if this is the current one
      if (moduleOrder === userProgram.currentModule) {
        userProgram.currentModule = moduleOrder + 1;
      }
      
      // Calculate progress
      const totalModules = program.modules.length;
      userProgram.progress = Math.round((userProgram.completedModules.length / totalModules) * 100);
      
      // Check if program is completed
      if (userProgram.completedModules.length === totalModules) {
        userProgram.isCompleted = true;
        userProgram.completionDate = new Date();
      }
      
      await userProgram.save();
      
      return NextResponse.json({
        success: true,
        message: 'Module completed successfully',
        data: userProgram
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid action' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error updating program progress:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
