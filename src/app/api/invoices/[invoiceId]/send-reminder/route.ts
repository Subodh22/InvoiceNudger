import { NextRequest, NextResponse } from 'next/server';
import { getInvoice, recordReminderSent } from '@/lib/firebase/invoiceUtils';
import { getClient } from '@/lib/firebase/clientUtils';
import { getTemplate, sendReminderEmail } from '@/lib/firebase/reminderUtils';
import { ReminderLevel } from '@/lib/models/reminder';

export async function POST(
  request: NextRequest,
  { params }: { params: { invoiceId: string } }
) {
  try {
    const { invoiceId } = params;
    const body = await request.json();
    const { userId, level } = body;

    // Validate required fields
    if (!userId || !level) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, level' },
        { status: 400 }
      );
    }

    // Validate level
    const validLevels: ReminderLevel[] = ['pre-due', 'due', 'gentle', 'firm', 'assertive', 'final'];
    if (!validLevels.includes(level as ReminderLevel)) {
      return NextResponse.json(
        { error: `Invalid level. Must be one of: ${validLevels.join(', ')}` },
        { status: 400 }
      );
    }

    // Get the invoice
    const invoice = await getInvoice(invoiceId);
    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    // Check if this invoice belongs to the user
    if (invoice.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the client
    const client = await getClient(invoice.clientId);
    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    // Get the template
    // If template ID is provided, use that specific template
    const templateId = body.templateId;
    let template;
    if (templateId) {
      template = await getTemplate(templateId);
      if (!template) {
        return NextResponse.json(
          { error: 'Template not found' },
          { status: 404 }
        );
      }
    } else {
      // Otherwise use client preferences to determine template
      const { getAppropriateTemplate } = await import('@/lib/firebase/reminderUtils');
      template = await getAppropriateTemplate(
        userId,
        level as ReminderLevel,
        client
      );

      if (!template) {
        return NextResponse.json(
          { error: 'No appropriate template found for this level' },
          { status: 404 }
        );
      }
    }

    // Send the reminder
    const result = await sendReminderEmail(invoice, client, template);

    // Record the reminder
    await recordReminderSent(invoiceId);

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error('Error sending reminder:', error);
    return NextResponse.json(
      { error: 'Failed to send reminder', details: (error as Error).message },
      { status: 500 }
    );
  }
} 