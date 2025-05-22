"use client";

import { useState, useEffect, useCallback, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";

// Custom Hooks
import { useAuth } from "../../../context/AuthContext";
import { useSupportTickets } from "@/lib/hooks/use-support-tickets";
import { useCrud as useClientCrud } from "@/lib/hooks/use-crud"; // To fetch client names

// Component
import AdminRouteGuard from '@/components/auth/AdminRouteGuard';

// Types
import type { SupportTicket, SupportTicketStatus, Client } from "@/lib/types";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"; // For message preview

// Icons
import {
  LayoutDashboard, Users, Building, CreditCard, MessageSquare, BarChart3, Settings, LogOut,
  Search, Loader2, AlertTriangle, Menu, X, Briefcase, Ticket, Edit2, Save
} from "lucide-react";

// Helper to format date or return N/A
const formatDate = (date: Date | undefined | string) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString();
};

const getStatusColor = (status: SupportTicketStatus) => {
  switch (status) {
    case "open": return "bg-blue-100 text-blue-700";
    case "in_progress": return "bg-yellow-100 text-yellow-700";
    case "resolved": return "bg-green-100 text-green-700";
    case "closed": return "bg-gray-100 text-gray-700";
    default: return "bg-gray-100 text-gray-700";
  }
};

const getPriorityColor = (priority?: "low" | "medium" | "high") => {
  switch (priority) {
    case "low": return "bg-gray-100 text-gray-700";
    case "medium": return "bg-orange-100 text-orange-700";
    case "high": return "bg-red-100 text-red-700";
    default: return "bg-gray-100 text-gray-500";
  }
};

export default function AdminSupportTicketsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout, currentUserRole } = useAuth(); // currentUserRole for potential future UI changes

  const { tickets, loading: ticketsLoading, error: ticketsError, updateSupportTicket } = useSupportTickets(); // Fetch all tickets for admin
  const { items: clients, loading: clientsLoading } = useClientCrud(); // Fetch clients to display names

  const [filteredTickets, setFilteredTickets] = useState<SupportTicket[]>([]);
  const [statusFilter, setStatusFilter] = useState<SupportTicketStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<"all" | "low" | "medium" | "high">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // State for inline status editing
  const [editingTicketId, setEditingTicketId] = useState<string | null>(null);
  const [newStatusForEdit, setNewStatusForEdit] = useState<SupportTicketStatus | null>(null);


  // Filtering Logic
  const filterAndSearchTickets = useCallback(() => {
    let tempTickets = [...tickets];

    if (statusFilter !== "all") {
      tempTickets = tempTickets.filter(ticket => ticket.status === statusFilter);
    }
    if (priorityFilter !== "all") {
      tempTickets = tempTickets.filter(ticket => ticket.priority === priorityFilter);
    }
    if (searchQuery) {
      const lcQuery = searchQuery.toLowerCase();
      tempTickets = tempTickets.filter(ticket => {
        const client = clients.find(c => c.id === ticket.clientId);
        return (
          ticket.id.toLowerCase().includes(lcQuery) ||
          ticket.subject.toLowerCase().includes(lcQuery) ||
          ticket.clientId.toLowerCase().includes(lcQuery) ||
          (client && client.name.toLowerCase().includes(lcQuery)) ||
          (ticket.category && ticket.category.toLowerCase().includes(lcQuery))
        );
      });
    }
    setFilteredTickets(tempTickets);
  }, [tickets, statusFilter, priorityFilter, searchQuery, clients]);

  useEffect(() => {
    filterAndSearchTickets();
  }, [filterAndSearchTickets]);


  const handleUpdateTicketStatus = async (ticketId: string, newStatus: SupportTicketStatus) => {
    try {
      await updateSupportTicket(ticketId, { status: newStatus });
      console.log(`Ticket ${ticketId} status updated to ${newStatus}`);
      // Ideally, show a toast notification here
      alert(`Ticket ${ticketId} status updated to ${newStatus}`);
      setEditingTicketId(null); // Close editing UI if any
    } catch (error) {
      console.error("Failed to update ticket status:", error);
      alert("Failed to update ticket status. See console.");
    }
  };
  
  const getClientName = (clientId: string) => {
    if (clientsLoading) return "Loading...";
    return clients.find((c: Client) => c.id === clientId)?.name || clientId.substring(0, 7) + "...";
  };

  return (
    <AdminRouteGuard>
      <div className="flex min-h-screen flex-col bg-gray-100 md:flex-row">
        {/* Sidebar */}
        <Button variant="ghost" size="icon" className="absolute left-4 top-4 z-50 md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
        <div className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-green-800 p-4 text-white transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:block`}>
          <div className="flex h-full flex-col">
            <div className="mb-8 flex items-center gap-2 px-2"><Image src="/placeholder.svg?height=40&width=40" alt="Logo" width={40} height={40} className="rounded-md bg-white p-1"/><span className="text-xl font-bold">ApartmentPro</span></div>
            <nav className="flex-1 space-y-1">
              <Link href="/admin/dashboard" className="flex items-center rounded-md px-4 py-3 text-sm font-medium text-green-100 hover:bg-green-700"><LayoutDashboard className="mr-3 h-5 w-5" />Dashboard</Link>
              <Link href="/admin/crm" className="flex items-center rounded-md px-4 py-3 text-sm font-medium text-green-100 hover:bg-green-700"><Briefcase className="mr-3 h-5 w-5" />CRM</Link>
              <Link href="/admin/users" className="flex items-center rounded-md px-4 py-3 text-sm font-medium text-green-100 hover:bg-green-700"><Users className="mr-3 h-5 w-5" />User Management</Link>
              <Link href="/admin/clients" className="flex items-center rounded-md px-4 py-3 text-sm font-medium text-green-100 hover:bg-green-700"><Users className="mr-3 h-5 w-5" />Client Management</Link>
              <Link href="/admin/apartments" className="flex items-center rounded-md px-4 py-3 text-sm font-medium text-green-100 hover:bg-green-700"><Building className="mr-3 h-5 w-5" />Apartments</Link>
              <Link href="/admin/payments" className="flex items-center rounded-md px-4 py-3 text-sm font-medium text-green-100 hover:bg-green-700"><CreditCard className="mr-3 h-5 w-5" />Payments</Link>
              <Link href="/admin/analytics" className="flex items-center rounded-md px-4 py-3 text-sm font-medium text-green-100 hover:bg-green-700"><BarChart3 className="mr-3 h-5 w-5" />Analytics</Link>
              <Link href="/admin/support" className="flex items-center rounded-md bg-green-700 px-4 py-3 text-sm font-medium"><Ticket className="mr-3 h-5 w-5" />Support Tickets</Link>
              <Link href="/admin/settings" className="flex items-center rounded-md px-4 py-3 text-sm font-medium text-green-100 hover:bg-green-700"><Settings className="mr-3 h-5 w-5" />Settings</Link>
            </nav>
            <div className="mt-auto border-t border-green-700 pt-4"><Button variant="ghost" className="flex w-full items-center justify-start" onClick={logout}><LogOut className="mr-3 h-5 w-5" />Logout</Button></div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-4 md:p-6">
          <header className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Support Ticket Management</h1>
            <p className="text-gray-600">View and manage all support tickets.</p>
          </header>

          <Card>
            <CardHeader>
              <CardTitle>All Support Tickets</CardTitle>
              <CardDescription>Filter and manage submitted support tickets.</CardDescription>
              <div className="mt-4 flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search by ID, Client, Subject..." className="pl-8" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as SupportTicketStatus | "all")}>
                  <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Filter by status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value as "all" | "low" | "medium" | "high")}>
                  <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Filter by priority" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {ticketsLoading && <div className="flex items-center justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-green-700" /><p className="ml-2">Loading tickets...</p></div>}
              {!ticketsLoading && ticketsError && <div className="text-red-500 py-10 text-center"><AlertTriangle className="mx-auto h-8 w-8 mb-2" />Error: {ticketsError}</div>}
              {!ticketsLoading && !ticketsError && filteredTickets.length === 0 && <div className="py-10 text-center"><p className="text-gray-500">No support tickets found matching your criteria.</p></div>}
              {!ticketsLoading && !ticketsError && filteredTickets.length > 0 && (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader><TableRow><TableHead>Ticket ID</TableHead><TableHead>Client</TableHead><TableHead>Subject</TableHead><TableHead>Category</TableHead><TableHead>Priority</TableHead><TableHead>Status</TableHead><TableHead>Submitted</TableHead><TableHead>Last Updated</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {filteredTickets.map((ticket) => (
                        <TableRow key={ticket.id}>
                          <TableCell className="font-mono text-xs">{ticket.id.substring(0, 7)}...</TableCell>
                          <TableCell>{getClientName(ticket.clientId)}</TableCell>
                          <TableCell>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild><span className="truncate max-w-[150px] inline-block">{ticket.subject}</span></TooltipTrigger>
                                <TooltipContent><p className="max-w-xs">{ticket.subject}</p></TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                          <TableCell>{ticket.category || "N/A"}</TableCell>
                          <TableCell><span className={`px-2 py-0.5 text-xs rounded-full capitalize ${getPriorityColor(ticket.priority)}`}>{ticket.priority || "N/A"}</span></TableCell>
                          <TableCell><span className={`px-2 py-0.5 text-xs rounded-full capitalize ${getStatusColor(ticket.status)}`}>{ticket.status.replace("_", " ")}</span></TableCell>
                          <TableCell>{formatDate(ticket.submittedAt)}</TableCell>
                          <TableCell>{formatDate(ticket.lastUpdatedAt)}</TableCell>
                          <TableCell className="text-right">
                            {editingTicketId === ticket.id ? (
                              <div className="flex items-center gap-1">
                                <Select value={newStatusForEdit || ticket.status} onValueChange={(value) => setNewStatusForEdit(value as SupportTicketStatus)}>
                                  <SelectTrigger className="h-8 text-xs w-[120px]"><SelectValue /></SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="open">Open</SelectItem>
                                    <SelectItem value="in_progress">In Progress</SelectItem>
                                    <SelectItem value="resolved">Resolved</SelectItem>
                                    <SelectItem value="closed">Closed</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { if(newStatusForEdit) handleUpdateTicketStatus(ticket.id, newStatusForEdit); setEditingTicketId(null); }}><Save size={16} className="text-green-600"/></Button>
                                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setEditingTicketId(null)}><X size={16}/></Button>
                              </div>
                            ) : (
                              <Button variant="outline" size="xs" onClick={() => { setEditingTicketId(ticket.id); setNewStatusForEdit(ticket.status); }}><Edit2 size={14} className="mr-1"/> Status</Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminRouteGuard>
  );
}
