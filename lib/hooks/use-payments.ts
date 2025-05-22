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
import type { Payment } from "../types";

// Firestore collection name
const PAYMENTS_COLLECTION = 'payments';

// Reminder: Manual Data Seeding
// If you have existing mock payment data, you will need to manually seed this 
// data into your Firestore 'payments' collection to see it in the application.

// Helper to convert Firestore doc data to Payment type, handling Timestamps
const fromFirestore = (snapshot: QueryDocumentSnapshot<DocumentData>): Payment => {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    clientId: data.clientId,
    apartmentId: data.apartmentId,
    amount: data.amount,
    currency: data.currency,
    status: data.status,
    method: data.method,
    dueDate: data.dueDate instanceof Timestamp ? data.dueDate.toDate() : new Date(), // Default to now if missing, though dueDate should be there
    paidDate: data.paidDate instanceof Timestamp ? data.paidDate.toDate() : undefined,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : undefined,
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : undefined,
  } as Payment;
};

interface UsePaymentsReturn {
  payments: Payment[];
  loading: boolean;
  error: string | null;
  createPayment: (paymentData: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Payment | undefined>;
  updatePayment: (id: string, updates: Partial<Omit<Payment, 'id' | 'createdAt'>>) => Promise<void>;
  deletePayment: (id: string) => Promise<void>;
}

export function usePayments(): UsePaymentsReturn {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Real-time listener for payment data
  useEffect(() => {
    setLoading(true);
    // Order by due date, then by creation
    const q = query(collection(firestore, PAYMENTS_COLLECTION), orderBy("dueDate", "asc"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const paymentsList: Payment[] = [];
      querySnapshot.forEach((docSnap) => {
        paymentsList.push(fromFirestore(docSnap));
      });
      setPayments(paymentsList);
      setLoading(false);
      setError(null);
    }, (err) => {
      console.error("Error fetching payments with onSnapshot: ", err);
      setError(`Failed to subscribe to payment updates: ${err.message}`);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  // Create operation
  const createPayment = useCallback(async (paymentData: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Payment | undefined> => {
    setLoading(true); 
    setError(null);
    try {
      const newPaymentDataFirebase: any = {
        ...paymentData,
        dueDate: paymentData.dueDate instanceof Date ? Timestamp.fromDate(paymentData.dueDate) : Timestamp.now(), // Ensure dueDate is a Timestamp
        paidDate: paymentData.paidDate && paymentData.paidDate instanceof Date ? Timestamp.fromDate(paymentData.paidDate) : null,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };
      
      const docRef = await addDoc(collection(firestore, PAYMENTS_COLLECTION), newPaymentDataFirebase);
      setLoading(false);
      return { 
        ...paymentData, 
        id: docRef.id, 
        dueDate: paymentData.dueDate, // Keep as Date for return
        paidDate: paymentData.paidDate, // Keep as Date for return
        createdAt: (newPaymentDataFirebase.createdAt as Timestamp).toDate(), 
        updatedAt: (newPaymentDataFirebase.updatedAt as Timestamp).toDate(),
      };
    } catch (err: any) {
      console.error("Error creating payment: ", err);
      setError(`Failed to create payment: ${err.message}`);
      setLoading(false);
      throw err;
    }
  }, []);

  // Update operation
  const updatePayment = useCallback(async (id: string, updates: Partial<Omit<Payment, 'id' | 'createdAt'>>) => {
    setLoading(true);
    setError(null);
    try {
      const docRef = doc(firestore, PAYMENTS_COLLECTION, id);
      const updatesFirebase: {[key:string]: any} = { ...updates };

      updatesFirebase.updatedAt = Timestamp.now();

      if (updates.dueDate && updates.dueDate instanceof Date) {
        updatesFirebase.dueDate = Timestamp.fromDate(updates.dueDate);
      }
      if (updates.hasOwnProperty('paidDate')) { // Check if paidDate is explicitly being set (even to null/undefined)
        updatesFirebase.paidDate = updates.paidDate && updates.paidDate instanceof Date 
          ? Timestamp.fromDate(updates.paidDate) 
          : null;
      }
      
      await updateDoc(docRef, updatesFirebase);
      setLoading(false);
    } catch (err: any) {
      console.error("Error updating payment: ", err);
      setError(`Failed to update payment: ${err.message}`);
      setLoading(false);
      throw err;
    }
  }, []);

  // Delete operation
  const deletePayment = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const docRef = doc(firestore, PAYMENTS_COLLECTION, id);
      await deleteDoc(docRef);
      setLoading(false);
    } catch (err: any) {
      console.error("Error deleting payment: ", err);
      setError(`Failed to delete payment: ${err.message}`);
      setLoading(false);
      throw err;
    }
  }, []);

  return {
    payments,
    loading,
    error,
    createPayment,
    updatePayment,
    deletePayment,
  };
}
