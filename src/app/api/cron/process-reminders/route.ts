import { NextRequest, NextResponse } from 'next/server';
import { processReminders } from '@/lib/reminder/reminderService';

// API key for cron job authentication
const CRON_API_KEY = process.env.CRON_API_KEY;

export async function POST(request: NextRequest) {
  try {
    // Verify API key for security
    const apiKey = request.headers.get('x-api-key');
    
    if (!CRON_API_KEY || apiKey !== CRON_API_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get users who have pending/overdue invoices
    // In a real system, you would query your database to get all users
    // For the MVP, we'll use a simple query parameter
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    // Process reminders for the user
    const result = await processReminders(userId);
    
    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Reminder processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process reminders', details: (error as Error).message },
      { status: 500 }
    );
  }
} 