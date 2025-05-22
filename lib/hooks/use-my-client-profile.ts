"use client";

import { useState, useEffect } from "react";
import {
  doc,
  onSnapshot,
  Timestamp,
  DocumentData,
  DocumentSnapshot,
} from "firebase/firestore";
import { firestore } from "../firebase"; 
import type { Client } from "../types";

// Firestore collection name
const CLIENTS_COLLECTION = 'clients';

// Helper to convert Firestore doc data to Client type, handling Timestamps
const fromFirestoreClient = (snapshot: DocumentSnapshot<DocumentData>): Client => {
  const data = snapshot.data() as DocumentData; // Ensure data is treated as DocumentData
  return {
    id: snapshot.id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    address: data.address,
    type: data.type,
    status: data.status,
    // Safely convert Timestamps to Dates, ensuring fields exist
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : undefined,
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : undefined,
    // Add other Client fields as necessary, ensuring they exist on 'data'
    // For example, if 'notes' is a field:
    // notes: data.notes, 
  } as Client; // Cast to Client, assuming all required fields are present or handled
};

interface UseMyClientProfileReturn {
  clientProfile: Client | null;
  loading: boolean;
  error: string | null;
}

export function useMyClientProfile(uid: string | null | undefined): UseMyClientProfileReturn {
  const [clientProfile, setClientProfile] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uid) {
      setClientProfile(null);
      setLoading(false);
      setError(null); // Or set an error indicating UID is missing if that's an error condition
      return;
    }

    setLoading(true);
    setError(null);

    const clientDocRef = doc(firestore, CLIENTS_COLLECTION, uid);
    
    const unsubscribe = onSnapshot(clientDocRef, 
      (docSnap) => {
        if (docSnap.exists()) {
          try {
            setClientProfile(fromFirestoreClient(docSnap));
            setError(null);
          } catch (e: any) {
            console.error("Error processing client document data:", e);
            setError(`Failed to process client data: ${e.message}`);
            setClientProfile(null);
          }
        } else {
          console.warn(`Client document with UID ${uid} does not exist.`);
          setClientProfile(null);
          // Optionally set an error if a client profile is strictly expected
          // setError("Client profile not found."); 
        }
        setLoading(false);
      }, 
      (err) => {
        console.error(`Error fetching client profile for UID ${uid}:`, err);
        setError(`Failed to subscribe to client profile updates: ${err.message}`);
        setClientProfile(null);
        setLoading(false);
      }
    );

    return () => unsubscribe(); // Cleanup subscription on unmount or when UID changes
  }, [uid]);

  return { clientProfile, loading, error };
}
