import { NextRequest, NextResponse } from 'next/server';
import { createDefaultTemplates } from '@/lib/reminder/defaultTemplates';
import { createTemplate } from '@/lib/firebase/reminderUtils';

// API key for admin operations
const ADMIN_API_KEY = process.env.ADMIN_API_KEY;

export async function POST(request: NextRequest) {
  try {
    // Verify API key for security
    const apiKey = request.headers.get('x-api-key');
    
    if (!ADMIN_API_KEY || apiKey !== ADMIN_API_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Generate default templates
    const templates = createDefaultTemplates();
    
    // Insert templates into database
    const createdTemplates = [];
    for (const template of templates) {
      const created = await createTemplate(template);
      createdTemplates.push(created);
    }
    
    return NextResponse.json({
      success: true,
      count: createdTemplates.length,
      message: `Successfully created ${createdTemplates.length} default templates`,
    });
  } catch (error) {
    console.error('Template seeding error:', error);
    return NextResponse.json(
      { error: 'Failed to seed templates', details: (error as Error).message },
      { status: 500 }
    );
  }
} 