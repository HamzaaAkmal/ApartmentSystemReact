"use client";

import { useState, useCallback, useEffect } from "react";
import {
  collection,
  doc,
  setDoc, // Using setDoc with a specific UID as document ID
  getDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
  onSnapshot,
  query,
  orderBy,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { firestore } from "../firebase"; 
import type { User, UserRole, UserStatus } from "../types";

// Firestore collection name
const USERS_COLLECTION = 'users';

// Reminder: Manual Data Seeding / Auth User Creation
// User metadata in Firestore should correspond to actual Firebase Authentication users.
// Ensure that for each user metadata document, a Firebase Auth user with the
// same UID exists. This hook only manages the Firestore metadata part.

// Helper to convert Firestore doc data to User type, handling Timestamps
const fromFirestore = (snapshot: QueryDocumentSnapshot<DocumentData>): User => {
  const data = snapshot.data();
  return {
    id: snapshot.id, // This will be the UID
    name: data.name,
    email: data.email,
    phone: data.phone,
    role: data.role as UserRole,
    status: data.status as UserStatus,
    permissions: data.permissions || [], // Default to empty array if undefined
    lastLogin: data.lastLogin instanceof Timestamp ? data.lastLogin.toDate() : undefined,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : undefined,
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : undefined,
  } as User;
};

interface UseUsersReturn {
  users: User[];
  loading: boolean;
  error: string | null;
  createUserMeta: (uid: string, userData: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'lastLogin'>) => Promise<void>;
  updateUserMeta: (uid: string, updates: Partial<Omit<User, 'id' | 'createdAt'>>) => Promise<void>;
  deleteUserMeta: (uid: string) => Promise<void>;
  getUserMeta: (uid: string) => Promise<User | null>;
}

export function useUsers(): UseUsersReturn {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Real-time listener for user metadata
  useEffect(() => {
    setLoading(true);
    const q = query(collection(firestore, USERS_COLLECTION), orderBy("name", "asc"));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const usersList: User[] = [];
      querySnapshot.forEach((docSnap) => {
        usersList.push(fromFirestore(docSnap));
      });
      setUsers(usersList);
      setLoading(false);
      setError(null);
    }, (err) => {
      console.error("Error fetching users with onSnapshot: ", err);
      setError(`Failed to subscribe to user updates: ${err.message}`);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Create user metadata operation
  const createUserMeta = useCallback(async (
    uid: string, 
    userData: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'lastLogin'>
  ): Promise<void> => {
    setLoading(true); // Consider specific loading states for individual operations
    setError(null);
    try {
      const userDocRef = doc(firestore, USERS_COLLECTION, uid);
      const newUserMetaData = {
        ...userData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        // lastLogin will be updated by a separate mechanism, e.g., AuthContext or Cloud Function
      };
      await setDoc(userDocRef, newUserMetaData);
      // onSnapshot will update the local state, no need to return the created user from here
      setLoading(false);
    } catch (err: any) {
      console.error("Error creating user metadata: ", err);
      setError(`Failed to create user metadata: ${err.message}`);
      setLoading(false);
      throw err;
    }
  }, []);

  // Update user metadata operation
  const updateUserMeta = useCallback(async (
    uid: string, 
    updates: Partial<Omit<User, 'id' | 'createdAt'>>
  ) => {
    setLoading(true);
    setError(null);
    try {
      const userDocRef = doc(firestore, USERS_COLLECTION, uid);
      const updatesWithTimestamp: {[key: string]: any} = { 
        ...updates, 
        updatedAt: Timestamp.now() 
      };
      // Convert lastLogin to Timestamp if it's part of updates and is a Date
      if (updates.lastLogin && updates.lastLogin instanceof Date) {
        updatesWithTimestamp.lastLogin = Timestamp.fromDate(updates.lastLogin);
      }

      await updateDoc(userDocRef, updatesWithTimestamp);
      // onSnapshot will update local state
      setLoading(false);
    } catch (err: any) {
      console.error("Error updating user metadata: ", err);
      setError(`Failed to update user metadata: ${err.message}`);
      setLoading(false);
      throw err;
    }
  }, []);

  // Delete user metadata operation
  const deleteUserMeta = useCallback(async (uid: string) => {
    setLoading(true);
    setError(null);
    try {
      const userDocRef = doc(firestore, USERS_COLLECTION, uid);
      await deleteDoc(userDocRef);
      // onSnapshot will update local state
      setLoading(false);
    } catch (err: any) {
      console.error("Error deleting user metadata: ", err);
      setError(`Failed to delete user metadata: ${err.message}`);
      setLoading(false);
      throw err;
    }
  }, []);

  // Get single user metadata operation
  const getUserMeta = useCallback(async (uid: string): Promise<User | null> => {
    setLoading(true);
    setError(null);
    try {
      const userDocRef = doc(firestore, USERS_COLLECTION, uid);
      const docSnap = await getDoc(userDocRef);
      setLoading(false);
      if (docSnap.exists()) {
        return fromFirestore(docSnap as QueryDocumentSnapshot<DocumentData>);
      } else {
        console.log("No such user document!");
        return null;
      }
    } catch (err: any) {
      console.error("Error fetching user metadata by ID:", err);
      setError(`Failed to fetch user metadata: ${err.message}`);
      setLoading(false);
      throw err;
    }
  }, []);


  return {
    users,
    loading,
    error,
    createUserMeta,
    updateUserMeta,
    deleteUserMeta,
    getUserMeta,
  };
}
