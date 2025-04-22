export type ReminderLevel = 'pre-due' | 'due' | 'gentle' | 'firm' | 'assertive' | 'final';
export type ReminderStyle = 'friendly' | 'neutral' | 'firm' | 'formal';

export interface ReminderTemplate {
  id: string;
  userId: string; // If custom template, otherwise null for system templates
  name: string;
  level: ReminderLevel;
  style: ReminderStyle;
  subject: string;
  body: string;
  isDefault: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface ReminderHistory {
  id: string;
  invoiceId: string;
  templateId: string;
  sentAt: string; // ISO date string
  level: ReminderLevel;
  to: string;
  subject: string;
  body: string;
  status: 'sent' | 'delivered' | 'opened' | 'clicked' | 'failed';
  failureReason?: string;
}

export interface ReminderSchedule {
  invoiceId: string;
  nextReminderDate: string; // ISO date string
  nextReminderLevel: ReminderLevel;
  isActive: boolean;
} 