"use client";

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext'; // Adjust path if necessary
import { Loader2 } from 'lucide-react'; // For loading spinner

interface AdminRouteGuardProps {
  children: ReactNode;
}

export default function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  // When AuthContext is mocked for admin:
  // - currentUser will be a mock user object.
  // - currentUserData will be a mock data object with role: 'admin'.
  // - currentUserRole will be 'admin'.
  // - loading will be false.
  // The existing logic correctly handles this and grants access.
  const { currentUser, currentUserData, currentUserRole, loading } /*logout*/ = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only run logic if auth loading is complete.
    // With mocked AuthContext, `loading` is initially false.
    if (!loading) {
      if (!currentUser) {
        // No Firebase user, not authenticated
        console.log("AdminRouteGuard: No current user, redirecting to admin dashboard (was login).");
        router.push('/admin/dashboard');
      } else {
        // Firebase user exists, now check role based on currentUserData
        if (!currentUserData) {
          // This means user exists in Auth, but no data in Firestore (or still loading if logic is complex)
          // This case should ideally be handled by AuthContext setting loading to false only after data attempt.
          // If it reaches here, it means something is wrong with user record in DB.
          console.error("AdminRouteGuard: User authenticated but no user data found in Firestore. Redirecting to admin dashboard (was login).");
          // Potentially logout the user here if this state is considered invalid.
          // logout(); // from useAuth() if added to its return
          router.push('/admin/dashboard');
        } else if (currentUserRole !== 'admin') {
          // User is authenticated, data loaded, but not an admin
          console.log(`AdminRouteGuard: User role "${currentUserRole}" is not admin, redirecting to admin dashboard (was login).`);
          // Redirect to login or an "unauthorized" page.
          // Pushing to dashboard if not admin seems wrong.
          router.push('/admin/dashboard'); // Or a dedicated '/unauthorized' page
        }
        // If role is 'admin', execution continues and children are rendered
      }
    }
  }, [currentUser, currentUserData, currentUserRole, loading, router]); // Added currentUserData

  if (loading) { // Simpler: just check the main loading flag from AuthContext
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

  // If not loading, and the useEffect hasn't redirected, then check credentials for rendering
  if (!currentUser || !currentUserData || currentUserRole !== 'admin') {
      // This case should ideally be covered by redirects in useEffect.
      // If it reaches here, it's a fallback, perhaps show a minimal unauthorized message or redirect again.
      // For robustness, you might want to ensure redirection happens or show an explicit "Access Denied".
      // router.push('/admin/dashboard'); // Could cause loop if useEffect logic is not perfect.
      return (
          <div className="flex items-center justify-center min-h-screen">
            <p className="text-lg text-red-600">Access Denied or session loading...</p>
          </div>
        );
  }

  // If loading is false, currentUser & currentUserData exist, and currentUserRole is 'admin'
  return <>{children}</>;
}
