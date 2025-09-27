import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import JournalEntry from '@/models/JournalEntry';
import { getUserFromRequest } from '@/lib/jwt';
import mongoose from 'mongoose';

// GET endpoint to retrieve a specific journal entry
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
    
    const entryId = params.id;
    
    // Validate entryId
    if (!mongoose.Types.ObjectId.isValid(entryId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid entry ID' },
        { status: 400 }
      );
    }
    
    // Get journal entry
    const entry = await JournalEntry.findOne({ 
      _id: entryId,
      userId: userData.userId
    });
    
    if (!entry) {
      return NextResponse.json(
        { success: false, message: 'Journal entry not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: entry
    });
  } catch (error) {
    console.error('Error fetching journal entry:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT endpoint to update a journal entry
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
    
    const entryId = params.id;
    
    // Validate entryId
    if (!mongoose.Types.ObjectId.isValid(entryId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid entry ID' },
        { status: 400 }
      );
    }
    
    // Check if entry exists and belongs to user
    const existingEntry = await JournalEntry.findOne({
      _id: entryId,
      userId: userData.userId
    });
    
    if (!existingEntry) {
      return NextResponse.json(
        { success: false, message: 'Journal entry not found' },
        { status: 404 }
      );
    }
    
    const body = await req.json();
    const { title, content, mood, date, tags } = body;
    
    // Update journal entry
    const updatedEntry = await JournalEntry.findByIdAndUpdate(
      entryId,
      {
        title: title || existingEntry.title,
        content: content || existingEntry.content,
        mood: mood || existingEntry.mood,
        date: date ? new Date(date) : existingEntry.date,
        tags: tags || existingEntry.tags
      },
      { new: true }
    );
    
    return NextResponse.json({
      success: true,
      data: updatedEntry
    });
  } catch (error) {
    console.error('Error updating journal entry:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE endpoint to delete a journal entry
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
    
    const entryId = params.id;
    
    // Validate entryId
    if (!mongoose.Types.ObjectId.isValid(entryId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid entry ID' },
        { status: 400 }
      );
    }
    
    // Check if entry exists and belongs to user
    const existingEntry = await JournalEntry.findOne({
      _id: entryId,
      userId: userData.userId
    });
    
    if (!existingEntry) {
      return NextResponse.json(
        { success: false, message: 'Journal entry not found' },
        { status: 404 }
      );
    }
    
    // Delete journal entry
    await JournalEntry.findByIdAndDelete(entryId);
    
    return NextResponse.json({
      success: true,
      message: 'Journal entry deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting journal entry:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
