"use client";

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext'; // Adjust path if necessary
import { Loader2 } from 'lucide-react'; // For loading spinner

interface ClientRouteGuardProps {
  children: ReactNode;
}

export default function ClientRouteGuard({ children }: ClientRouteGuardProps) {
  const { currentUser, currentUserData, currentUserRole, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only run logic if auth loading is complete.
    if (!loading) {
      if (!currentUser) {
        // No Firebase user, not authenticated
        console.log("ClientRouteGuard: No current user, redirecting to admin dashboard (was /client/login).");
        router.push('/admin/dashboard');
      } else {
        // Firebase user exists, now check role based on currentUserData
        if (!currentUserData) {
          // User exists in Auth, but no data in Firestore.
          console.error("ClientRouteGuard: User authenticated but no user data found in Firestore. Redirecting to admin dashboard (was /client/login).");
          // Potentially logout the user here if this state is considered invalid.
          // logout(); // from useAuth() if needed and added to AuthContext
          router.push('/admin/dashboard');
        } else if (currentUserRole !== 'client') {
          // User is authenticated, data loaded, but not a client
          console.log(`ClientRouteGuard: User role "${currentUserRole}" is not client, redirecting to admin dashboard (was /client/login).`);
          router.push('/admin/dashboard'); // Or a dedicated '/unauthorized' page
        }
        // If role is 'client', execution continues and children are rendered
      }
    }
  }, [currentUser, currentUserData, currentUserRole, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-green-700" />
        <p className="ml-3 text-lg">Loading & Verifying Access...</p>
      </div>
    );
  }

  // If not loading, and the useEffect hasn't redirected, then check credentials for rendering
  if (!currentUser || !currentUserData || currentUserRole !== 'client') {
      // This case should ideally be covered by redirects in useEffect.
      return (
          <div className="flex items-center justify-center min-h-screen">
            <p className="text-lg text-red-600">Access Denied or session loading...</p>
          </div>
        );
  }

  // If loading is false, currentUser & currentUserData exist, and currentUserRole is 'client'
  return <>{children}</>;
}
