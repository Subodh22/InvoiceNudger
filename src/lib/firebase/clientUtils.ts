import { collection, query, where, orderBy, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import { Client, ClientCategory } from '../models/client';

const CLIENTS_COLLECTION = 'clients';

/**
 * Create a new client in Firestore
 */
export async function createClient(userData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client> {
  const clientsRef = collection(db, CLIENTS_COLLECTION);
  
  const timestamp = new Date().toISOString();
  const newClient = {
    ...userData,
    category: userData.category || 'standard',
    reminderPreferences: userData.reminderPreferences || {
      sendPreDueReminder: true,
      preDueDays: 3,
      firstReminderDays: 1,
      reminderInterval: 5,
      maxReminders: 3,
      templateStyle: 'friendly',
    },
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  
  const docRef = await addDoc(clientsRef, newClient);
  
  return {
    id: docRef.id,
    ...newClient,
  } as Client;
}

/**
 * Update an existing client
 */
export async function updateClient(id: string, clientData: Partial<Client>): Promise<Client> {
  const clientRef = doc(db, CLIENTS_COLLECTION, id);
  
  const updatedData = {
    ...clientData,
    updatedAt: new Date().toISOString(),
  };
  
  await updateDoc(clientRef, updatedData);
  
  // Get the updated document
  const updatedDoc = await getDoc(clientRef);
  
  if (!updatedDoc.exists()) {
    throw new Error('Client not found');
  }
  
  return {
    id: updatedDoc.id,
    ...updatedDoc.data(),
  } as Client;
}

/**
 * Delete a client
 */
export async function deleteClient(id: string): Promise<void> {
  const clientRef = doc(db, CLIENTS_COLLECTION, id);
  await deleteDoc(clientRef);
}

/**
 * Get a single client by ID
 */
export async function getClient(id: string): Promise<Client | null> {
  const clientRef = doc(db, CLIENTS_COLLECTION, id);
  const clientDoc = await getDoc(clientRef);
  
  if (!clientDoc.exists()) {
    return null;
  }
  
  return {
    id: clientDoc.id,
    ...clientDoc.data(),
  } as Client;
}

/**
 * Get all clients for a user
 */
export async function getClients(userId: string, category?: ClientCategory): Promise<Client[]> {
  let q = query(
    collection(db, CLIENTS_COLLECTION),
    where('userId', '==', userId),
    orderBy('name', 'asc')
  );
  
  // Filter by category if provided
  if (category) {
    q = query(q, where('category', '==', category));
  }
  
  const querySnapshot = await getDocs(q);
  const clients: Client[] = [];
  
  querySnapshot.forEach((doc) => {
    clients.push({
      id: doc.id,
      ...doc.data(),
    } as Client);
  });
  
  return clients;
}

/**
 * Update client category
 */
export async function updateClientCategory(id: string, category: ClientCategory): Promise<Client> {
  return updateClient(id, { category });
} 