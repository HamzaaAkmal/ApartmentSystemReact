"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User as FirebaseAuthUser, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, firestore } from '../lib/firebase'; // Adjust path as per your project structure
import { doc, getDoc, onSnapshot, Timestamp } from 'firebase/firestore'; // Import Firestore functions
import { useRouter, usePathname } from 'next/navigation';
import type { User as AppUser, UserRole } from '../lib/types'; // Import your custom User and UserRole types

interface AuthContextType {
  currentUser: FirebaseAuthUser | null; // Firebase Auth user
  currentUserData: AppUser | null; // Your Firestore user metadata
  currentUserRole: UserRole | null; // User's role
  loading: boolean; // Combined loading state
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseAuthUser | null>(null);
  const [currentUserData, setCurrentUserData] = useState<AppUser | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true); // True until auth state and user data are resolved
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let unsubscribeFirestore: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // User is logged in, fetch/listen to Firestore data
        if (unsubscribeFirestore) unsubscribeFirestore(); // Unsubscribe from previous listener

        const userDocRef = doc(firestore, 'users', user.uid);
        unsubscribeFirestore = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const appUserData = docSnap.data() as AppUser;
            // Convert Firestore Timestamps to JS Dates if necessary
            const formattedUserData: AppUser = {
              ...appUserData,
              id: docSnap.id, // Ensure id is set from snapshot
              createdAt: appUserData.createdAt instanceof Timestamp ? appUserData.createdAt.toDate() : appUserData.createdAt,
              updatedAt: appUserData.updatedAt instanceof Timestamp ? appUserData.updatedAt.toDate() : appUserData.updatedAt,
              lastLogin: appUserData.lastLogin instanceof Timestamp ? appUserData.lastLogin.toDate() : appUserData.lastLogin,
            };
            setCurrentUserData(formattedUserData);
            setCurrentUserRole(formattedUserData.role);
            console.log("User metadata loaded:", formattedUserData);
          } else {
            console.warn(`User metadata not found in Firestore for UID: ${user.uid}`);
            setCurrentUserData(null);
            setCurrentUserRole(null);
          }
          setLoading(false); // Auth and user data fetch attempt complete
        }, (error) => {
          console.error("Error fetching user metadata from Firestore:", error);
          setCurrentUserData(null);
          setCurrentUserRole(null);
          setLoading(false); // Fetch attempt complete even on error
        });

        // Redirection logic (can be kept or adjusted)
        if (pathname === "/admin/login" || pathname === "/client/login") {
          if (pathname.startsWith("/admin")) {
            router.push("/admin/dashboard");
          } else {
            router.push("/client/dashboard");
          }
        }
      } else {
        // User is logged out
        if (unsubscribeFirestore) unsubscribeFirestore();
        setCurrentUserData(null);
        setCurrentUserRole(null);
        setLoading(false); // Auth state resolved

        // Redirection logic for logged-out users
        if (pathname.startsWith("/admin/dashboard")) {
          router.push("/admin/login");
        } else if (pathname.startsWith("/client/dashboard")) {
          router.push("/client/login");
        }
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeFirestore) unsubscribeFirestore();
    };
  }, [router, pathname]); // router and pathname for redirection logic

  const logout = async () => {
    if (unsubscribeFirestore) unsubscribeFirestore(); // Clean up Firestore listener on logout
    await firebaseSignOut(auth);
    setCurrentUser(null); // Handled by onAuthStateChanged, but good for immediate UI update
    setCurrentUserData(null);
    setCurrentUserRole(null);
    // Determine where to redirect after logout based on current path
    if (pathname.startsWith("/admin")) {
      router.push("/admin/login");
    } else if (pathname.startsWith("/client")) {
      router.push("/client/login");
    } else {
      router.push("/"); // Default redirect for other pages or if path is unclear
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, currentUserData, currentUserRole, loading, logout }}>
      {/* Render children only when not loading to prevent flicker or access to incorrect auth state */}
      {/* Or, adjust this logic based on specific needs e.g. show a global loader */}
      {!loading && children} 
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => { // Explicitly type the return of useAuth
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
