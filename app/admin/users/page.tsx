"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

// Custom Hooks
import { useAuth } from "../../../context/AuthContext"; 
import { useUsers } from "@/lib/hooks/use-users"; 

// Types
import type { User, UserRole, UserStatus } from "@/lib/types";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog"; // Assuming a generic confirm dialog exists

// Icons
import {
  LayoutDashboard, Users, Building, CreditCard, MessageSquare, BarChart3, Settings, LogOut,
  PlusCircle, Search, Eye, Edit2, Trash2, Loader2, AlertTriangle, Menu, X, Briefcase, UserPlus
} from "lucide-react";

// Reminder: Actual Firebase Auth user creation/deletion is separate.
// This page manages Firestore user metadata.

// Helper to format date or return N/A
const formatDate = (date: Date | undefined) => {
  return date ? new Date(date).toLocaleDateString() : "N/A";
};

export default function UserManagementPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth();

  const { 
    users, 
    loading: usersLoading, 
    error: usersError, 
    createUserMeta, 
    updateUserMeta, 
    deleteUserMeta 
  } = useUsers();

  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<UserRole | "all">("all"); // "all", "admin", "manager", "staff"

  // Dialog States
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [showEditUserDialog, setShowEditUserDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const initialUserFormState = {
    name: "", email: "", phone: "", 
    role: "staff" as UserRole, 
    status: "active" as UserStatus, 
    permissions: [] as string[],
  };
  const [userFormData, setUserFormData] = useState(initialUserFormState);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "all">("all");


  // Filtering Logic
  useEffect(() => {
    let tempUsers = [...users];
    if (activeTab !== "all") {
      tempUsers = tempUsers.filter(user => user.role === activeTab);
    }
    if (statusFilter !== "all") {
      tempUsers = tempUsers.filter(user => user.status === statusFilter);
    }
    if (searchQuery) {
      const lcQuery = searchQuery.toLowerCase();
      tempUsers = tempUsers.filter(user =>
        user.name.toLowerCase().includes(lcQuery) ||
        user.email.toLowerCase().includes(lcQuery) ||
        (user.phone && user.phone.includes(searchQuery))
      );
    }
    setFilteredUsers(tempUsers);
  }, [users, activeTab, statusFilter, searchQuery]);


  const handleInputChange = (field: keyof typeof userFormData, value: string | UserRole | UserStatus | string[]) => {
    setUserFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userFormData.email || !userFormData.name) {
      alert("Name and Email are required.");
      return;
    }
    // Simulate UID generation for metadata creation
    const simulatedUid = `sim_${new Date().getTime().toString()}`; 
    console.warn(`Simulating user creation with UID: ${simulatedUid}. Actual Firebase Auth user needs separate creation.`);
    
    try {
      await createUserMeta(simulatedUid, {
        name: userFormData.name,
        email: userFormData.email,
        phone: userFormData.phone || undefined,
        role: userFormData.role,
        status: userFormData.status,
        permissions: userFormData.permissions, // Assuming permissions are handled as string array
      });
      setShowAddUserDialog(false);
      setUserFormData(initialUserFormState); // Reset form
    } catch (error) {
      console.error("Failed to create user metadata:", error);
      alert("Failed to create user metadata. See console.");
    }
  };

  const openEditDialog = (user: User) => {
    setEditingUser(user);
    setUserFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      role: user.role,
      status: user.status,
      permissions: user.permissions || [],
    });
    setShowEditUserDialog(true);
  };

  const handleEditUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      await updateUserMeta(editingUser.id, { // UID is the ID
        name: userFormData.name,
        email: userFormData.email, // Usually email is not updated this way post-creation
        phone: userFormData.phone || undefined,
        role: userFormData.role,
        status: userFormData.status,
        permissions: userFormData.permissions,
      });
      setShowEditUserDialog(false);
      setEditingUser(null);
    } catch (error) {
      console.error("Failed to update user metadata:", error);
      alert("Failed to update user metadata. See console.");
    }
  };

  const openDeleteDialog = (user: User) => {
    setUserToDelete(user);
    setShowDeleteDialog(true);
  };

  const handleDeleteUserConfirm = async () => {
    if (!userToDelete) return;
    try {
      await deleteUserMeta(userToDelete.id); // UID is the ID
      console.warn(`User metadata for ${userToDelete.email} (UID: ${userToDelete.id}) deleted. Actual Firebase Auth user needs separate deletion.`);
      setShowDeleteDialog(false);
      setUserToDelete(null);
    } catch (error) {
      console.error("Failed to delete user metadata:", error);
      alert("Failed to delete user metadata. See console.");
    }
  };
  

  return (
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
            <Link href="/admin/users" className="flex items-center rounded-md bg-green-700 px-4 py-3 text-sm font-medium"><Users className="mr-3 h-5 w-5" />User Management</Link>
            <Link href="/admin/clients" className="flex items-center rounded-md px-4 py-3 text-sm font-medium text-green-100 hover:bg-green-700"><Users className="mr-3 h-5 w-5" />Client Management</Link>
            <Link href="/admin/apartments" className="flex items-center rounded-md px-4 py-3 text-sm font-medium text-green-100 hover:bg-green-700"><Building className="mr-3 h-5 w-5" />Apartments</Link>
            <Link href="/admin/payments" className="flex items-center rounded-md px-4 py-3 text-sm font-medium text-green-100 hover:bg-green-700"><CreditCard className="mr-3 h-5 w-5" />Payments</Link>
            <Link href="/admin/analytics" className="flex items-center rounded-md px-4 py-3 text-sm font-medium text-green-100 hover:bg-green-700"><BarChart3 className="mr-3 h-5 w-5" />Analytics</Link>
            <Link href="/admin/settings" className="flex items-center rounded-md px-4 py-3 text-sm font-medium text-green-100 hover:bg-green-700"><Settings className="mr-3 h-5 w-5" />Settings</Link>
          </nav>
          <div className="mt-auto border-t border-green-700 pt-4"><Button variant="ghost" className="flex w-full items-center justify-start" onClick={async () => { await logout(); }}><LogOut className="mr-3 h-5 w-5" />Logout</Button></div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 md:p-6">
        <header className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div><h1 className="text-2xl font-bold text-gray-900">User Management</h1><p className="text-gray-500">Manage admin, manager, and staff accounts</p></div>
          <Button className="bg-green-700 hover:bg-green-800" onClick={() => { setUserFormData(initialUserFormState); setShowAddUserDialog(true); }}>
            <UserPlus className="mr-2 h-4 w-4" /> Add New User
          </Button>
        </header>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as UserRole | "all")}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Users</TabsTrigger>
            <TabsTrigger value="admin">Admins</TabsTrigger>
            <TabsTrigger value="manager">Managers</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
          </TabsList>

          <div className="mb-4 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search users (name, email, phone)..." className="pl-8" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as UserStatus | "all")}>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="Filter by status" /></SelectTrigger>
              <SelectContent><SelectItem value="all">All Statuses</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem></SelectContent>
            </Select>
          </div>

          <Card>
            <CardHeader><CardTitle>User List</CardTitle><CardDescription>Overview of all users in the system.</CardDescription></CardHeader>
            <CardContent>
              {usersLoading && <div className="flex items-center justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-green-700" /><p className="ml-2">Loading users...</p></div>}
              {!usersLoading && usersError && <div className="text-red-500 py-10 text-center"><AlertTriangle className="mx-auto h-8 w-8 mb-2" />Error: {usersError}</div>}
              {!usersLoading && !usersError && filteredUsers.length === 0 && <div className="py-10 text-center"><p className="text-gray-500">No users found matching your criteria.</p></div>}
              {!usersLoading && !usersError && filteredUsers.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead><tr className="border-b text-left text-sm text-gray-600"><th className="p-3 font-medium">Name</th><th className="p-3 font-medium">Email</th><th className="p-3 font-medium">Phone</th><th className="p-3 font-medium">Role</th><th className="p-3 font-medium">Status</th><th className="p-3 font-medium">Last Login</th><th className="p-3 font-medium text-right">Actions</th></tr></thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b text-sm hover:bg-gray-50">
                          <td className="p-3">{user.name}</td><td className="p-3">{user.email}</td><td className="p-3">{user.phone || "N/A"}</td>
                          <td className="p-3 capitalize">{user.role}</td>
                          <td className="p-3"><span className={`rounded-full px-2 py-1 text-xs font-medium ${user.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>{user.status}</span></td>
                          <td className="p-3">{formatDate(user.lastLogin)}</td>
                          <td className="p-3 text-right">
                            <Button variant="ghost" size="icon" onClick={() => openEditDialog(user)}><Edit2 size={16}/></Button>
                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={() => openDeleteDialog(user)}><Trash2 size={16}/></Button>
                          </td>
                        </tr>))}
                    </tbody>
                  </table>
                </div>)}
            </CardContent>
          </Card>
        </Tabs>
      </div>

      {/* Add User Dialog */}
      <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
        <DialogContent className="sm:max-w-[450px]">
          <form onSubmit={handleAddUserSubmit}>
            <DialogHeader><DialogTitle>Add New User</DialogTitle><DialogDescription>Create metadata for a new user. Remember to create their auth account separately.</DialogDescription></DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-1"><Label htmlFor="add-name">Name</Label><Input id="add-name" value={userFormData.name} onChange={(e) => handleInputChange("name", e.target.value)} required /></div>
              <div className="space-y-1"><Label htmlFor="add-email">Email</Label><Input id="add-email" type="email" value={userFormData.email} onChange={(e) => handleInputChange("email", e.target.value)} required /></div>
              <div className="space-y-1"><Label htmlFor="add-phone">Phone (Optional)</Label><Input id="add-phone" type="tel" value={userFormData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} /></div>
              <div className="space-y-1"><Label htmlFor="add-role">Role</Label><Select value={userFormData.role} onValueChange={(v) => handleInputChange("role", v as UserRole)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="admin">Admin</SelectItem><SelectItem value="manager">Manager</SelectItem><SelectItem value="staff">Staff</SelectItem></SelectContent></Select></div>
              <div className="space-y-1"><Label htmlFor="add-status">Status</Label><Select value={userFormData.status} onValueChange={(v) => handleInputChange("status", v as UserStatus)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem></SelectContent></Select></div>
              {/* Permissions could be a multi-select or checklist in a real app */}
              <div className="space-y-1"><Label htmlFor="add-permissions">Permissions (comma-separated)</Label><Input id="add-permissions" value={userFormData.permissions.join(", ")} onChange={(e) => handleInputChange("permissions", e.target.value.split(",").map(p=>p.trim()))} /></div>
            </div>
            <DialogFooter><Button type="button" variant="outline" onClick={() => setShowAddUserDialog(false)}>Cancel</Button><Button type="submit" className="bg-green-700 hover:bg-green-800">Create User Metadata</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      {editingUser && (
        <Dialog open={showEditUserDialog} onOpenChange={setShowEditUserDialog}>
          <DialogContent className="sm:max-w-[450px]">
            <form onSubmit={handleEditUserSubmit}>
              <DialogHeader><DialogTitle>Edit User: {editingUser.name}</DialogTitle><DialogDescription>Update user metadata details.</DialogDescription></DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-1"><Label htmlFor="edit-name">Name</Label><Input id="edit-name" value={userFormData.name} onChange={(e) => handleInputChange("name", e.target.value)} required /></div>
                <div className="space-y-1"><Label htmlFor="edit-email">Email</Label><Input id="edit-email" type="email" value={userFormData.email} onChange={(e) => handleInputChange("email", e.target.value)} required /></div>
                <div className="space-y-1"><Label htmlFor="edit-phone">Phone (Optional)</Label><Input id="edit-phone" type="tel" value={userFormData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} /></div>
                <div className="space-y-1"><Label htmlFor="edit-role">Role</Label><Select value={userFormData.role} onValueChange={(v) => handleInputChange("role", v as UserRole)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="admin">Admin</SelectItem><SelectItem value="manager">Manager</SelectItem><SelectItem value="staff">Staff</SelectItem></SelectContent></Select></div>
                <div className="space-y-1"><Label htmlFor="edit-status">Status</Label><Select value={userFormData.status} onValueChange={(v) => handleInputChange("status", v as UserStatus)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem></SelectContent></Select></div>
                <div className="space-y-1"><Label htmlFor="edit-permissions">Permissions (comma-separated)</Label><Input id="edit-permissions" value={userFormData.permissions.join(", ")} onChange={(e) => handleInputChange("permissions", e.target.value.split(",").map(p=>p.trim()))} /></div>
              </div>
              <DialogFooter><Button type="button" variant="outline" onClick={() => {setShowEditUserDialog(false); setEditingUser(null);}}>Cancel</Button><Button type="submit" className="bg-green-700 hover:bg-green-800">Save Changes</Button></DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete User Confirmation Dialog */}
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteUserConfirm}
        title={`Delete User: ${userToDelete?.name || ""}`}
        description="Are you sure you want to delete this user's metadata? This action cannot be undone. Actual Firebase Auth user deletion must be handled separately."
        confirmText="Delete Metadata"
        variant="destructive"
      />
    </div>
  );
}
