import { collection, query, where, orderBy, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import { ReminderTemplate, ReminderLevel, ReminderStyle, ReminderHistory } from '../models/reminder';
import { sendEmail } from '../email/resend';
import { Invoice } from '../models/invoice';
import { Client } from '../models/client';

const TEMPLATES_COLLECTION = 'reminderTemplates';
const HISTORY_COLLECTION = 'reminderHistory';

/**
 * Create a new reminder template
 */
export async function createTemplate(
  templateData: Omit<ReminderTemplate, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ReminderTemplate> {
  const templatesRef = collection(db, TEMPLATES_COLLECTION);
  
  const timestamp = new Date().toISOString();
  const newTemplate = {
    ...templateData,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  
  const docRef = await addDoc(templatesRef, newTemplate);
  
  return {
    id: docRef.id,
    ...newTemplate,
  } as ReminderTemplate;
}

/**
 * Update an existing template
 */
export async function updateTemplate(
  id: string,
  templateData: Partial<ReminderTemplate>
): Promise<ReminderTemplate> {
  const templateRef = doc(db, TEMPLATES_COLLECTION, id);
  
  const updatedData = {
    ...templateData,
    updatedAt: new Date().toISOString(),
  };
  
  await updateDoc(templateRef, updatedData);
  
  // Get the updated document
  const updatedDoc = await getDoc(templateRef);
  
  if (!updatedDoc.exists()) {
    throw new Error('Template not found');
  }
  
  return {
    id: updatedDoc.id,
    ...updatedDoc.data(),
  } as ReminderTemplate;
}

/**
 * Delete a template
 */
export async function deleteTemplate(id: string): Promise<void> {
  const templateRef = doc(db, TEMPLATES_COLLECTION, id);
  await deleteDoc(templateRef);
}

/**
 * Get a single template by ID
 */
export async function getTemplate(id: string): Promise<ReminderTemplate | null> {
  const templateRef = doc(db, TEMPLATES_COLLECTION, id);
  const templateDoc = await getDoc(templateRef);
  
  if (!templateDoc.exists()) {
    return null;
  }
  
  return {
    id: templateDoc.id,
    ...templateDoc.data(),
  } as ReminderTemplate;
}

/**
 * Get templates by level and style
 */
export async function getTemplates(
  userId: string,
  level?: ReminderLevel,
  style?: ReminderStyle
): Promise<ReminderTemplate[]> {
  // Start with user-specific templates or system templates
  let q = query(
    collection(db, TEMPLATES_COLLECTION),
    where('userId', 'in', [userId, null]),
    orderBy('level', 'asc')
  );
  
  // Filter by level if provided
  if (level) {
    q = query(q, where('level', '==', level));
  }
  
  // Filter by style if provided
  if (style) {
    q = query(q, where('style', '==', style));
  }
  
  const querySnapshot = await getDocs(q);
  const templates: ReminderTemplate[] = [];
  
  querySnapshot.forEach((doc) => {
    templates.push({
      id: doc.id,
      ...doc.data(),
    } as ReminderTemplate);
  });
  
  return templates;
}

/**
 * Get appropriate template for a reminder
 */
export async function getAppropriateTemplate(
  userId: string,
  level: ReminderLevel,
  client: Client
): Promise<ReminderTemplate | null> {
  // Get client's preferred style, or use default
  const style = client.reminderPreferences?.templateStyle || 'friendly';
  
  // Try to find a template matching level and style
  const templates = await getTemplates(userId, level, style);
  
  // Return the first matching template if found
  if (templates.length > 0) {
    return templates[0];
  }
  
  // Fall back to any template of the right level
  const fallbackTemplates = await getTemplates(userId, level);
  
  return fallbackTemplates.length > 0 ? fallbackTemplates[0] : null;
}

/**
 * Send a reminder email
 */
export async function sendReminderEmail(
  invoice: Invoice,
  client: Client,
  template: ReminderTemplate
): Promise<ReminderHistory> {
  // Replace variables in the template
  const subject = replaceVariables(template.subject, invoice, client);
  const body = replaceVariables(template.body, invoice, client);
  
  // Send the email
  await sendEmail({
    to: client.email,
    subject,
    html: body,
  });
  
  // Record the reminder in history
  const reminderData: Omit<ReminderHistory, 'id'> = {
    invoiceId: invoice.id,
    templateId: template.id,
    sentAt: new Date().toISOString(),
    level: template.level,
    to: client.email,
    subject,
    body,
    status: 'sent',
  };
  
  const historyRef = collection(db, HISTORY_COLLECTION);
  const docRef = await addDoc(historyRef, reminderData);
  
  return {
    id: docRef.id,
    ...reminderData,
  } as ReminderHistory;
}

/**
 * Replace variables in templates with actual values
 */
function replaceVariables(text: string, invoice: Invoice, client: Client): string {
  const variables: Record<string, string> = {
    '{client_name}': client.name,
    '{client_email}': client.email,
    '{invoice_number}': invoice.invoiceNumber,
    '{invoice_amount}': `${invoice.amount.toFixed(2)} ${invoice.currency}`,
    '{invoice_date}': formatDate(invoice.issueDate),
    '{due_date}': formatDate(invoice.dueDate),
    '{days_overdue}': getDaysOverdue(invoice.dueDate).toString(),
    '{client_company}': client.company || '',
  };
  
  // Replace variables in the text
  let result = text;
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(key, 'g'), value);
  }
  
  return result;
}

/**
 * Format a date string
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Calculate days overdue from due date
 */
function getDaysOverdue(dueDate: string): number {
  const today = new Date();
  const due = new Date(dueDate);
  
  // Reset time part for accurate day calculation
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  
  const diffTime = today.getTime() - due.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
}

/**
 * Get reminder history for an invoice
 */
export async function getReminderHistory(invoiceId: string): Promise<ReminderHistory[]> {
  const q = query(
    collection(db, HISTORY_COLLECTION),
    where('invoiceId', '==', invoiceId),
    orderBy('sentAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  const history: ReminderHistory[] = [];
  
  querySnapshot.forEach((doc) => {
    history.push({
      id: doc.id,
      ...doc.data(),
    } as ReminderHistory);
  });
  
  return history;
} 