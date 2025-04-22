import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with the API key from environment variables
const resendApiKey = process.env.RESEND_API_KEY;
const resend = new Resend(resendApiKey);

export async function GET() {
  try {
    if (!resendApiKey) {
      return NextResponse.json(
        { error: 'RESEND_API_KEY is not defined in environment variables' },
        { status: 500 }
      );
    }

    // Log the first few characters of the API key for debugging (never log the full key)
    console.log('API Key first few chars:', resendApiKey.substring(0, 5) + '...');

    // Send a test email
    const { data, error } = await resend.emails.send({
      from: process.env.DEFAULT_FROM_EMAIL || 'onboarding@resend.dev',
      to: 'test@example.com', // Replace with your actual test email
      subject: 'Test email from Invoice Nudger',
      html: '<p>This is a test email from Invoice Nudger to verify Resend integration.</p>',
    });

    if (error) {
      console.error('Error sending email:', error);
      return NextResponse.json(
        { error: 'Failed to send test email', details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      data,
    });
  } catch (error) {
    console.error('Error in test email API:', error);
    return NextResponse.json(
      { error: 'Failed to send test email', details: (error as Error).message },
      { status: 500 }
    );
  }
} 