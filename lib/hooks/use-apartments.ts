"use client";

import { useState, useCallback, useEffect } from "react";
import {
  collection,
  addDoc,
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
import type { Apartment } from "../types";

// Firestore collection name
const APARTMENTS_COLLECTION = 'apartments';

// Reminder: Manual Data Seeding
// If you have existing mock apartment data (e.g., in `lib/data.ts`), 
// you will need to manually seed this data into your Firestore 'apartments'
// collection to see it in the application.

// Helper to convert Firestore doc data to Apartment type, handling Timestamps
const fromFirestore = (snapshot: QueryDocumentSnapshot<DocumentData>): Apartment => {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    buildingId: data.buildingId,
    number: data.number,
    floor: data.floor,
    type: data.type,
    size: data.size,
    price: data.price,
    status: data.status,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : undefined,
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : undefined,
  } as Apartment;
};

interface UseApartmentsReturn {
  apartments: Apartment[];
  loading: boolean;
  error: string | null;
  createApartment: (apartmentData: Omit<Apartment, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Apartment | undefined>;
  updateApartment: (id: string, updates: Partial<Omit<Apartment, 'id' | 'createdAt'>>) => Promise<void>;
  deleteApartment: (id: string) => Promise<void>;
}

export function useApartments(): UseApartmentsReturn {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Real-time listener for apartment data
  useEffect(() => {
    setLoading(true);
    const q = query(collection(firestore, APARTMENTS_COLLECTION), orderBy("buildingId", "asc"), orderBy("number", "asc")); // Order by building then number
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const apartmentsList: Apartment[] = [];
      querySnapshot.forEach((docSnap) => {
        apartmentsList.push(fromFirestore(docSnap));
      });
      setApartments(apartmentsList);
      setLoading(false);
      setError(null);
    }, (err) => {
      console.error("Error fetching apartments with onSnapshot: ", err);
      setError(`Failed to subscribe to apartment updates: ${err.message}`);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  // Create operation
  const createApartment = useCallback(async (apartmentData: Omit<Apartment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Apartment | undefined> => {
    setLoading(true); 
    setError(null);
    try {
      const newApartmentDataFirebase = {
        ...apartmentData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };
      
      const docRef = await addDoc(collection(firestore, APARTMENTS_COLLECTION), newApartmentDataFirebase);
      setLoading(false);
      // Return the created apartment object with JS Dates for immediate use if needed
      return { 
        ...apartmentData, 
        id: docRef.id, 
        createdAt: (newApartmentDataFirebase.createdAt as Timestamp).toDate(), 
        updatedAt: (newApartmentDataFirebase.updatedAt as Timestamp).toDate(),
      };
    } catch (err: any) {
      console.error("Error creating apartment: ", err);
      setError(`Failed to create apartment: ${err.message}`);
      setLoading(false);
      throw err;
    }
  }, []);

  // Update operation
  const updateApartment = useCallback(async (id: string, updates: Partial<Omit<Apartment, 'id' | 'createdAt'>>) => {
    setLoading(true);
    setError(null);
    try {
      const docRef = doc(firestore, APARTMENTS_COLLECTION, id);
      const updatesFirebase: {[key:string]: any} = { ...updates };
      updatesFirebase.updatedAt = Timestamp.now();
      
      await updateDoc(docRef, updatesFirebase);
      setLoading(false);
    } catch (err: any) {
      console.error("Error updating apartment: ", err);
      setError(`Failed to update apartment: ${err.message}`);
      setLoading(false);
      throw err;
    }
  }, []);

  // Delete operation
  const deleteApartment = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const docRef = doc(firestore, APARTMENTS_COLLECTION, id);
      await deleteDoc(docRef);
      setLoading(false);
    } catch (err: any) {
      console.error("Error deleting apartment: ", err);
      setError(`Failed to delete apartment: ${err.message}`);
      setLoading(false);
      throw err;
    }
  }, []);

  return {
    apartments,
    loading,
    error,
    createApartment,
    updateApartment,
    deleteApartment,
  };
}
