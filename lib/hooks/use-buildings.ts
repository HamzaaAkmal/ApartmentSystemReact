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
import type { Building } from "../types";

// Firestore collection name
const BUILDINGS_COLLECTION = 'buildings';

// Reminder: Manual Data Seeding
// If you have existing mock building data (e.g., in `lib/data.ts`), 
// you will need to manually seed this data into your Firestore 'buildings'
// collection to see it in the application.

// Helper to convert Firestore doc data to Building type, handling Timestamps
const fromFirestore = (snapshot: QueryDocumentSnapshot<DocumentData>): Building => {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    name: data.name,
    address: data.address,
    floors: data.floors,
    units: data.units,
    status: data.status,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : undefined,
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : undefined,
  } as Building;
};

interface UseBuildingsReturn {
  buildings: Building[];
  loading: boolean;
  error: string | null;
  createBuilding: (buildingData: Omit<Building, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Building | undefined>;
  updateBuilding: (id: string, updates: Partial<Omit<Building, 'id' | 'createdAt'>>) => Promise<void>;
  deleteBuilding: (id: string) => Promise<void>;
}

export function useBuildings(): UseBuildingsReturn {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Real-time listener for building data
  useEffect(() => {
    setLoading(true);
    const q = query(collection(firestore, BUILDINGS_COLLECTION), orderBy("name", "asc")); // Order by name
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const buildingsList: Building[] = [];
      querySnapshot.forEach((docSnap) => {
        buildingsList.push(fromFirestore(docSnap));
      });
      setBuildings(buildingsList);
      setLoading(false);
      setError(null);
    }, (err) => {
      console.error("Error fetching buildings with onSnapshot: ", err);
      setError(`Failed to subscribe to building updates: ${err.message}`);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  // Create operation
  const createBuilding = useCallback(async (buildingData: Omit<Building, 'id' | 'createdAt' | 'updatedAt'>): Promise<Building | undefined> => {
    setLoading(true); 
    setError(null);
    try {
      const newBuildingDataFirebase = {
        ...buildingData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };
      
      const docRef = await addDoc(collection(firestore, BUILDINGS_COLLECTION), newBuildingDataFirebase);
      setLoading(false);
      // Return the created building object with JS Dates for immediate use if needed
      return { 
        ...buildingData, 
        id: docRef.id, 
        createdAt: (newBuildingDataFirebase.createdAt as Timestamp).toDate(), 
        updatedAt: (newBuildingDataFirebase.updatedAt as Timestamp).toDate(),
      };
    } catch (err: any) {
      console.error("Error creating building: ", err);
      setError(`Failed to create building: ${err.message}`);
      setLoading(false);
      throw err;
    }
  }, []);

  // Update operation
  const updateBuilding = useCallback(async (id: string, updates: Partial<Omit<Building, 'id' | 'createdAt'>>) => {
    setLoading(true);
    setError(null);
    try {
      const docRef = doc(firestore, BUILDINGS_COLLECTION, id);
      const updatesFirebase: {[key:string]: any} = { ...updates };
      updatesFirebase.updatedAt = Timestamp.now();
      
      await updateDoc(docRef, updatesFirebase);
      setLoading(false);
    } catch (err: any) {
      console.error("Error updating building: ", err);
      setError(`Failed to update building: ${err.message}`);
      setLoading(false);
      throw err;
    }
  }, []);

  // Delete operation
  const deleteBuilding = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const docRef = doc(firestore, BUILDINGS_COLLECTION, id);
      await deleteDoc(docRef);
      setLoading(false);
    } catch (err: any) {
      console.error("Error deleting building: ", err);
      setError(`Failed to delete building: ${err.message}`);
      setLoading(false);
      throw err;
    }
  }, []);

  return {
    buildings,
    loading,
    error,
    createBuilding,
    updateBuilding,
    deleteBuilding,
  };
}
