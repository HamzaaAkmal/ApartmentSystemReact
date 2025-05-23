"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Custom Hooks
import { useAuth } from "../../../context/AuthContext";
import { useMyClientProfile } from "@/lib/hooks/use-my-client-profile";
import { useMyApartmentDetails } from "@/lib/hooks/use-my-apartment-details";
import { useMyPayments } from "@/lib/hooks/use-my-payments";

// Types (assuming they are correctly defined in lib/types)
import type { Payment, PaymentStatus, Currency } from "@/lib/types";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdBannerCarousel } from "@/components/ad-banner";

// Icons
import {
  LayoutDashboard, Building, CreditCard, MessageSquare, Settings, LogOut, Menu, X, ExternalLink,
  Home, DollarSign, CalendarDays, Bell, AlertCircle, Loader2, Edit, Info, ShieldCheck, FileText, Users
} from "lucide-react";

// Helpers
import { formatCurrency } from "@/lib/data"; // Assuming this utility exists
import ClientRouteGuard from "@/components/auth/ClientRouteGuard"; // Import the guard

// Define DEFAULT_CURRENCY, similar to AdminDashboard
const DEFAULT_CURRENCY: Currency = "USD";

export default function ClientDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser, logout, loading: authLoading, currentUserRole } = useAuth();
  const router = useRouter();

  const { clientProfile, loading: profileLoading, error: profileError } = useMyClientProfile(currentUser?.uid);
  const { apartmentDetails, loading: aptLoading, error: aptError } = useMyApartmentDetails(clientProfile);
  const { payments, loading: paymentsLoading, error: paymentsError } = useMyPayments(clientProfile?.id);

  const loading = authLoading || profileLoading || aptLoading || paymentsLoading;

  // Redirect to login if not authenticated or if role is admin (clients should not access admin dashboard via client login)
  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.push("/admin/dashboard"); // Changed from /client/login
    }
    // if (!authLoading && currentUser && currentUserRole === 'admin' && window.location.pathname.startsWith('/client')) {
    //   logout(); // Log out admin if they somehow land on client page
    //   router.push("/admin/dashboard"); // Changed from /client/login (or a generic landing page)
    // }
  }, [currentUser, authLoading, currentUserRole, router, logout]);


  const paymentSummary = useMemo(() => {
    if (!payments || payments.length === 0) {
      return { totalAmount: 0, paidAmount: 0, remainingAmount: 0, paymentProgress: 0, nextPaymentDue: "N/A", nextPaymentAmount: 0 };
    }
    const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
    const paidAmount = payments.filter(p => p.status === "paid").reduce((sum, p) => sum + p.amount, 0);
    const remainingAmount = totalAmount - paidAmount;
    const paymentProgress = totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0;
    
    const upcomingPayments = payments
      .filter(p => p.status === "pending" || p.status === "overdue")
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
      
    const nextPayment = upcomingPayments[0];

    return {
      totalAmount,
      paidAmount,
      remainingAmount,
      paymentProgress,
      nextPaymentDue: nextPayment ? new Date(nextPayment.dueDate).toLocaleDateString() : "N/A",
      nextPaymentAmount: nextPayment ? nextPayment.amount : 0,
    };
  }, [payments]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Loader2 className="h-12 w-12 animate-spin text-green-700" />
        <p className="ml-3 text-lg">Loading Client Dashboard...</p>
      </div>
    );
  }

  if (!currentUser) {
    // Should be handled by useEffect redirect, but as a fallback:
    return <div className="flex items-center justify-center min-h-screen">Redirecting to login...</div>;
  }
  
  const displayName = clientProfile?.name || currentUser?.email || "Client";

  return (
    <ClientRouteGuard>
      <div className="flex min-h-screen flex-col bg-gray-100 md:flex-row">
        <Button variant="ghost" size="icon" className="absolute left-4 top-4 z-50 md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X /> : <Menu />}
        </Button>
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-green-800 p-4 text-white transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:block`}>
        <div className="flex h-full flex-col">
          <div className="mb-8 flex items-center gap-2 px-2"><Image src="/placeholder.svg?height=40&width=40" alt="Logo" width={40} height={40} className="rounded-md bg-white p-1"/><span className="text-xl font-bold">ApartmentPro</span></div>
          <nav className="flex-1 space-y-1">
            <Link href="/client/dashboard" className="flex items-center rounded-md bg-green-700 px-4 py-3"><LayoutDashboard className="mr-3 h-5 w-5" />Dashboard</Link>
            <Link href="/client/profile" className="flex items-center rounded-md px-4 py-3 hover:bg-green-700"><Users className="mr-3 h-5 w-5" />My Profile</Link>
            <Link href="/client/support" className="flex items-center rounded-md px-4 py-3 hover:bg-green-700"><MessageSquare className="mr-3 h-5 w-5" />Support</Link>
            <Link href="/client/settings" className="flex items-center rounded-md px-4 py-3 hover:bg-green-700"><Settings className="mr-3 h-5 w-5" />Settings</Link>
          </nav>
          <div className="mt-auto border-t border-green-700 pt-4"><Button variant="ghost" className="flex w-full items-center justify-start" onClick={logout}><LogOut className="mr-3 h-5 w-5" />Logout</Button></div>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-6">
        <AdBannerCarousel />
        <header className="my-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div><h1 className="text-3xl font-bold text-gray-900">Welcome, {displayName}!</h1><p className="text-gray-600">Here's an overview of your apartment and financials.</p></div>
        </header>

        <Tabs defaultValue="overview">
          <TabsList className="mb-4"><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="my-apartment">My Apartment</TabsTrigger><TabsTrigger value="payments">Payments</TabsTrigger></TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader><CardTitle className="flex items-center"><Home className="mr-2 text-green-700"/>Apartment Details</CardTitle><CardDescription>Information about your assigned unit.</CardDescription></CardHeader>
                <CardContent>
                  {aptLoading && <div className="flex items-center"><Loader2 className="mr-2 h-5 w-5 animate-spin"/>Loading details...</div>}
                  {aptError && <div className="text-red-500 flex items-center"><AlertCircle className="mr-2 h-5 w-5"/>Error: {aptError}</div>}
                  {!aptLoading && !aptError && apartmentDetails.apartment && apartmentDetails.building && (
                    <div className="space-y-3">
                      <p><strong>Building:</strong> {apartmentDetails.building.name}</p>
                      <p><strong>Unit Number:</strong> {apartmentDetails.apartment.number}</p>
                      <p><strong>Type:</strong> {apartmentDetails.apartment.type}</p>
                      <p><strong>Floor:</strong> {apartmentDetails.apartment.floor}</p>
                      <p><strong>Size:</strong> {apartmentDetails.apartment.size} sq ft</p>
                      <p><strong>Status:</strong> <span className="capitalize font-medium">{apartmentDetails.apartment.status}</span></p>
                    </div>
                  )}
                   {!aptLoading && !aptError && !apartmentDetails.apartment && <p className="text-gray-500">No apartment assigned to your profile.</p>}
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="flex items-center"><DollarSign className="mr-2 text-green-700"/>Payment Summary</CardTitle><CardDescription>Your current payment status.</CardDescription></CardHeader>
                <CardContent>
                  {paymentsLoading && <div className="flex items-center"><Loader2 className="mr-2 h-5 w-5 animate-spin"/>Loading payments...</div>}
                  {paymentsError && <div className="text-red-500 flex items-center"><AlertCircle className="mr-2 h-5 w-5"/>Error: {paymentsError}</div>}
                  {!paymentsLoading && !paymentsError && (
                    <div className="space-y-4">
                      <div><p className="text-sm text-gray-600">Total Paid</p><p className="text-2xl font-semibold">{formatCurrency(paymentSummary.paidAmount, DEFAULT_CURRENCY)}</p></div>
                      <div><p className="text-sm text-gray-600">Remaining Balance</p><p className="text-2xl font-semibold">{formatCurrency(paymentSummary.remainingAmount, DEFAULT_CURRENCY)}</p></div>
                      <Progress value={paymentSummary.paymentProgress} className="w-full" />
                      {paymentSummary.nextPaymentDue !== "N/A" && (
                        <div><p className="text-sm text-gray-600">Next Payment Due</p><p className="font-medium">{paymentSummary.nextPaymentDue} - {formatCurrency(paymentSummary.nextPaymentAmount, DEFAULT_CURRENCY)}</p></div>
                      )}
                      <Button className="w-full bg-green-700 hover:bg-green-800 mt-2" onClick={() => alert("Payment Gateway/System not yet implemented.")}>Make a Payment</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
             <Card>
                <CardHeader><CardTitle className="flex items-center"><Bell className="mr-2 text-green-700"/>Notifications</CardTitle><CardDescription>Important updates and announcements.</CardDescription></CardHeader>
                <CardContent>
                  <p className="text-gray-500">Notification system is under development. Please check back later.</p>
                  {/* Placeholder for future notifications list */}
                </CardContent>
              </Card>
          </TabsContent>

          <TabsContent value="my-apartment">
            <Card>
              <CardHeader><CardTitle>My Apartment Details</CardTitle><CardDescription>Comprehensive information about your unit.</CardDescription></CardHeader>
              <CardContent className="space-y-6">
                {aptLoading && <div className="flex items-center"><Loader2 className="mr-2 h-5 w-5 animate-spin"/>Loading details...</div>}
                {aptError && <div className="text-red-500 flex items-center"><AlertCircle className="mr-2 h-5 w-5"/>Error: {aptError}</div>}
                {!aptLoading && !aptError && apartmentDetails.apartment && apartmentDetails.building && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">Unit Information</h3>
                        <p><strong>Building:</strong> {apartmentDetails.building.name} ({apartmentDetails.building.address})</p>
                        <p><strong>Unit:</strong> {apartmentDetails.apartment.number}, Floor {apartmentDetails.apartment.floor}</p>
                        <p><strong>Type:</strong> {apartmentDetails.apartment.type}</p>
                        <p><strong>Size:</strong> {apartmentDetails.apartment.size} sq ft</p>
                        <p><strong>Current Status:</strong> <span className="capitalize font-medium">{apartmentDetails.apartment.status}</span></p>
                        <p><strong>Purchase Price:</strong> {formatCurrency(apartmentDetails.apartment.price, DEFAULT_CURRENCY)}</p>
                      </div>
                       <div className="space-y-2">
                        <h3 className="text-lg font-semibold">Building Amenities</h3>
                        <p className="text-gray-500">List of building amenities (placeholder).</p>
                        {/* Placeholder for amenities */}
                      </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Apartment Photos</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {[1,2,3,4].map(i => <div key={i} className="aspect-video bg-gray-200 rounded-md flex items-center justify-center"><Image src={`/placeholder.svg?text=Apt+View+${i}`} alt={`Apartment View ${i}`} width={200} height={150} className="object-cover rounded-md"/></div>)}
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button variant="outline" onClick={() => alert("Maintenance Request System not yet implemented.")}>Request Maintenance</Button>
                    </div>
                  </>
                )}
                {!aptLoading && !aptError && !apartmentDetails.apartment && <p className="text-gray-500 py-8 text-center">No apartment details available.</p>}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card>
              <CardHeader><CardTitle>Payment History</CardTitle><CardDescription>Your record of all payments made.</CardDescription></CardHeader>
              <CardContent>
                {paymentsLoading && <div className="flex items-center justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-green-700" /><p className="ml-2">Loading payment history...</p></div>}
                {paymentsError && <div className="text-red-500 py-10 text-center"><AlertCircle className="mx-auto h-8 w-8 mb-2" />Error: {paymentsError}</div>}
                {!paymentsLoading && !paymentsError && payments.length === 0 && <div className="py-10 text-center"><p className="text-gray-500">No payment history found.</p></div>}
                {!paymentsLoading && !paymentsError && payments.length > 0 && (
                  <Table>
                    <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead><TableHead>Method</TableHead><TableHead>Description</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {payments.map((p) => (<TableRow key={p.id}><TableCell>{new Date(p.createdAt || p.dueDate).toLocaleDateString()}</TableCell><TableCell>{formatCurrency(p.amount, p.currency)}</TableCell><TableCell><span className={`capitalize px-2 py-1 text-xs rounded-full ${p.status === 'paid' ? 'bg-green-100 text-green-700' : p.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{p.status}</span></TableCell><TableCell className="capitalize">{p.method.replace("_", " ")}</TableCell><TableCell>Payment for Unit {apartmentDetails.apartment?.number || p.apartmentId.substring(0,4)}</TableCell></TableRow>))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
    </ClientRouteGuard>
  );
}
