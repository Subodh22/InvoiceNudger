import { Resend } from 'resend';

// Initialize Resend with API key - using the actual key from .env.local
const resendApiKey = process.env.RESEND_API_KEY; // re_EjQzecri_2PuZqfuh85jxgxPTCqGYKcCU
const resend = new Resend(resendApiKey);

// Default sender email (customize as needed)
const DEFAULT_FROM_EMAIL = process.env.DEFAULT_FROM_EMAIL || 'invoices@invoicenudger.com';

export type EmailOptions = {
  to: string;
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
  cc?: string[];
  bcc?: string[];
};

/**
 * Sends an email using the Resend API
 */
export async function sendEmail({
  to,
  subject,
  html,
  from = DEFAULT_FROM_EMAIL,
  replyTo,
  cc,
  bcc
}: EmailOptions) {
  if (!resendApiKey) {
    throw new Error('RESEND_API_KEY is not defined');
  }
  
  console.log('Using Resend API Key starting with:', resendApiKey.substring(0, 5));
  
  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
      replyTo,
      cc,
      bcc,
    });

    if (error) {
      console.error('Error sending email:', error);
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
} 