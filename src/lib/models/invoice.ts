export type InvoiceStatus = 'draft' | 'sent' | 'pending' | 'overdue' | 'paid' | 'cancelled';

export interface Invoice {
  id: string;
  userId: string;
  clientId: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  issueDate: string; // ISO date string
  dueDate: string; // ISO date string
  status: InvoiceStatus;
  description: string;
  items?: InvoiceItem[];
  notes?: string;
  terms?: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  lastReminderSent?: string; // ISO date string
  remindersSent?: number;
  paidDate?: string; // ISO date string
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface InvoiceFilters {
  status?: InvoiceStatus | InvoiceStatus[];
  clientId?: string;
  fromDate?: string;
  toDate?: string;
  minAmount?: number;
  maxAmount?: number;
} 