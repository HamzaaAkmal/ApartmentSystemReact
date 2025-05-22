"use client";

import { useState, useCallback, useEffect } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  // deleteDoc, // Optional for now
  doc,
  Timestamp,
  onSnapshot,
  query,
  where,
  orderBy,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { firestore } from "../firebase"; 
import type { SupportTicket, SupportTicketStatus } from "../types";

// Firestore collection name
const SUPPORT_TICKETS_COLLECTION = 'supportTickets';

// Helper to convert Firestore doc data to SupportTicket type, handling Timestamps
const fromFirestore = (snapshot: QueryDocumentSnapshot<DocumentData>): SupportTicket => {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    clientId: data.clientId,
    firebaseUserId: data.firebaseUserId,
    subject: data.subject,
    message: data.message,
    status: data.status as SupportTicketStatus,
    submittedAt: data.submittedAt instanceof Timestamp ? data.submittedAt.toDate() : new Date(), // Fallback, though submittedAt should always exist
    lastUpdatedAt: data.lastUpdatedAt instanceof Timestamp ? data.lastUpdatedAt.toDate() : undefined,
    resolvedAt: data.resolvedAt instanceof Timestamp ? data.resolvedAt.toDate() : undefined,
    priority: data.priority,
    category: data.category,
  } as SupportTicket;
};

interface UseSupportTicketsReturn {
  tickets: SupportTicket[];
  loading: boolean;
  error: string | null;
  createSupportTicket: (ticketData: Omit<SupportTicket, 'id' | 'submittedAt' | 'lastUpdatedAt' | 'status' | 'resolvedAt'>) => Promise<SupportTicket | undefined>;
  updateSupportTicket: (ticketId: string, updates: Partial<Omit<SupportTicket, 'id' | 'clientId' | 'firebaseUserId' | 'submittedAt'>>) => Promise<void>;
  // deleteSupportTicket: (ticketId: string) => Promise<void>; // Optional
}

export function useSupportTickets(clientId?: string): UseSupportTicketsReturn {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    let q;
    if (clientId) {
      q = query(
        collection(firestore, SUPPORT_TICKETS_COLLECTION),
        where("clientId", "==", clientId),
        orderBy("submittedAt", "desc")
      );
    } else {
      // Admin view: fetch all tickets
      q = query(
        collection(firestore, SUPPORT_TICKETS_COLLECTION),
        orderBy("submittedAt", "desc")
      );
    }
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const ticketsList: SupportTicket[] = [];
      querySnapshot.forEach((docSnap) => {
        try {
          ticketsList.push(fromFirestore(docSnap));
        } catch (e: any) {
            console.error("Error processing support ticket document data:", e);
            // Decide if one bad doc should break all, or just skip it
        }
      });
      setTickets(ticketsList);
      setLoading(false);
      setError(null);
    }, (err) => {
      console.error("Error fetching support tickets with onSnapshot: ", err);
      setError(`Failed to subscribe to support ticket updates: ${err.message}`);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [clientId]);

  // Create operation
  const createSupportTicket = useCallback(async (
    ticketData: Omit<SupportTicket, 'id' | 'submittedAt' | 'lastUpdatedAt' | 'status' | 'resolvedAt'>
  ): Promise<SupportTicket | undefined> => {
    // setLoading(true); // Consider if global loading is appropriate here or a specific createLoading state
    setError(null);
    try {
      const newTicketDataFirebase = {
        ...ticketData,
        submittedAt: Timestamp.now(),
        lastUpdatedAt: Timestamp.now(),
        status: "open" as SupportTicketStatus,
        // resolvedAt will be undefined initially
      };
      
      const docRef = await addDoc(collection(firestore, SUPPORT_TICKETS_COLLECTION), newTicketDataFirebase);
      // setLoading(false);
      
      return { 
        ...ticketData, 
        id: docRef.id, 
        submittedAt: (newTicketDataFirebase.submittedAt as Timestamp).toDate(), 
        lastUpdatedAt: (newTicketDataFirebase.lastUpdatedAt as Timestamp).toDate(),
        status: "open" as SupportTicketStatus,
      };
    } catch (err: any) {
      console.error("Error creating support ticket: ", err);
      setError(`Failed to create support ticket: ${err.message}`);
      // setLoading(false);
      throw err; // Re-throw to allow caller to handle
    }
  }, []);

  // Update operation
  const updateSupportTicket = useCallback(async (
    ticketId: string, 
    updates: Partial<Omit<SupportTicket, 'id' | 'clientId' | 'firebaseUserId' | 'submittedAt'>>
  ) => {
    // setLoading(true); // Consider specific updateLoading state
    setError(null);
    try {
      const ticketDocRef = doc(firestore, SUPPORT_TICKETS_COLLECTION, ticketId);
      const updatesWithTimestamp: {[key: string]: any} = { 
        ...updates, 
        lastUpdatedAt: Timestamp.now() 
      };

      if (updates.status && (updates.status === "resolved" || updates.status === "closed")) {
        updatesWithTimestamp.resolvedAt = Timestamp.now();
      }
      
      await updateDoc(ticketDocRef, updatesWithTimestamp);
      // setLoading(false);
    } catch (err: any) {
      console.error("Error updating support ticket: ", err);
      setError(`Failed to update support ticket: ${err.message}`);
      // setLoading(false);
      throw err; // Re-throw
    }
  }, []);

  return {
    tickets,
    loading,
    error,
    createSupportTicket,
    updateSupportTicket,
  };
}
