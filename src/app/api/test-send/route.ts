import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function GET(request: Request) {
  // Get the test email address from query parameters
  const { searchParams } = new URL(request.url);
  const to = searchParams.get('to') || 'test@example.com';
  
  // Explicitly use the API key from .env.local
  const API_KEY = process.env.RESEND_API_KEY;
  
  if (!API_KEY) {
    return NextResponse.json({ 
      error: 'RESEND_API_KEY is not defined in environment variables' 
    }, { status: 500 });
  }
  
  const resend = new Resend(API_KEY);
  
  try {
    console.log('Using Resend API key starting with:', API_KEY.substring(0, 10) + '...');
    
    const { data, error } = await resend.emails.send({
      from: 'Invoice Nudger <onboarding@resend.dev>',
      to: to,
      subject: 'Test Email from Invoice Nudger',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
          <h1 style="color: #333; font-size: 24px;">Invoice Nudger Test Email</h1>
          <p style="color: #666; font-size: 16px;">This is a test email sent at ${new Date().toLocaleString()}</p>
          <p style="color: #666; font-size: 16px;">If you're seeing this, the Resend integration is working correctly!</p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eaeaea; text-align: center; color: #999; font-size: 14px;">
            Sent via Resend
          </div>
        </div>
      `,
    });
    
    if (error) {
      console.error('Error sending email:', error);
      return NextResponse.json(
        { error: error.message, details: error }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `Email sent successfully to ${to}`,
      data 
    });
  } catch (error) {
    console.error('Error in test email API:', error);
    return NextResponse.json({ 
      error: 'Failed to send email', 
      details: (error as Error).message 
    }, { status: 500 });
  }
} 