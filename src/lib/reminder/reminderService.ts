import { getInvoices, updateInvoice, recordReminderSent } from '../firebase/invoiceUtils';
import { getClient } from '../firebase/clientUtils';
import { getAppropriateTemplate, sendReminderEmail } from '../firebase/reminderUtils';
import { Invoice } from '../models/invoice';
import { Client } from '../models/client';
import { ReminderLevel } from '../models/reminder';

/**
 * Check which invoices need reminders based on their due dates and reminder settings
 */
export async function processReminders(userId: string): Promise<{
  processed: number;
  sent: number;
  errors: number;
}> {
  // Get all pending and overdue invoices
  const invoices = await getInvoices(userId, {
    status: ['pending', 'overdue'],
  });

  let sent = 0;
  let errors = 0;

  // Process each invoice
  for (const invoice of invoices) {
    try {
      const shouldSendReminder = await checkShouldSendReminder(invoice);
      
      if (shouldSendReminder) {
        const client = await getClient(invoice.clientId);
        
        if (!client) {
          console.error(`Client not found for invoice ${invoice.id}`);
          errors++;
          continue;
        }
        
        // Determine reminder level based on how many have been sent already
        const level = determineReminderLevel(invoice, client);
        
        // Get appropriate template for this level and client
        const template = await getAppropriateTemplate(userId, level, client);
        
        if (!template) {
          console.error(`No template found for level ${level}`);
          errors++;
          continue;
        }
        
        // Send the reminder email
        await sendReminderEmail(invoice, client, template);
        
        // Update invoice with reminder sent info
        await recordReminderSent(invoice.id);
        
        // Update status to overdue if not already
        if (invoice.status === 'pending' && level !== 'pre-due') {
          await updateInvoice(invoice.id, { status: 'overdue' });
        }
        
        sent++;
      }
    } catch (error) {
      console.error(`Error processing reminder for invoice ${invoice.id}:`, error);
      errors++;
    }
  }

  return {
    processed: invoices.length,
    sent,
    errors,
  };
}

/**
 * Determine if a reminder should be sent for this invoice
 */
async function checkShouldSendReminder(invoice: Invoice): Promise<boolean> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const dueDate = new Date(invoice.dueDate);
  dueDate.setHours(0, 0, 0, 0);
  
  // Don't send reminders for future due dates (except pre-due reminders)
  if (dueDate > today && invoice.remindersSent && invoice.remindersSent > 0) {
    return false;
  }
  
  // If no reminders have been sent yet
  if (!invoice.remindersSent || invoice.remindersSent === 0) {
    // For pre-due reminders, check if we're within the pre-due window
    const client = await getClient(invoice.clientId);
    if (!client) return false;
    
    const preDueDays = client.reminderPreferences?.preDueDays || 3;
    const preDueDate = new Date(dueDate);
    preDueDate.setDate(preDueDate.getDate() - preDueDays);
    
    if (client.reminderPreferences?.sendPreDueReminder && today >= preDueDate && today < dueDate) {
      return true;
    }
    
    // For first overdue reminder, check if due date has passed
    const firstReminderDays = client.reminderPreferences?.firstReminderDays || 1;
    const firstReminderDate = new Date(dueDate);
    firstReminderDate.setDate(firstReminderDate.getDate() + firstReminderDays);
    
    return today >= firstReminderDate;
  }
  
  // For subsequent reminders, check interval
  if (invoice.lastReminderSent) {
    const client = await getClient(invoice.clientId);
    if (!client) return false;
    
    const lastReminderDate = new Date(invoice.lastReminderSent);
    lastReminderDate.setHours(0, 0, 0, 0);
    
    const reminderInterval = client.reminderPreferences?.reminderInterval || 5;
    const nextReminderDate = new Date(lastReminderDate);
    nextReminderDate.setDate(nextReminderDate.getDate() + reminderInterval);
    
    const maxReminders = client.reminderPreferences?.maxReminders || 3;
    
    // Check if we've reached max reminders
    if (invoice.remindersSent && invoice.remindersSent >= maxReminders) {
      return false;
    }
    
    return today >= nextReminderDate;
  }
  
  return false;
}

/**
 * Determine the appropriate reminder level based on invoice status and number of reminders sent
 */
function determineReminderLevel(invoice: Invoice, client: Client): ReminderLevel {
  // Pre-due reminder
  const dueDate = new Date(invoice.dueDate);
  dueDate.setHours(0, 0, 0, 0);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (today < dueDate) {
    return 'pre-due';
  }
  
  // On the due date
  if (today.getTime() === dueDate.getTime()) {
    return 'due';
  }
  
  // Past due date
  const remindersSent = invoice.remindersSent || 0;
  
  // Scale level based on how many reminders have been sent
  if (remindersSent === 0) {
    return 'gentle';
  } else if (remindersSent === 1) {
    return 'firm';
  } else if (remindersSent === 2) {
    return 'assertive';
  } else {
    return 'final';
  }
} 