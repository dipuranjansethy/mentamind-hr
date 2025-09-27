import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import JournalEntry from '@/models/JournalEntry';
import { getUserFromRequest } from '@/lib/jwt';
import mongoose from 'mongoose';

// GET endpoint to retrieve journal entries for the authenticated user
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
    
    // Get query parameters for pagination and filtering
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    const tag = url.searchParams.get('tag');
    
    // Build query
    const query: any = { userId: userData.userId };
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    if (tag) {
      query.tags = tag;
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Get journal entries
    const entries = await JournalEntry.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const total = await JournalEntry.countDocuments(query);
    
    return NextResponse.json({
      success: true,
      data: entries,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST endpoint to create a new journal entry
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
    const { title, content, mood, date, tags } = body;
    
    // Validate required fields
    if (!title || !content || !mood) {
      return NextResponse.json(
        { success: false, message: 'Title, content, and mood are required' },
        { status: 400 }
      );
    }
    
    // Create new journal entry
    const journalEntry = await JournalEntry.create({
      userId: userData.userId,
      title,
      content,
      mood,
      date: date ? new Date(date) : new Date(),
      tags: tags || []
    });
    
    return NextResponse.json({
      success: true,
      data: journalEntry
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating journal entry:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
