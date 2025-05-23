"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Custom Hooks
import { useAuth } from "../../../context/AuthContext";
import { useMyClientProfile } from "@/lib/hooks/use-my-client-profile";

// Types
import type { Client } from "@/lib/types";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertTriangle, Menu, X, LayoutDashboard, Users, MessageSquare, Settings, LogOut, KeyRound, CheckCircle, MailWarning } from "lucide-react";

// Firebase Auth
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";

// Helper to format date or return N/A
const formatDate = (date: Date | undefined | string) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString();
};

export default function ClientProfilePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser, logout, loading: authLoading } = useAuth();
  const { clientProfile, loading: profileLoading, error: profileError } = useMyClientProfile(currentUser?.uid);

  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.push("/admin/dashboard"); // Changed from /client/login
    }
  }, [currentUser, authLoading, router]);

  const handlePasswordReset = async () => {
    if (currentUser?.email) {
      setIsResettingPassword(true);
      setResetError(null);
      setResetEmailSent(false);
      try {
        await sendPasswordResetEmail(auth, currentUser.email);
        setResetEmailSent(true);
      } catch (error: any) {
        console.error("Password reset error:", error);
        setResetError(error.message || "Failed to send password reset email.");
      } finally {
        setIsResettingPassword(false);
      }
    } else {
      setResetError("No email address found for the current user.");
    }
  };

  const overallLoading = authLoading || profileLoading;

  if (overallLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Loader2 className="h-12 w-12 animate-spin text-green-700" />
        <p className="ml-3 text-lg">Loading Your Profile...</p>
      </div>
    );
  }

  if (!currentUser) {
    return <div className="flex items-center justify-center min-h-screen">Redirecting to login...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 md:flex-row">
      <Button variant="ghost" size="icon" className="absolute left-4 top-4 z-50 md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? <X /> : <Menu />}
      </Button>
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-green-800 p-4 text-white transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:block`}>
        <div className="flex h-full flex-col">
          <div className="mb-8 flex items-center gap-2 px-2"><Image src="/placeholder.svg?height=40&width=40" alt="Logo" width={40} height={40} className="rounded-md bg-white p-1"/><span className="text-xl font-bold">ApartmentPro</span></div>
          <nav className="flex-1 space-y-1">
            <Link href="/client/dashboard" className="flex items-center rounded-md px-4 py-3 text-sm font-medium text-green-100 hover:bg-green-700"><LayoutDashboard className="mr-3 h-5 w-5" />Dashboard</Link>
            <Link href="/client/profile" className="flex items-center rounded-md bg-green-700 px-4 py-3 text-sm font-medium"><Users className="mr-3 h-5 w-5" />My Profile</Link>
            <Link href="/client/support" className="flex items-center rounded-md px-4 py-3 text-sm font-medium text-green-100 hover:bg-green-700"><MessageSquare className="mr-3 h-5 w-5" />Support</Link>
            <Link href="/client/settings" className="flex items-center rounded-md px-4 py-3 text-sm font-medium text-green-100 hover:bg-green-700"><Settings className="mr-3 h-5 w-5" />Settings</Link>
          </nav>
          <div className="mt-auto border-t border-green-700 pt-4"><Button variant="ghost" className="flex w-full items-center justify-start" onClick={logout}><LogOut className="mr-3 h-5 w-5" />Logout</Button></div>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600">View and manage your account details.</p>
        </header>

        {profileError && (
          <Card className="mb-6 border-red-500 bg-red-50">
            <CardHeader><CardTitle className="text-red-700 flex items-center"><AlertTriangle className="mr-2"/>Profile Error</CardTitle></CardHeader>
            <CardContent><p className="text-red-600">{profileError}</p></CardContent>
          </Card>
        )}

        {!clientProfile && !profileLoading && !profileError && (
           <Card className="mb-6 border-yellow-500 bg-yellow-50">
            <CardHeader><CardTitle className="text-yellow-700 flex items-center"><Info className="mr-2"/>Profile Information Missing</CardTitle></CardHeader>
            <CardContent><p className="text-yellow-600">Your detailed client profile could not be found. Please contact support if this is unexpected.</p></CardContent>
          </Card>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader><CardTitle>Personal Information</CardTitle><CardDescription>Your registered details in our system.</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div><Label htmlFor="name">Full Name</Label><Input id="name" value={clientProfile?.name || ""} readOnly disabled /></div>
              <div><Label htmlFor="email">Registered Email (Login)</Label><Input id="email" value={currentUser?.email || ""} readOnly disabled /></div>
              <div><Label htmlFor="phone">Phone Number</Label><Input id="phone" value={clientProfile?.phone || "N/A"} readOnly disabled /></div>
              <div><Label htmlFor="address">Address</Label><Input id="address" value={clientProfile?.address || "N/A"} readOnly disabled /></div>
              <div><Label htmlFor="clientType">Client Type</Label><Input id="clientType" value={clientProfile?.type || "N/A"} readOnly disabled className="capitalize"/></div>
              <div><Label htmlFor="clientStatus">Client Status</Label><Input id="clientStatus" value={clientProfile?.status || "N/A"} readOnly disabled className="capitalize"/></div>
              <div><Label htmlFor="createdAt">Profile Created</Label><Input id="createdAt" value={formatDate(clientProfile?.createdAt)} readOnly disabled /></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Account Actions</CardTitle><CardDescription>Manage your account settings.</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Password Reset</h3>
                <p className="text-sm text-gray-500 mb-3">If you've forgotten your password or wish to change it, request a password reset email.</p>
                <Button onClick={handlePasswordReset} disabled={isResettingPassword} className="w-full">
                  {isResettingPassword ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</> : <><KeyRound className="mr-2 h-4 w-4" /> Send Password Reset Email</>}
                </Button>
                {resetEmailSent && (
                  <p className="mt-2 text-sm text-green-600 flex items-center"><CheckCircle className="mr-1 h-4 w-4"/>Password reset email sent. Please check your inbox.</p>
                )}
                {resetError && (
                  <p className="mt-2 text-sm text-red-600 flex items-center"><MailWarning className="mr-1 h-4 w-4"/>{resetError}</p>
                )}
              </div>
              {/* Future actions can be added here */}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
