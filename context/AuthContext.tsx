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
  const [loading, setLoading] = useState(false); // Set loading to false initially for mock
  const router = useRouter(); // Keep for potential internal navigation if needed
  const pathname = usePathname(); // Keep for potential internal logic if needed

  // Simulate a logged-in admin user
  useEffect(() => {
    console.log("AuthContext: Setting mock admin user.");
    // Mock Firebase user object
    const mockFbUser: FirebaseAuthUser = {
      uid: 'mockAdminUser123',
      email: 'admin@example.mock.com',
      displayName: 'Mock Admin User',
      photoURL: null,
      emailVerified: true,
      isAnonymous: false,
      metadata: {}, // Empty or mock metadata
      providerData: [], // Empty or mock provider data
      // Add other required fields for FirebaseAuthUser with appropriate mock values
      // May need to check type definition for all required fields
      // For example:
      refreshToken: 'mockRefreshToken',
      tenantId: null,
      delete: async () => { console.log('delete called') },
      getIdToken: async () => 'mockIdToken',
      getIdTokenResult: async () => ({ token: 'mockIdToken', claims: {}, authTime: '', expirationTime: '', issuedAtTime: '', signInProvider: null, signInSecondFactor: null }),
      reload: async () => { console.log('reload called') },
      toJSON: () => ({ uid: 'mockAdminUser123', email: 'admin@example.mock.com' }), // simplified
    } as FirebaseAuthUser; // Type assertion

    // Mock Firestore user data object
    const mockAdminData: AppUser = {
      id: 'mockAdminUser123', // Should match UID
      role: 'admin',
      name: 'Mock Admin',
      email: 'admin@example.mock.com',
      // Add other fields from AppUser type with mock values
      // For example:
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active', 
      // ... any other fields your AppUser type might have
    };

    setCurrentUser(mockFbUser);
    setCurrentUserData(mockAdminData);
    setCurrentUserRole('admin');
    setLoading(false); // Ensure loading is false

    // No redirection logic needed here as we assume user is already on a protected route or navigating there.
    // The route guards will handle access based on these mock values.

  }, []); // Empty dependency array ensures this runs only once on mount

  // Dummy logout function that does nothing or logs, to prevent clearing mock state
  const logout = async () => {
    console.log("AuthContext: Logout called, but authentication is mocked. No state change.");
    // To simulate logout page redirection for testing UI flow:
    // if (pathname.startsWith("/admin")) {
    //   router.push("/admin/login");
    // } else if (pathname.startsWith("/client")) {
    //   router.push("/client/login");
    // } else {
    //   router.push("/");
    // }
  };

  // If other functions like login/signup exist, they should also be dummied out.
  // Based on previous file content, only onAuthStateChanged (now bypassed) and logout were prominent.

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
