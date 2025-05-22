"use client";

import { useState, useCallback, useEffect } from "react";
import {
  collection,
  addDoc,
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
import { firestore } from "../firebase"; 
import type { Lead } from "../types";

// Firestore collection name
const LEADS_COLLECTION = 'leads';

// Reminder: Manual Data Seeding
// If you have existing data in `lib/data.ts` (e.g., from a previous `getAllLeads()` function),
// you will need to manually seed this data into your Firestore 'leads'
// collection to see it in the application. Alternatively, you can create new
// leads via the UI.

// Helper to convert Firestore doc data to Lead type, handling Timestamps
const fromFirestore = (snapshot: QueryDocumentSnapshot<DocumentData>): Lead => {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    interest: data.interest,
    source: data.source,
    status: data.status,
    notes: data.notes,
    // Convert Timestamps to JS Dates, ensuring optional fields are handled
    lastContact: data.lastContact instanceof Timestamp ? data.lastContact.toDate() : undefined,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : undefined,
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : undefined,
  } as Lead;
};

interface UseLeadsReturn {
  leads: Lead[];
  loading: boolean;
  error: string | null;
  createLead: (leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Lead | undefined>;
  updateLead: (id: string, updates: Partial<Omit<Lead, 'id' | 'createdAt'>>) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  // getLeadById: (id: string) => Promise<Lead | null>; // Optional, not explicitly requested for return but good for completeness
}

export function useLeads(): UseLeadsReturn {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Real-time listener for lead data
  useEffect(() => {
    setLoading(true);
    const q = query(collection(firestore, LEADS_COLLECTION), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const leadsList: Lead[] = [];
      querySnapshot.forEach((docSnap) => {
        leadsList.push(fromFirestore(docSnap));
      });
      setLeads(leadsList);
      setLoading(false);
      setError(null);
    }, (err) => {
      console.error("Error fetching leads with onSnapshot: ", err);
      setError(`Failed to subscribe to lead updates: ${err.message}`);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  // Create operation
  const createLead = useCallback(async (leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lead | undefined> => {
    setLoading(true); 
    setError(null);
    try {
      const newLeadDataFirebase: any = {
        ...leadData, // Spread leadData first
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };
      
      // Convert lastContact to Timestamp if it exists and is a Date
      if (leadData.lastContact && leadData.lastContact instanceof Date) {
        newLeadDataFirebase.lastContact = Timestamp.fromDate(leadData.lastContact);
      } else if (leadData.lastContact === undefined || leadData.lastContact === null) {
        // If lastContact is not provided or explicitly null, store it as null (or omit it)
        newLeadDataFirebase.lastContact = null; 
      }

      const docRef = await addDoc(collection(firestore, LEADS_COLLECTION), newLeadDataFirebase);
      setLoading(false);
      // Return the created lead object with JS Dates
      return { 
        ...leadData, 
        id: docRef.id, 
        createdAt: (newLeadDataFirebase.createdAt as Timestamp).toDate(), 
        updatedAt: (newLeadDataFirebase.updatedAt as Timestamp).toDate(),
        lastContact: leadData.lastContact ? new Date(leadData.lastContact) : undefined, 
      };
    } catch (err: any) {
      console.error("Error creating lead: ", err);
      setError(`Failed to create lead: ${err.message}`);
      setLoading(false);
      throw err;
    }
  }, []);

  // Update operation
  const updateLead = useCallback(async (id: string, updates: Partial<Omit<Lead, 'id' | 'createdAt'>>) => {
    setLoading(true);
    setError(null);
    try {
      const docRef = doc(firestore, LEADS_COLLECTION, id);
      const updatesFirebase: {[key:string]: any} = { ...updates };

      // Convert lastContact to Timestamp if it's part of updates and is a Date
      if (updates.lastContact && updates.lastContact instanceof Date) {
        updatesFirebase.lastContact = Timestamp.fromDate(updates.lastContact);
      } else if (updates.hasOwnProperty('lastContact') && (updates.lastContact === undefined || updates.lastContact === null)) {
         // If lastContact is explicitly being set to undefined or null
        updatesFirebase.lastContact = null;
      }
      
      updatesFirebase.updatedAt = Timestamp.now();
      
      await updateDoc(docRef, updatesFirebase);
      setLoading(false);
      // onSnapshot will update the local state
    } catch (err: any) {
      console.error("Error updating lead: ", err);
      setError(`Failed to update lead: ${err.message}`);
      setLoading(false);
      throw err;
    }
  }, []);

  // Delete operation
  const deleteLead = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const docRef = doc(firestore, LEADS_COLLECTION, id);
      await deleteDoc(docRef);
      setLoading(false);
      // onSnapshot will update the local state
    } catch (err: any) {
      console.error("Error deleting lead: ", err);
      setError(`Failed to delete lead: ${err.message}`);
      setLoading(false);
      throw err;
    }
  }, []);

  return {
    leads,
    loading,
    error,
    createLead,
    updateLead,
    deleteLead,
  };
}
