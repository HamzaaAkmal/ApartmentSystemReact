"use client";

import { useState, useCallback, useEffect } from "react";
import {
  collection,
  addDoc,
  Timestamp,
  onSnapshot,
  query,
  orderBy,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { firestore } from "../firebase"; // Adjust path if your firebase config is elsewhere
import type { Interaction, InteractionType } from "../types"; // Assuming your Interaction type is here

// Firestore collection constants
const CLIENTS_COLLECTION = 'clients';
const INTERACTIONS_SUBCOLLECTION = 'interactions';

// Helper to convert Firestore doc data to Interaction type, handling Timestamps
const fromFirestore = (snapshot: QueryDocumentSnapshot<DocumentData>): Interaction => {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    clientId: data.clientId, // Should be present in the document data
    type: data.type as InteractionType,
    content: data.content,
    userId: data.userId,
    timestamp: data.timestamp instanceof Timestamp ? data.timestamp.toDate() : new Date(),
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(),
  } as Interaction;
};

interface UseInteractionsReturn {
  interactions: Interaction[];
  loading: boolean;
  error: string | null;
  addInteraction: (interactionData: Omit<Interaction, 'id' | 'clientId' | 'createdAt' | 'updatedAt'>) => Promise<Interaction | undefined>;
}

export function useInteractions(clientId: string | undefined | null): UseInteractionsReturn {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Real-time listener for interaction subcollection data
  useEffect(() => {
    if (!clientId) {
      setInteractions([]);
      setLoading(false);
      // setError("Client ID is required to fetch interactions."); // Optional: set error if clientId is missing
      return;
    }

    setLoading(true);
    const interactionsPath = `${CLIENTS_COLLECTION}/${clientId}/${INTERACTIONS_SUBCOLLECTION}`;
    const q = query(collection(firestore, interactionsPath), orderBy("timestamp", "desc"));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const interactionList: Interaction[] = [];
      querySnapshot.forEach((docSnap) => {
        interactionList.push(fromFirestore(docSnap));
      });
      setInteractions(interactionList);
      setLoading(false);
      setError(null);
    }, (err) => {
      console.error(`Error fetching interactions for client ${clientId}: `, err);
      setError(`Failed to subscribe to interaction updates: ${err.message}`);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [clientId]); // Re-run effect if clientId changes

  // Add interaction operation
  const addInteraction = useCallback(async (
    interactionData: Omit<Interaction, 'id' | 'clientId' | 'createdAt' | 'updatedAt'>
  ): Promise<Interaction | undefined> => {
    if (!clientId) {
      setError("Client ID is required to add an interaction.");
      throw new Error("Client ID is required to add an interaction.");
    }

    setLoading(true); // Consider a specific loading state for add operation if needed
    setError(null);
    try {
      const newInteractionData = {
        ...interactionData,
        clientId: clientId, // Set the clientId for the subcollection document
        timestamp: interactionData.timestamp instanceof Date ? Timestamp.fromDate(interactionData.timestamp) : Timestamp.now(),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };
      
      const interactionsPath = `${CLIENTS_COLLECTION}/${clientId}/${INTERACTIONS_SUBCOLLECTION}`;
      const docRef = await addDoc(collection(firestore, interactionsPath), newInteractionData);
      setLoading(false);
      // No need to manually add to items state, onSnapshot will handle it.
      return { 
        ...interactionData, 
        id: docRef.id, 
        clientId: clientId,
        createdAt: (newInteractionData.createdAt as Timestamp).toDate(), 
        updatedAt: (newInteractionData.updatedAt as Timestamp).toDate(),
        timestamp: (newInteractionData.timestamp as Timestamp).toDate(),
      } as Interaction;
    } catch (err: any) {
      console.error("Error adding interaction: ", err);
      setError(`Failed to add interaction: ${err.message}`);
      setLoading(false);
      throw err;
    }
  }, [clientId]); // Add clientId to dependency array of useCallback

  return {
    interactions,
    loading,
    error,
    addInteraction,
  };
}
