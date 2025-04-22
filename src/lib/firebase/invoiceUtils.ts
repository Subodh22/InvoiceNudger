import { collection, query, where, orderBy, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { Invoice, InvoiceFilters, InvoiceStatus } from '../models/invoice';

const INVOICES_COLLECTION = 'invoices';

/**
 * Create a new invoice in Firestore
 */
export async function createInvoice(invoiceData: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>): Promise<Invoice> {
  const invoicesRef = collection(db, INVOICES_COLLECTION);
  
  const timestamp = new Date().toISOString();
  const newInvoice = {
    ...invoiceData,
    status: invoiceData.status || 'draft',
    createdAt: timestamp,
    updatedAt: timestamp,
    remindersSent: 0,
  };
  
  const docRef = await addDoc(invoicesRef, newInvoice);
  
  return {
    id: docRef.id,
    ...newInvoice,
  } as Invoice;
}

/**
 * Update an existing invoice
 */
export async function updateInvoice(id: string, invoiceData: Partial<Invoice>): Promise<Invoice> {
  const invoiceRef = doc(db, INVOICES_COLLECTION, id);
  
  const updatedData = {
    ...invoiceData,
    updatedAt: new Date().toISOString(),
  };
  
  await updateDoc(invoiceRef, updatedData);
  
  // Get the updated document
  const updatedDoc = await getDoc(invoiceRef);
  
  if (!updatedDoc.exists()) {
    throw new Error('Invoice not found');
  }
  
  return {
    id: updatedDoc.id,
    ...updatedDoc.data(),
  } as Invoice;
}

/**
 * Delete an invoice
 */
export async function deleteInvoice(id: string): Promise<void> {
  const invoiceRef = doc(db, INVOICES_COLLECTION, id);
  await deleteDoc(invoiceRef);
}

/**
 * Get a single invoice by ID
 */
export async function getInvoice(id: string): Promise<Invoice | null> {
  const invoiceRef = doc(db, INVOICES_COLLECTION, id);
  const invoiceDoc = await getDoc(invoiceRef);
  
  if (!invoiceDoc.exists()) {
    return null;
  }
  
  return {
    id: invoiceDoc.id,
    ...invoiceDoc.data(),
  } as Invoice;
}

/**
 * Get invoices with optional filters
 */
export async function getInvoices(userId: string, filters?: InvoiceFilters): Promise<Invoice[]> {
  let q = query(
    collection(db, INVOICES_COLLECTION),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  // Apply filters if provided
  if (filters) {
    if (filters.status) {
      const statusArray = Array.isArray(filters.status) ? filters.status : [filters.status];
      q = query(q, where('status', 'in', statusArray));
    }
    
    if (filters.clientId) {
      q = query(q, where('clientId', '==', filters.clientId));
    }
    
    // Date filters and amount filters would need to be applied after fetching the data
  }
  
  const querySnapshot = await getDocs(q);
  const invoices: Invoice[] = [];
  
  querySnapshot.forEach((doc) => {
    invoices.push({
      id: doc.id,
      ...doc.data(),
    } as Invoice);
  });
  
  // Apply additional filters that can't be done in Firestore query
  let filteredInvoices = invoices;
  
  if (filters) {
    if (filters.fromDate) {
      filteredInvoices = filteredInvoices.filter(
        (invoice) => new Date(invoice.issueDate) >= new Date(filters.fromDate!)
      );
    }
    
    if (filters.toDate) {
      filteredInvoices = filteredInvoices.filter(
        (invoice) => new Date(invoice.issueDate) <= new Date(filters.toDate!)
      );
    }
    
    if (filters.minAmount !== undefined) {
      filteredInvoices = filteredInvoices.filter(
        (invoice) => invoice.amount >= filters.minAmount!
      );
    }
    
    if (filters.maxAmount !== undefined) {
      filteredInvoices = filteredInvoices.filter(
        (invoice) => invoice.amount <= filters.maxAmount!
      );
    }
  }
  
  return filteredInvoices;
}

/**
 * Update invoice status
 */
export async function updateInvoiceStatus(id: string, status: InvoiceStatus): Promise<Invoice> {
  const updatedData: Partial<Invoice> = {
    status,
    updatedAt: new Date().toISOString(),
  };
  
  // If marking as paid, update paid date
  if (status === 'paid') {
    updatedData.paidDate = new Date().toISOString();
  }
  
  return updateInvoice(id, updatedData);
}

/**
 * Record a reminder sent for an invoice
 */
export async function recordReminderSent(id: string): Promise<Invoice> {
  const invoice = await getInvoice(id);
  
  if (!invoice) {
    throw new Error('Invoice not found');
  }
  
  const remindersSent = (invoice.remindersSent || 0) + 1;
  
  return updateInvoice(id, {
    remindersSent,
    lastReminderSent: new Date().toISOString(),
  });
} 