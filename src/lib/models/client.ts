export type ClientCategory = 'standard' | 'vip' | 'problematic';

export interface Client {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  category: ClientCategory;
  notes?: string;
  reminderPreferences?: ReminderPreferences;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface ReminderPreferences {
  // Whether to send reminder before due date
  sendPreDueReminder: boolean;
  // Days before due date to send reminder (if enabled)
  preDueDays: number;
  // Days after due date for first reminder
  firstReminderDays: number;
  // Days between subsequent reminders
  reminderInterval: number;
  // Maximum number of reminders to send
  maxReminders: number;
  // Which template set to use
  templateStyle: 'friendly' | 'neutral' | 'firm' | 'formal';
} 