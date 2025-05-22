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
import type { AdBanner } from "../types";

// Firestore collection name
const AD_BANNERS_COLLECTION = 'adBanners';

// Reminder: Manual Data Seeding
// If you have existing mock ad banner data, you will need to manually seed this 
// data into your Firestore 'adBanners' collection to see it in the application.

// Helper to convert Firestore doc data to AdBanner type, handling Timestamps
const fromFirestore = (snapshot: QueryDocumentSnapshot<DocumentData>): AdBanner => {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    title: data.title,
    description: data.description,
    imageUrl: data.imageUrl,
    linkUrl: data.linkUrl,
    isActive: data.isActive,
    startDate: data.startDate instanceof Timestamp ? data.startDate.toDate() : new Date(), // Default to now if somehow missing
    endDate: data.endDate instanceof Timestamp ? data.endDate.toDate() : undefined,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : undefined,
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : undefined,
  } as AdBanner;
};

interface UseAdBannersReturn {
  adBanners: AdBanner[];
  loading: boolean;
  error: string | null;
  createAdBanner: (bannerData: Omit<AdBanner, 'id' | 'createdAt' | 'updatedAt'>) => Promise<AdBanner | undefined>;
  updateAdBanner: (id: string, updates: Partial<Omit<AdBanner, 'id' | 'createdAt'>>) => Promise<void>;
  deleteAdBanner: (id: string) => Promise<void>;
}

export function useAdBanners(): UseAdBannersReturn {
  const [adBanners, setAdBanners] = useState<AdBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Real-time listener for ad banner data
  useEffect(() => {
    setLoading(true);
    const q = query(collection(firestore, AD_BANNERS_COLLECTION), orderBy("startDate", "desc")); 
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const bannersList: AdBanner[] = [];
      querySnapshot.forEach((docSnap) => {
        bannersList.push(fromFirestore(docSnap));
      });
      setAdBanners(bannersList);
      setLoading(false);
      setError(null);
    }, (err) => {
      console.error("Error fetching ad banners with onSnapshot: ", err);
      setError(`Failed to subscribe to ad banner updates: ${err.message}`);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  // Create operation
  const createAdBanner = useCallback(async (
    bannerData: Omit<AdBanner, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<AdBanner | undefined> => {
    setError(null);
    try {
      const dataToSave = {
        ...bannerData,
        startDate: bannerData.startDate instanceof Date ? Timestamp.fromDate(bannerData.startDate) : Timestamp.now(),
        endDate: bannerData.endDate instanceof Date ? Timestamp.fromDate(bannerData.endDate) : undefined,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };
      
      const docRef = await addDoc(collection(firestore, AD_BANNERS_COLLECTION), dataToSave);
      
      // Return the created banner object with JS Dates for immediate use if needed
      return { 
        ...bannerData, 
        id: docRef.id, 
        createdAt: (dataToSave.createdAt as Timestamp).toDate(), 
        updatedAt: (dataToSave.updatedAt as Timestamp).toDate(),
        startDate: bannerData.startDate, // Keep original JS Date
        endDate: bannerData.endDate, // Keep original JS Date or undefined
      };
    } catch (err: any) {
      console.error("Error creating ad banner: ", err);
      setError(`Failed to create ad banner: ${err.message}`);
      throw err;
    }
  }, []);

  // Update operation
  const updateAdBanner = useCallback(async (
    id: string, 
    updates: Partial<Omit<AdBanner, 'id' | 'createdAt'>>
  ) => {
    setError(null);
    try {
      const docRef = doc(firestore, AD_BANNERS_COLLECTION, id);
      const updatesFirebase: {[key:string]: any} = { ...updates };
      updatesFirebase.updatedAt = Timestamp.now();

      if (updates.startDate && updates.startDate instanceof Date) {
        updatesFirebase.startDate = Timestamp.fromDate(updates.startDate);
      }
      if (updates.hasOwnProperty('endDate')) { // Check if endDate is explicitly being set (even to null/undefined)
         updatesFirebase.endDate = updates.endDate && updates.endDate instanceof Date 
            ? Timestamp.fromDate(updates.endDate) 
            : undefined; // Allow unsetting endDate
      }
      
      await updateDoc(docRef, updatesFirebase);
    } catch (err: any) {
      console.error("Error updating ad banner: ", err);
      setError(`Failed to update ad banner: ${err.message}`);
      throw err;
    }
  }, []);

  // Delete operation
  const deleteAdBanner = useCallback(async (id: string) => {
    setError(null);
    try {
      const docRef = doc(firestore, AD_BANNERS_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (err: any) {
      console.error("Error deleting ad banner: ", err);
      setError(`Failed to delete ad banner: ${err.message}`);
      throw err;
    }
  }, []);

  return {
    adBanners,
    loading,
    error,
    createAdBanner,
    updateAdBanner,
    deleteAdBanner,
  };
}
