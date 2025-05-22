"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  Timestamp,
  runTransaction,
  DocumentData,
  QueryDocumentSnapshot,
  Unsubscribe,
} from "firebase/firestore";
import { firestore } from "../firebase";
import type { Account, FinancialTransaction, TransactionType, Currency } from "../types";

// Firestore collection names
const ACCOUNTS_COLLECTION = 'accounts';
const FINANCIAL_TRANSACTIONS_COLLECTION = 'financialTransactions';

// Helper to convert Firestore doc data to Account type
const fromFirestoreAccount = (snapshot: QueryDocumentSnapshot<DocumentData>): Account => {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    name: data.name,
    type: data.type,
    balance: data.balance,
    currency: data.currency as Currency,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : undefined,
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : undefined,
  } as Account;
};

// Helper to convert Firestore doc data to FinancialTransaction type
const fromFirestoreTransaction = (snapshot: QueryDocumentSnapshot<DocumentData>): FinancialTransaction => {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    accountId: data.accountId,
    type: data.type as TransactionType,
    category: data.category,
    description: data.description,
    amount: data.amount,
    currency: data.currency as Currency,
    transactionDate: data.transactionDate instanceof Timestamp ? data.transactionDate.toDate() : new Date(),
    relatedPaymentId: data.relatedPaymentId,
    relatedInvoiceId: data.relatedInvoiceId,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : undefined,
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : undefined,
  } as FinancialTransaction;
};

interface UseFinanceReturn {
  accounts: Account[];
  transactionsForSelectedAccount: FinancialTransaction[];
  loadingAccounts: boolean;
  loadingTransactions: boolean;
  errorAccounts: string | null;
  errorTransactions: string | null;
  createAccount: (accountData: Omit<Account, 'id' | 'createdAt' | 'updatedAt' | 'balance'>) => Promise<Account | undefined>;
  addFinancialTransaction: (transactionData: Omit<FinancialTransaction, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  fetchTransactionsForAccount: (accountId: string | null) => void;
}

export function useFinance(): UseFinanceReturn {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactionsForSelectedAccount, setTransactionsForSelectedAccount] = useState<FinancialTransaction[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(false); // Initially false until an account is selected
  const [errorAccounts, setErrorAccounts] = useState<string | null>(null);
  const [errorTransactions, setErrorTransactions] = useState<string | null>(null);

  const unsubscribeTransactionsRef = useRef<Unsubscribe | null>(null);

  // Effect for fetching accounts
  useEffect(() => {
    setLoadingAccounts(true);
    const q = query(collection(firestore, ACCOUNTS_COLLECTION), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const accountsList: Account[] = [];
      querySnapshot.forEach((docSnap) => {
        accountsList.push(fromFirestoreAccount(docSnap));
      });
      setAccounts(accountsList);
      setLoadingAccounts(false);
      setErrorAccounts(null);
    }, (err) => {
      console.error("Error fetching accounts: ", err);
      setErrorAccounts(`Failed to subscribe to account updates: ${err.message}`);
      setLoadingAccounts(false);
    });

    return () => unsubscribe();
  }, []);

  // Function to fetch transactions for a specific account
  const fetchTransactionsForAccount = useCallback((accountId: string | null) => {
    // Cleanup previous listener if it exists
    if (unsubscribeTransactionsRef.current) {
      unsubscribeTransactionsRef.current();
      unsubscribeTransactionsRef.current = null;
    }
    
    setTransactionsForSelectedAccount([]); // Clear previous transactions

    if (!accountId) {
      setLoadingTransactions(false);
      setErrorTransactions(null);
      return;
    }

    setLoadingTransactions(true);
    setErrorTransactions(null);
    
    const q = query(
      collection(firestore, FINANCIAL_TRANSACTIONS_COLLECTION),
      where("accountId", "==", accountId),
      orderBy("transactionDate", "desc")
    );

    unsubscribeTransactionsRef.current = onSnapshot(q, (querySnapshot) => {
      const transactionsList: FinancialTransaction[] = [];
      querySnapshot.forEach((docSnap) => {
        transactionsList.push(fromFirestoreTransaction(docSnap));
      });
      setTransactionsForSelectedAccount(transactionsList);
      setLoadingTransactions(false);
    }, (err) => {
      console.error(`Error fetching transactions for account ${accountId}: `, err);
      setErrorTransactions(`Failed to subscribe to transaction updates: ${err.message}`);
      setLoadingTransactions(false);
    });
  }, []);
  
  // Cleanup transactions listener on unmount
  useEffect(() => {
    return () => {
      if (unsubscribeTransactionsRef.current) {
        unsubscribeTransactionsRef.current();
      }
    };
  }, []);


  // Create Account
  const createAccount = useCallback(async (
    accountData: Omit<Account, 'id' | 'createdAt' | 'updatedAt' | 'balance'>
  ): Promise<Account | undefined> => {
    setLoadingAccounts(true); // Or a specific loadingCreateAccount state
    try {
      const newAccountData = {
        ...accountData,
        balance: 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };
      const docRef = await addDoc(collection(firestore, ACCOUNTS_COLLECTION), newAccountData);
      setLoadingAccounts(false);
      return {
        id: docRef.id,
        ...newAccountData,
        createdAt: (newAccountData.createdAt as Timestamp).toDate(),
        updatedAt: (newAccountData.updatedAt as Timestamp).toDate(),
      } as Account;
    } catch (err: any) {
      console.error("Error creating account: ", err);
      setErrorAccounts(`Failed to create account: ${err.message}`);
      setLoadingAccounts(false);
      throw err;
    }
  }, []);

  // Add Financial Transaction
  const addFinancialTransaction = useCallback(async (
    transactionData: Omit<FinancialTransaction, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    // For simplicity in this hook, transaction-specific loading/error can be handled by component using it
    // Or, add specific state e.g. setLoadingAddTransaction, setErrorAddTransaction
    
    const accountRef = doc(firestore, ACCOUNTS_COLLECTION, transactionData.accountId);
    const transactionCollectionRef = collection(firestore, FINANCIAL_TRANSACTIONS_COLLECTION);

    try {
      await runTransaction(firestore, async (transaction) => {
        const accountDoc = await transaction.get(accountRef);
        if (!accountDoc.exists()) {
          throw new Error(`Account with ID ${transactionData.accountId} does not exist!`);
        }

        const accountData = accountDoc.data() as Account;
        
        // Assuming transactionData.currency matches accountData.currency for now
        // If not, conversion logic would be needed here or before calling this function.
        if (transactionData.currency !== accountData.currency) {
            console.warn(`Transaction currency (${transactionData.currency}) differs from account currency (${accountData.currency}). No conversion performed.`);
            // Potentially throw an error or handle as per business logic
        }

        let newBalance = accountData.balance;
        if (transactionData.type === "income") {
          newBalance += transactionData.amount;
        } else { // "expense"
          newBalance -= transactionData.amount;
        }

        // 1. Update Account
        transaction.update(accountRef, {
          balance: newBalance,
          updatedAt: Timestamp.now(),
        });

        // 2. Create Financial Transaction
        const newTransaction = {
          ...transactionData,
          transactionDate: transactionData.transactionDate instanceof Date 
            ? Timestamp.fromDate(transactionData.transactionDate) 
            : Timestamp.now(), // Fallback if not a Date, though type expects Date
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        };
        transaction.set(doc(transactionCollectionRef), newTransaction); // Use .set with a new doc() for specific ID, or addDoc like
      });
      // If onSnapshot is setup for transactions of this account, UI will update.
      // No need to return the transaction or manually update state here due to onSnapshot.
    } catch (err: any) {
      console.error("Error adding financial transaction: ", err);
      // Set a more specific error state if available, e.g., setErrorAddTransaction
      throw err; // Re-throw for the component to handle if needed
    }
  }, []);

  return {
    accounts,
    transactionsForSelectedAccount,
    loadingAccounts,
    loadingTransactions,
    errorAccounts,
    errorTransactions,
    createAccount,
    addFinancialTransaction,
    fetchTransactionsForAccount,
  };
}
