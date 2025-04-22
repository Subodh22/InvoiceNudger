import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function GET(request: Request) {
  try {
    // Explicitly use the API key
    const API_KEY = 're_EjQzecri_2PuZqfuh85jxgxPTCqGYKcCU';
    const resend = new Resend(API_KEY);
    
    // Get email from query params or use a default
    const { searchParams } = new URL(request.url);
    const to = searchParams.get('to') || 'test@example.com';
    
    // Log what we're doing
    console.log(`Attempting to send email to ${to}`);
    
    // Send a basic email
    const { data, error } = await resend.emails.send({
      from: 'Invoice Nudger <onboarding@resend.dev>', // Use Resend verified sender
      to: to,
      subject: 'Basic Test Email',
      text: 'This is a plain text email to test Resend functionality',
      html: '<p>This is a test email from Invoice Nudger</p>',
    });
    
    if (error) {
      console.error('Email error:', error);
      return new Response(JSON.stringify({ 
        error: error.message || 'Unknown error',
        details: error 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: `Email sent to ${to}`,
      data 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to send email', 
      details: (error instanceof Error) ? error.message : String(error) 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 