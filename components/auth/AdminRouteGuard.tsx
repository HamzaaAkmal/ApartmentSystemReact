"use client";

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext'; // Adjust path if necessary
import { Loader2 } from 'lucide-react'; // For loading spinner

interface AdminRouteGuardProps {
  children: ReactNode;
}

export default function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const { currentUser, currentUserRole, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!currentUser) {
        // No Firebase user, not authenticated
        console.log("AdminRouteGuard: No current user, redirecting to login.");
        router.push('/admin/login');
      } else if (!currentUserRole) {
        // Firebase user exists, but role not yet loaded or user has no role document/metadata
        // This might happen briefly while currentUserData is loading, or if user metadata is missing
        console.log("AdminRouteGuard: Current user role not yet available or user has no role, redirecting to login (or dashboard).");
        // Depending on strictness, could redirect to login or a less privileged page like dashboard
        router.push('/admin/login'); // Or router.push('/admin/dashboard'); 
      } else if (currentUserRole !== 'admin') {
        // User is authenticated and role is loaded, but not an admin
        console.log(`AdminRouteGuard: User role "${currentUserRole}" is not admin, redirecting to dashboard.`);
        router.push('/admin/dashboard'); // Or a dedicated '/unauthorized' page
      }
      // If role is 'admin', execution continues and children are rendered
    }
  }, [currentUser, currentUserRole, loading, router]);

  if (loading || !currentUser || currentUserRole !== 'admin') {
    // While loading, or if not an admin (even if role is temporarily null during loading),
    // show a loading spinner or nothing to prevent brief flash of content.
    // This also covers the case where redirection is about to happen.
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-green-700" />
        <p className="ml-3 text-lg">Loading & Verifying Access...</p>
      </div>
    );
  }

  // If loading is false, currentUser exists, and currentUserRole is 'admin'
  return <>{children}</>;
}
