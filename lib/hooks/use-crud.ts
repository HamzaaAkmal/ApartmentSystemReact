"use client";

import { useState, useCallback, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  onSnapshot,
  query,
  orderBy,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { firestore } from "../firebase"; // Adjust path if your firebase config is elsewhere
import type { Client } from "../types"; // Assuming your Client type is here

// Firestore collection name
const CLIENTS_COLLECTION = 'clients';

// Reminder: Manual Data Seeding
// If you have existing data in `lib/data.ts` (e.g., from `getAllClients()`),
// you will need to manually seed this data into your Firestore 'clients'
// collection to see it in the application. Alternatively, you can create new
// clients via the UI.

// Helper to convert Firestore doc data to Client type, handling Timestamps
const fromFirestore = (snapshot: QueryDocumentSnapshot<DocumentData>): Client => {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    ...data,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(),
  } as Client;
};

export function useCrud() {
  const [items, setItems] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true); // Start with loading true for initial fetch
  const [error, setError] = useState<string | null>(null);

  // Real-time listener for client data
  useEffect(() => {
    setLoading(true);
    const q = query(collection(firestore, CLIENTS_COLLECTION), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const clientsList: Client[] = [];
      querySnapshot.forEach((docSnap) => {
        clientsList.push(fromFirestore(docSnap));
      });
      setItems(clientsList);
      setLoading(false);
      setError(null);
    }, (err) => {
      console.error("Error fetching clients with onSnapshot: ", err);
      setError(`Failed to subscribe to client updates: ${err.message}`);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  // Create operation
  const create = useCallback(async (itemData: Omit<Client, "id" | "createdAt" | "updatedAt">) => {
    setLoading(true);
    setError(null);
    try {
      const newClientData = {
        ...itemData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };
      const docRef = await addDoc(collection(firestore, CLIENTS_COLLECTION), newClientData);
      setLoading(false);
      // No need to manually add to items state, onSnapshot will handle it.
      return { ...newClientData, id: docRef.id, createdAt: newClientData.createdAt.toDate(), updatedAt: newClientData.updatedAt.toDate() } as Client;
    } catch (err: any) {
      console.error("Error creating client: ", err);
      setError(`Failed to create client: ${err.message}`);
      setLoading(false);
      throw err;
    }
  }, []);

  // Read operation (get by id) - primarily for individual fetches if needed, though onSnapshot covers list updates
  const getById = useCallback(async (id: string): Promise<Client | null> => {
    setLoading(true);
    setError(null);
    try {
      const docRef = doc(firestore, CLIENTS_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      setLoading(false);
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
          updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(),
        } as Client;
      } else {
        return null;
      }
    } catch (err: any) {
      console.error("Error fetching client by ID: ", err);
      setError(`Failed to fetch client: ${err.message}`);
      setLoading(false);
      throw err;
    }
  }, []);

  // Update operation
  const update = useCallback(async (id: string, updates: Partial<Omit<Client, "id" | "createdAt">>) => {
    setLoading(true);
    setError(null);
    try {
      const docRef = doc(firestore, CLIENTS_COLLECTION, id);
      // Prepare data for Firestore: convert Dates to Timestamps, add updatedAt
      const updatesWithTimestamp: { [key: string]: any } = { ...updates, updatedAt: Timestamp.now() };
      
      // Convert any Date objects in 'updates' to Firestore Timestamps
      for (const key in updates) {
        if (updates[key as keyof typeof updates] instanceof Date) {
          updatesWithTimestamp[key] = Timestamp.fromDate(updates[key as keyof typeof updates] as Date);
        }
      }

      await updateDoc(docRef, updatesWithTimestamp);
      setLoading(false);
      // onSnapshot will update the local state
      // For immediate feedback or if not relying solely on onSnapshot for this specific update:
      // setItems(prevItems => prevItems.map(item => item.id === id ? { ...item, ...updates, updatedAt: (updatesWithTimestamp.updatedAt as Timestamp).toDate() } : item));
      return { id, ...updates, updatedAt: (updatesWithTimestamp.updatedAt as Timestamp).toDate() } as Partial<Client>;
    } catch (err: any) {
      console.error("Error updating client: ", err);
      setError(`Failed to update client: ${err.message}`);
      setLoading(false);
      throw err;
    }
  }, []);

  // Delete operation
  const remove = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const docRef = doc(firestore, CLIENTS_COLLECTION, id);
      await deleteDoc(docRef);
      setLoading(false);
      // onSnapshot will update the local state
      return true;
    } catch (err: any) {
      console.error("Error deleting client: ", err);
      setError(`Failed to delete client: ${err.message}`);
      setLoading(false);
      throw err;
    }
  }, []);
  
  // Filter operation - This will now filter the already fetched & real-time updated 'items'
  const filter = useCallback(
    (filterFn: (item: Client) => boolean) => {
      return items.filter(filterFn);
    },
    [items], // Re-filter when items change
  );

  // Get all operation - Returns current local state, managed by onSnapshot
   const getAll = useCallback(() => {
    return items;
  }, [items]);


  return {
    items,
    loading,
    error,
    create,
    getAll, // Use this to get the current list of clients
    getById,
    update,
    remove,
    filter, // Keep local filter if needed for UI
    // setItems is not directly exposed to prevent manual state manipulation
    // that might conflict with Firestore's real-time updates.
  };
}
