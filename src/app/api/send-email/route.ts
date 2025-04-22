import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: NextRequest) {
  try {
    const { email, subject, message } = await request.json();

    // Input validation
    if (!email || !subject || !message) {
      return NextResponse.json(
        { message: "Email, subject, and message are required" },
        { status: 400 }
      );
    }

    // Initialize Resend with API key
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: process.env.DEFAULT_FROM_EMAIL || 'invoices@invoicenudger.com',
      to: email,
      subject: subject,
      text: message,
      html: `<div>${message.replace(/\n/g, "<br>")}</div>`,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { message: "Failed to send email", error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: "Email sent successfully", 
      data
    });
    
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { 
        message: "Failed to send email", 
        error: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
} 