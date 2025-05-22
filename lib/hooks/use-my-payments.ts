"use client";

import { useState, useCallback, useEffect } from "react";
import {
  collection,
  Timestamp,
  onSnapshot,
  query,
  where,
  orderBy,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { firestore } from "../firebase"; 
import type { Payment } from "../types";

// Firestore collection name
const PAYMENTS_COLLECTION = 'payments';

// Helper to convert Firestore doc data to Payment type, handling Timestamps
// This can be imported from 'lib/hooks/use-payments.ts' if exported there,
// or defined locally if preferred for this specific client-side hook.
const fromFirestorePayment = (snapshot: QueryDocumentSnapshot<DocumentData>): Payment => {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    clientId: data.clientId,
    apartmentId: data.apartmentId,
    amount: data.amount,
    currency: data.currency,
    status: data.status,
    method: data.method,
    dueDate: data.dueDate instanceof Timestamp ? data.dueDate.toDate() : new Date(),
    paidDate: data.paidDate instanceof Timestamp ? data.paidDate.toDate() : undefined,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : undefined,
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : undefined,
  } as Payment;
};

interface UseMyPaymentsReturn {
  payments: Payment[];
  loading: boolean;
  error: string | null;
}

export function useMyPayments(clientId: string | null | undefined): UseMyPaymentsReturn {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clientId) {
      setPayments([]);
      setLoading(false);
      setError(null); // Or set an error: "Client ID is required to fetch payments."
      return;
    }

    setLoading(true);
    setError(null);

    const paymentsQuery = query(
      collection(firestore, PAYMENTS_COLLECTION),
      where("clientId", "==", clientId),
      orderBy("dueDate", "desc") // Ordered by dueDate descending as per requirement
    );
    
    const unsubscribe = onSnapshot(paymentsQuery, 
      (querySnapshot) => {
        const paymentsList: Payment[] = [];
        querySnapshot.forEach((docSnap) => {
          try {
            paymentsList.push(fromFirestorePayment(docSnap));
          } catch (e: any) {
            console.error("Error processing payment document data:", e);
            // Optionally, handle individual document processing errors
          }
        });
        setPayments(paymentsList);
        setError(null);
        setLoading(false);
      }, 
      (err) => {
        console.error(`Error fetching payments for client ${clientId}:`, err);
        setError(`Failed to subscribe to payment updates: ${err.message}`);
        setPayments([]);
        setLoading(false);
      }
    );

    return () => unsubscribe(); // Cleanup subscription on unmount or when clientId changes
  }, [clientId]);

  return { payments, loading, error };
}
