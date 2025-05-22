"use client";

import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";

// Custom Hooks
import { useAuth } from "../../../context/AuthContext";
import { useMyClientProfile } from "@/lib/hooks/use-my-client-profile";
import { useSupportTickets } from "@/lib/hooks/use-support-tickets";

// Types
import type { SupportTicket, SupportTicketStatus } from "@/lib/types";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, AlertTriangle, Menu, X, LayoutDashboard, Users, MessageSquare, Settings, LogOut, PlusCircle, Ticket, Info } from "lucide-react";

// Helper to format date or return N/A
const formatDate = (date: Date | undefined | string) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString();
};

export default function ClientSupportPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser, logout, loading: authLoading } = useAuth();
  const { clientProfile, loading: profileLoading, error: profileError } = useMyClientProfile(currentUser?.uid);
  const { tickets, loading: ticketsLoading, error: ticketsError, createSupportTicket } = useSupportTickets(clientProfile?.id);

  // New Ticket Form State
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  
  const overallLoading = authLoading || profileLoading || ticketsLoading;

  const handleSubmitTicket = async (e: FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      setSubmitError("Subject and Message are required.");
      return;
    }
    if (!clientProfile || !currentUser) {
      setSubmitError("Client profile or user information is not available. Please try again.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      await createSupportTicket({
        clientId: clientProfile.id,
        firebaseUserId: currentUser.uid,
        subject,
        message,
        category: category || undefined, // Pass undefined if empty
        priority: priority || undefined,
      });
      setSubmitSuccess("Support ticket submitted successfully!");
      // Clear form
      setSubject("");
      setMessage("");
      setCategory("");
      setPriority("medium");
    } catch (error: any) {
      console.error("Failed to submit support ticket:", error);
      setSubmitError(`Failed to submit ticket: ${error.message || "Unknown error"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || profileLoading) { // Initial critical data loading
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Loader2 className="h-12 w-12 animate-spin text-green-700" />
        <p className="ml-3 text-lg">Loading Your Support Center...</p>
      </div>
    );
  }

  if (!currentUser) {
     // This should ideally be handled by a global route guard for client pages
    return <div className="flex items-center justify-center min-h-screen">Redirecting to login...</div>;
  }

  if (profileError) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 text-red-600">
            <AlertTriangle className="h-8 w-8 mr-2"/> Error loading client profile: {profileError}
        </div>
    );
  }
  if (!clientProfile && !profileLoading) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 text-orange-600">
            <Info className="h-8 w-8 mr-2"/> Client profile not found. Support ticket system requires a client profile.
        </div>
    );
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
            <Link href="/client/profile" className="flex items-center rounded-md px-4 py-3 text-sm font-medium text-green-100 hover:bg-green-700"><Users className="mr-3 h-5 w-5" />My Profile</Link>
            <Link href="/client/support" className="flex items-center rounded-md bg-green-700 px-4 py-3 text-sm font-medium"><MessageSquare className="mr-3 h-5 w-5" />Support</Link>
            <Link href="/client/settings" className="flex items-center rounded-md px-4 py-3 text-sm font-medium text-green-100 hover:bg-green-700"><Settings className="mr-3 h-5 w-5" />Settings</Link>
          </nav>
          <div className="mt-auto border-t border-green-700 pt-4"><Button variant="ghost" className="flex w-full items-center justify-start" onClick={logout}><LogOut className="mr-3 h-5 w-5" />Logout</Button></div>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Support Center</h1>
          <p className="text-gray-600">Submit new support tickets or view the status of existing ones.</p>
        </header>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><PlusCircle className="mr-2 text-green-700"/>Submit New Support Ticket</CardTitle>
                <CardDescription>Fill out the form below to create a new ticket.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitTicket} className="space-y-4">
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g., Issue with payment" required />
                  </div>
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Describe your issue in detail..." required rows={5}/>
                  </div>
                  <div>
                    <Label htmlFor="category">Category (Optional)</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        <SelectItem value="billing">Billing Inquiry</SelectItem>
                        <SelectItem value="technical">Technical Support</SelectItem>
                        <SelectItem value="maintenance">Maintenance Request</SelectItem>
                        <SelectItem value="general">General Question</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority (Optional)</Label>
                    <Select value={priority} onValueChange={(val) => setPriority(val as "low" | "medium" | "high")}>
                      <SelectTrigger><SelectValue placeholder="Select priority" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {submitError && <p className="text-sm text-red-600 flex items-center"><AlertTriangle className="h-4 w-4 mr-1"/>{submitError}</p>}
                  {submitSuccess && <p className="text-sm text-green-600">{submitSuccess}</p>}
                  <Button type="submit" className="w-full bg-green-700 hover:bg-green-800" disabled={isSubmitting}>
                    {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : "Submit Ticket"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><Ticket className="mr-2 text-green-700"/>Your Support Tickets</CardTitle>
                <CardDescription>Track the status of your submitted tickets.</CardDescription>
              </CardHeader>
              <CardContent>
                {ticketsLoading && <div className="flex items-center justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-green-700" /><p className="ml-2">Loading your tickets...</p></div>}
                {!ticketsLoading && ticketsError && <div className="text-red-500 py-10 text-center"><AlertTriangle className="mx-auto h-8 w-8 mb-2" />Error: {ticketsError}</div>}
                {!ticketsLoading && !ticketsError && tickets.length === 0 && <div className="py-10 text-center"><p className="text-gray-500">You have no support tickets.</p></div>}
                {!ticketsLoading && !ticketsError && tickets.length > 0 && (
                  <div className="space-y-4">
                    {tickets.map(ticket => (
                      <div key={ticket.id} className="border p-4 rounded-lg shadow-sm">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-lg">{ticket.subject}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full capitalize font-medium ${
                            ticket.status === 'open' ? 'bg-blue-100 text-blue-700' :
                            ticket.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
                            ticket.status === 'resolved' ? 'bg-green-100 text-green-700' :
                            ticket.status === 'closed' ? 'bg-gray-100 text-gray-700' : ''
                          }`}>{ticket.status.replace("_", " ")}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{ticket.message}</p>
                        <div className="text-xs text-gray-500 mt-3">
                          <span>Submitted: {formatDate(ticket.submittedAt)}</span>
                          {ticket.lastUpdatedAt && <span> | Last Updated: {formatDate(ticket.lastUpdatedAt)}</span>}
                          {ticket.resolvedAt && ticket.status === 'resolved' && <span> | Resolved: {formatDate(ticket.resolvedAt)}</span>}
                        </div>
                         {ticket.category && <p className="text-xs mt-1">Category: <span className="font-medium">{ticket.category}</span></p>}
                         {ticket.priority && <p className="text-xs">Priority: <span className="font-medium capitalize">{ticket.priority}</span></p>}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
