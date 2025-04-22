import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function GET(request: Request) {
  // Get the test email address from query parameters
  const { searchParams } = new URL(request.url);
  const to = searchParams.get('to') || 'test@example.com';
  
  // Explicitly use the API key from .env.local
  const API_KEY = 're_EjQzecri_2PuZqfuh85jxgxPTCqGYKcCU';
  const resend = new Resend(API_KEY);
  
  try {
    console.log('Using Resend API key starting with:', API_KEY.substring(0, 10) + '...');
    
    const { data, error } = await resend.emails.send({
      from: 'Invoice Nudger <onboarding@resend.dev>',
      to: to,
      subject: 'Test Email from Invoice Nudger',
      html: `
        <h1>Invoice Nudger Test Email</h1>
        <p>This is a test email sent at ${new Date().toISOString()}</p>
        <p>If you're seeing this, the Resend integration is working correctly!</p>
      `,
    });
    
    if (error) {
      console.error('Error sending email:', error);
      return NextResponse.json({ error }, { status: 500 });
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