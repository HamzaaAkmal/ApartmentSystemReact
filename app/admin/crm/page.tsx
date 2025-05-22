"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

import { useLeads } from "@/lib/hooks/use-leads";
import { useTasks } from "@/lib/hooks/use-tasks";
import { useAuth } from "../../../context/AuthContext"; // Adjusted path, verify based on your structure

import type { Lead, LeadSource, LeadStatus, Task, TaskStatus, TaskPriority } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  LayoutDashboard, Users, Building, CreditCard, MessageSquare, BarChart3, Settings, LogOut,
  PlusCircle, Search, Filter, Eye, Edit2, Trash2, Loader2, AlertTriangle, Menu, X, Briefcase, CalendarDays, ListChecks,
} from "lucide-react";
import AdminRouteGuard from '@/components/auth/AdminRouteGuard'; // Added

// Reminder: Manual Data Seeding for Leads & Tasks
// If you have existing mock data, manually seed it into your Firestore collections.

export default function CRMDashboard() {
  // Sidebar and Dialog States
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddLeadDialog, setShowAddLeadDialog] = useState(false);
  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false);

  // Auth Hook
  const { logout, currentUser } = useAuth();

  // Leads Hook and State
  const { 
    leads: leadsFromHook, 
    loading: leadsLoading, 
    error: leadsError, 
    createLead, 
    updateLead, 
    deleteLead 
  } = useLeads();
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [sourceFilter, setSourceFilter] = useState<LeadSource | "all">("all");
  const [newLeadForm, setNewLeadForm] = useState<{
    name: string; email: string; phone: string; interest: string; source: LeadSource; notes?: string;
  }>({ name: "", email: "", phone: "", interest: "", source: "website", notes: "" });

  // Tasks Hook and State
  const { 
    tasks, 
    loading: tasksLoading, 
    error: tasksError, 
    createTask, 
    updateTask: updateTaskHook, // Aliased to avoid conflict
    deleteTask: deleteTaskHook  // Aliased to avoid conflict
  } = useTasks();
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [taskStatusFilter, setTaskStatusFilter] = useState<TaskStatus | "all">("all");
  const [newTaskForm, setNewTaskForm] = useState<{
    title: string; description?: string; status: TaskStatus; priority: TaskPriority; 
    dueDate?: string; assignedTo?: string; leadId?: string; clientId?: string;
  }>({ 
    title: "", description: "", status: "pending", priority: "medium", 
    dueDate: "", assignedTo: "", leadId: "", clientId: "" 
  });

  // Filtering Logic (useCallback for stability if used in other effects)
  const filterLeads = useCallback((query: string, status: LeadStatus | "all", source: LeadSource | "all", currentLeads: Lead[]) => {
    let tempFiltered = [...currentLeads];
    if (query) {
      const lcQuery = query.toLowerCase();
      tempFiltered = tempFiltered.filter(lead => 
        lead.name.toLowerCase().includes(lcQuery) ||
        lead.email.toLowerCase().includes(lcQuery) ||
        lead.phone.includes(query) ||
        (lead.interest && lead.interest.toLowerCase().includes(lcQuery))
      );
    }
    if (status !== "all") tempFiltered = tempFiltered.filter(lead => lead.status === status);
    if (source !== "all") tempFiltered = tempFiltered.filter(lead => lead.source === source);
    setFilteredLeads(tempFiltered);
  }, []);

  const filterTasks = useCallback((status: TaskStatus | "all", currentTasks: Task[]) => {
    let tempFiltered = [...currentTasks];
    if (status !== "all") {
      tempFiltered = tempFiltered.filter(task => task.status === status);
    }
    setFilteredTasks(tempFiltered);
  }, []);

  // Effects for Filtering
  useEffect(() => {
    filterLeads(searchQuery, statusFilter, sourceFilter, leadsFromHook);
  }, [leadsFromHook, searchQuery, statusFilter, sourceFilter, filterLeads]);

  useEffect(() => {
    filterTasks(taskStatusFilter, tasks);
  }, [tasks, taskStatusFilter, filterTasks]);

  // Event Handlers
  const handleSearch = (query: string) => setSearchQuery(query);
  const handleStatusFilterChange = (status: LeadStatus | "all") => setStatusFilter(status);
  const handleSourceFilterChange = (source: LeadSource | "all") => setSourceFilter(source);
  const handleTaskStatusFilterChange = (status: TaskStatus | "all") => setTaskStatusFilter(status);

  const handleAddLead = async () => {
    if (!newLeadForm.name || !newLeadForm.email || !newLeadForm.phone) {
        alert("Please fill in required lead fields (Name, Email, Phone).");
        return;
    }
    const leadToAdd: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'> = {
      ...newLeadForm, 
      notes: newLeadForm.notes || "", 
      status: "new", 
      lastContact: new Date(), 
    };
    try {
      await createLead(leadToAdd);
      setShowAddLeadDialog(false); 
      setNewLeadForm({ name: "", email: "", phone: "", interest: "", source: "website", notes: "" });
    } catch (error) {
      console.error("Failed to add lead:", error); alert("Failed to add lead. See console.");
    }
  };

  const handleAddTask = async () => {
    if (!newTaskForm.title) {
        alert("Please provide a title for the task.");
        return;
    }
    const taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'completedAt'> = {
      title: newTaskForm.title,
      description: newTaskForm.description || "",
      status: newTaskForm.status,
      priority: newTaskForm.priority,
      dueDate: newTaskForm.dueDate ? new Date(newTaskForm.dueDate) : undefined,
      assignedTo: newTaskForm.assignedTo || undefined,
      leadId: newTaskForm.leadId || undefined,
      clientId: newTaskForm.clientId || undefined,
    };
    try {
      await createTask(taskData);
      setShowAddTaskDialog(false);
      setNewTaskForm({ title: "", description: "", status: "pending", priority: "medium", dueDate: "", assignedTo: "", leadId: "", clientId: ""});
    } catch (error) {
      console.error("Failed to add task:", error); alert("Failed to add task. See console.");
    }
  };

  const handleEditLead = async (lead: Lead) => {
    // Placeholder: In a real app, this would open an EditLeadDialog
    if (confirm(`Mock Edit: Mark lead "${lead.name}" as 'Contacted' and update last contact?`)) {
      try {
        await updateLead(lead.id, { status: "contacted", lastContact: new Date() });
        alert(`Lead "${lead.name}" updated.`);
      } catch (e) { console.error("Error updating lead:", e); alert("Failed to update lead."); }
    }
  };

  const handleDeleteLead = async (leadId: string, leadName: string) => {
    if (confirm(`Are you sure you want to delete lead "${leadName}"? This action cannot be undone.`)) {
      try { await deleteLead(leadId); alert(`Lead "${leadName}" deleted.`); }
      catch (e) { console.error("Error deleting lead:", e); alert("Failed to delete lead."); }
    }
  };

  const handleEditTask = async (task: Task) => {
    // Placeholder: In a real app, this would open an EditTaskDialog
     if (confirm(`Mock Edit: Mark task "${task.title}" as 'Completed'?`)) {
      try {
        await updateTaskHook(task.id, { status: "completed", completedAt: new Date() });
        alert(`Task "${task.title}" updated.`);
      } catch (e) { console.error("Error updating task:", e); alert("Failed to update task."); }
    }
  };

  const handleDeleteTask = async (taskId: string, taskTitle: string) => {
     if (confirm(`Are you sure you want to delete task "${taskTitle}"?`)) {
      try { await deleteTaskHook(taskId); alert(`Task "${taskTitle}" deleted.`); }
      catch (e) { console.error("Error deleting task:", e); alert("Failed to delete task."); }
    }
  };

  // JSX Structure
  return (
    <AdminRouteGuard>
      <div className="flex min-h-screen flex-col bg-gray-100">
        {/* Sidebar */}
        <div className="flex flex-1 flex-col md:flex-row">
        <Button variant="ghost" size="icon" className="absolute left-4 top-4 z-50 md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
        <div className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-green-800 p-4 text-white transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:block`}>
          <div className="flex h-full flex-col">
            <div className="mb-8 flex items-center gap-2 px-2">
              <Image src="/placeholder.svg?height=40&width=40" alt="Logo" width={40} height={40} className="rounded-md bg-white p-1"/>
              <span className="text-xl font-bold">ApartmentPro</span>
            </div>
            <nav className="flex-1 space-y-1">
              <Link href="/admin/dashboard" className="flex items-center rounded-md px-4 py-3 text-sm font-medium text-green-100 hover:bg-green-700"><LayoutDashboard className="mr-3 h-5 w-5" />Dashboard</Link>
              <Link href="/admin/users" className="flex items-center rounded-md px-4 py-3 text-sm font-medium text-green-100 hover:bg-green-700"><Users className="mr-3 h-5 w-5" />User Management</Link>
              <Link href="/admin/clients" className="flex items-center rounded-md px-4 py-3 text-sm font-medium text-green-100 hover:bg-green-700"><Users className="mr-3 h-5 w-5" />Client Management</Link>
              <Link href="/admin/apartments" className="flex items-center rounded-md px-4 py-3 text-sm font-medium text-green-100 hover:bg-green-700"><Building className="mr-3 h-5 w-5" />Apartments</Link>
              <Link href="/admin/payments" className="flex items-center rounded-md px-4 py-3 text-sm font-medium text-green-100 hover:bg-green-700"><CreditCard className="mr-3 h-5 w-5" />Payments</Link>
              <Link href="/admin/crm" className="flex items-center rounded-md bg-green-700 px-4 py-3 text-sm font-medium"><Briefcase className="mr-3 h-5 w-5" />CRM</Link>
              <Link href="/admin/analytics" className="flex items-center rounded-md px-4 py-3 text-sm font-medium text-green-100 hover:bg-green-700"><BarChart3 className="mr-3 h-5 w-5" />Analytics</Link>
              <Link href="/admin/settings" className="flex items-center rounded-md px-4 py-3 text-sm font-medium text-green-100 hover:bg-green-700"><Settings className="mr-3 h-5 w-5" />Settings</Link>
            </nav>
            <div className="mt-auto border-t border-green-700 pt-4">
              <Button variant="ghost" className="flex w-full items-center justify-start rounded-md px-4 py-3 text-sm font-medium text-green-100 hover:bg-green-700 hover:text-white" onClick={async () => { await logout(); }}>
                <LogOut className="mr-3 h-5 w-5" />Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-4 md:p-6">
          <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">CRM Dashboard</h1>
              <p className="text-gray-500">Manage your leads, tasks, and customer interactions.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button className="bg-green-700 hover:bg-green-800" onClick={() => setShowAddLeadDialog(true)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Lead
              </Button>
              <Button variant="outline" onClick={() => setShowAddTaskDialog(true)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Task
              </Button>
            </div>
          </header>

          <Tabs defaultValue="leads">
            <TabsList className="mb-4">
              <TabsTrigger value="leads">Leads Management</TabsTrigger>
              <TabsTrigger value="tasks">Task Management</TabsTrigger>
            </TabsList>

            {/* Leads Tab */}
            <TabsContent value="leads">
              <Card>
                <CardHeader>
                  <CardTitle>All Leads</CardTitle>
                  <CardDescription>View, filter, and manage all potential client leads.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex flex-col gap-4 sm:flex-row">
                    <div className="relative flex-1">
                      <Input type="search" placeholder="Search leads (name, email, phone, interest)..." value={searchQuery} onChange={(e) => handleSearch(e.target.value)} className="pl-10" />
                      <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    </div>
                    <div className="flex gap-2">
                      <Select value={statusFilter} onValueChange={(value) => handleStatusFilterChange(value as LeadStatus | "all")}>
                        <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Filter by status" /></SelectTrigger>
                        <SelectContent><SelectItem value="all">All Statuses</SelectItem><SelectItem value="new">New</SelectItem><SelectItem value="contacted">Contacted</SelectItem><SelectItem value="qualified">Qualified</SelectItem><SelectItem value="unqualified">Unqualified</SelectItem><SelectItem value="converted">Converted</SelectItem></SelectContent>
                      </Select>
                      <Select value={sourceFilter} onValueChange={(value) => handleSourceFilterChange(value as LeadSource | "all")}>
                        <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Filter by source" /></SelectTrigger>
                        <SelectContent><SelectItem value="all">All Sources</SelectItem><SelectItem value="website">Website</SelectItem><SelectItem value="referral">Referral</SelectItem><SelectItem value="social_media">Social Media</SelectItem><SelectItem value="property_portal">Property Portal</SelectItem><SelectItem value="walk_in">Walk-in</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    {leadsLoading && <div className="flex justify-center items-center py-10"><Loader2 className="h-8 w-8 animate-spin text-green-700" /><p className="ml-2">Loading leads...</p></div>}
                    {!leadsLoading && leadsError && <div className="flex flex-col items-center justify-center py-10 text-red-600"><AlertTriangle className="h-8 w-8 mb-2" /><p>Error: {leadsError}</p></div>}
                    {!leadsLoading && !leadsError && filteredLeads.length === 0 && <div className="py-10 text-center"><p className="text-gray-500">No leads found matching your criteria.</p></div>}
                    {!leadsLoading && !leadsError && filteredLeads.length > 0 && (
                      <table className="w-full text-sm">
                        <thead><tr className="border-b text-left text-gray-600"><th className="px-4 py-3 font-medium">Name</th><th className="px-4 py-3 font-medium">Email</th><th className="px-4 py-3 font-medium">Phone</th><th className="px-4 py-3 font-medium">Interest</th><th className="px-4 py-3 font-medium">Source</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 font-medium">Last Contact</th><th className="px-4 py-3 font-medium text-right">Actions</th></tr></thead>
                        <tbody>
                          {filteredLeads.map((lead) => (
                            <tr key={lead.id} className="border-b hover:bg-gray-50">
                              <td className="px-4 py-3">{lead.name}</td><td className="px-4 py-3">{lead.email}</td><td className="px-4 py-3">{lead.phone}</td><td className="px-4 py-3">{lead.interest}</td><td className="px-4 py-3 capitalize">{lead.source.replace("_", " ")}</td>
                              <td className="px-4 py-3"><span className={`rounded-full px-2 py-1 text-xs font-medium ${ lead.status === "new" ? "bg-blue-100 text-blue-700" : lead.status === "contacted" ? "bg-yellow-100 text-yellow-700" : lead.status === "qualified" ? "bg-purple-100 text-purple-700" : lead.status === "converted" ? "bg-green-100 text-green-700" : lead.status === "unqualified" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700" }`}>{lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}</span></td>
                              <td className="px-4 py-3">{lead.lastContact ? new Date(lead.lastContact).toLocaleDateString() : "N/A"}</td>
                              <td className="px-4 py-3 text-right"><Button variant="ghost" size="sm" onClick={() => alert(`Viewing lead ${lead.name}`)}><Eye className="mr-1 h-4 w-4" />View</Button><Button variant="ghost" size="sm" onClick={() => handleEditLead(lead)}><Edit2 className="mr-1 h-4 w-4" />Edit</Button><Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDeleteLead(lead.id, lead.name)}><Trash2 className="mr-1 h-4 w-4" />Delete</Button></td>
                            </tr>))}
                        </tbody>
                      </table>)}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tasks Tab */}
            <TabsContent value="tasks">
              <Card>
                <CardHeader><CardTitle>Task Management</CardTitle><CardDescription>Track and manage tasks related to leads and clients.</CardDescription></CardHeader>
                <CardContent>
                  <div className="mb-4 flex flex-col gap-4 sm:flex-row">
                     <Select value={taskStatusFilter} onValueChange={(value) => handleTaskStatusFilterChange(value as TaskStatus | "all")}>
                        <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Filter by status" /></SelectTrigger>
                        <SelectContent><SelectItem value="all">All Statuses</SelectItem><SelectItem value="pending">Pending</SelectItem><SelectItem value="in_progress">In Progress</SelectItem><SelectItem value="completed">Completed</SelectItem><SelectItem value="cancelled">Cancelled</SelectItem></SelectContent>
                      </Select>
                  </div>
                  <div className="overflow-x-auto">
                    {tasksLoading && <div className="flex justify-center items-center py-10"><Loader2 className="h-8 w-8 animate-spin text-green-700" /><p className="ml-2">Loading tasks...</p></div>}
                    {!tasksLoading && tasksError && <div className="flex flex-col items-center justify-center py-10 text-red-600"><AlertTriangle className="h-8 w-8 mb-2" /><p>Error: {tasksError}</p></div>}
                    {!tasksLoading && !tasksError && filteredTasks.length === 0 && <div className="py-10 text-center"><p className="text-gray-500">No tasks found matching your criteria.</p></div>}
                    {!tasksLoading && !tasksError && filteredTasks.length > 0 && (
                      <table className="w-full text-sm">
                        <thead><tr className="border-b text-left text-gray-600"><th className="px-4 py-3 font-medium">Title</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 font-medium">Priority</th><th className="px-4 py-3 font-medium">Due Date</th><th className="px-4 py-3 font-medium">Assigned To</th><th className="px-4 py-3 font-medium">Related To</th><th className="px-4 py-3 font-medium text-right">Actions</th></tr></thead>
                        <tbody>
                          {filteredTasks.map((task) => (
                            <tr key={task.id} className="border-b hover:bg-gray-50">
                              <td className="px-4 py-3">{task.title}</td>
                              <td className="px-4 py-3"><span className={`rounded-full px-2 py-1 text-xs font-medium ${ task.status === "pending" ? "bg-yellow-100 text-yellow-700" : task.status === "in_progress" ? "bg-blue-100 text-blue-700" : task.status === "completed" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700" }`}>{task.status.charAt(0).toUpperCase() + task.status.slice(1)}</span></td>
                              <td className="px-4 py-3 capitalize">{task.priority}</td>
                              <td className="px-4 py-3">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A"}</td>
                              <td className="px-4 py-3">{task.assignedTo || "N/A"}</td>
                              <td className="px-4 py-3">{task.leadId ? `Lead: ${task.leadId.substring(0,5)}...` : task.clientId ? `Client: ${task.clientId.substring(0,5)}...` : "N/A"}</td>
                              <td className="px-4 py-3 text-right"><Button variant="ghost" size="sm" onClick={() => handleEditTask(task)}><Edit2 className="mr-1 h-4 w-4" />Edit</Button><Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDeleteTask(task.id, task.title)}><Trash2 className="mr-1 h-4 w-4" />Delete</Button></td>
                            </tr>))}
                        </tbody>
                      </table>)}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Add Lead Dialog */}
      <Dialog open={showAddLeadDialog} onOpenChange={setShowAddLeadDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={(e) => { e.preventDefault(); handleAddLead(); }}>
            <DialogHeader><DialogTitle>Add New Lead</DialogTitle><DialogDescription>Enter the details of the new lead.</DialogDescription></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="lead-name" className="text-right">Name</Label><Input id="lead-name" value={newLeadForm.name} onChange={(e) => setNewLeadForm({...newLeadForm, name: e.target.value})} className="col-span-3" required /></div>
              <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="lead-email" className="text-right">Email</Label><Input id="lead-email" type="email" value={newLeadForm.email} onChange={(e) => setNewLeadForm({...newLeadForm, email: e.target.value})} className="col-span-3" required /></div>
              <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="lead-phone" className="text-right">Phone</Label><Input id="lead-phone" value={newLeadForm.phone} onChange={(e) => setNewLeadForm({...newLeadForm, phone: e.target.value})} className="col-span-3" required /></div>
              <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="lead-interest" className="text-right">Interest</Label><Input id="lead-interest" value={newLeadForm.interest} onChange={(e) => setNewLeadForm({...newLeadForm, interest: e.target.value})} className="col-span-3" /></div>
              <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="lead-source" className="text-right">Source</Label><Select value={newLeadForm.source} onValueChange={(value) => setNewLeadForm({...newLeadForm, source: value as LeadSource})}><SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="website">Website</SelectItem><SelectItem value="referral">Referral</SelectItem><SelectItem value="social_media">Social Media</SelectItem><SelectItem value="property_portal">Property Portal</SelectItem><SelectItem value="walk_in">Walk-in</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent></Select></div>
              <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="lead-notes" className="text-right">Notes</Label><Textarea id="lead-notes" value={newLeadForm.notes} onChange={(e) => setNewLeadForm({...newLeadForm, notes: e.target.value})} className="col-span-3" /></div>
            </div>
            <DialogFooter><Button type="button" variant="outline" onClick={() => setShowAddLeadDialog(false)}>Cancel</Button><Button type="submit" className="bg-green-700 hover:bg-green-800">Save Lead</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Task Dialog */}
      <Dialog open={showAddTaskDialog} onOpenChange={setShowAddTaskDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={(e) => { e.preventDefault(); handleAddTask(); }}>
            <DialogHeader><DialogTitle>Add New Task</DialogTitle><DialogDescription>Fill in the details for the new task.</DialogDescription></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="task-title" className="text-right">Title</Label><Input id="task-title" value={newTaskForm.title} onChange={(e) => setNewTaskForm({...newTaskForm, title: e.target.value})} className="col-span-3" required /></div>
              <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="task-desc" className="text-right">Description</Label><Textarea id="task-desc" value={newTaskForm.description} onChange={(e) => setNewTaskForm({...newTaskForm, description: e.target.value})} className="col-span-3" /></div>
              <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="task-status" className="text-right">Status</Label><Select value={newTaskForm.status} onValueChange={(value) => setNewTaskForm({...newTaskForm, status: value as TaskStatus})}><SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="pending">Pending</SelectItem><SelectItem value="in_progress">In Progress</SelectItem><SelectItem value="completed">Completed</SelectItem><SelectItem value="cancelled">Cancelled</SelectItem></SelectContent></Select></div>
              <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="task-priority" className="text-right">Priority</Label><Select value={newTaskForm.priority} onValueChange={(value) => setNewTaskForm({...newTaskForm, priority: value as TaskPriority})}><SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem><SelectItem value="urgent">Urgent</SelectItem></SelectContent></Select></div>
              <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="task-dueDate" className="text-right">Due Date</Label><Input id="task-dueDate" type="date" value={newTaskForm.dueDate} onChange={(e) => setNewTaskForm({...newTaskForm, dueDate: e.target.value})} className="col-span-3" /></div>
              <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="task-assignedTo" className="text-right">Assigned To</Label><Input id="task-assignedTo" value={newTaskForm.assignedTo} onChange={(e) => setNewTaskForm({...newTaskForm, assignedTo: e.target.value})} className="col-span-3" placeholder="User ID or name"/></div>
              <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="task-leadId" className="text-right">Lead ID</Label><Input id="task-leadId" value={newTaskForm.leadId} onChange={(e) => setNewTaskForm({...newTaskForm, leadId: e.target.value})} className="col-span-3" placeholder="Optional Lead ID"/></div>
              <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="task-clientId" className="text-right">Client ID</Label><Input id="task-clientId" value={newTaskForm.clientId} onChange={(e) => setNewTaskForm({...newTaskForm, clientId: e.target.value})} className="col-span-3" placeholder="Optional Client ID"/></div>
            </div>
            <DialogFooter><Button type="button" variant="outline" onClick={() => setShowAddTaskDialog(false)}>Cancel</Button><Button type="submit" className="bg-green-700 hover:bg-green-800">Save Task</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      </div>
    </AdminRouteGuard>
  );
}
