"use client";

import { useState, useEffect, useCallback, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";

// Custom Hooks
import { useAuth } from "../../../context/AuthContext"; 
import { useAdBanners } from "@/lib/hooks/use-ad-banners"; 

// Component
import AdminRouteGuard from '@/components/auth/AdminRouteGuard';

// Types
import type { AdBanner } from "@/lib/types";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog"; // Assuming this exists

// Icons
import {
  LayoutDashboard, Users, Building, CreditCard, MessageSquare, BarChart3, Settings, LogOut,
  PlusCircle, Search, Eye, Edit2, Trash2, Loader2, AlertTriangle, Menu, X, Briefcase, GalleryHorizontalEnd, CalendarIcon
} from "lucide-react";

// Helper to format date or return N/A
const formatDate = (date: Date | undefined | string) => {
  if (!date) return "N/A";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "Invalid Date";
  return d.toLocaleDateString();
};

// Helper to format date for input type="date"
const formatDateForInput = (date: Date | undefined | string): string => {
  if (!date) return "";
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().split('T')[0];
  } catch (e) {
    return "";
  }
};

const initialAdFormData: Partial<AdBanner> = {
  title: "",
  description: "",
  imageUrl: "",
  linkUrl: "",
  isActive: true,
  startDate: new Date(),
  endDate: undefined,
};

export default function AdminAdsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout, currentUserRole } = useAuth(); 
  const { 
    adBanners, 
    loading: bannersLoading, 
    error: bannersError, 
    createAdBanner, 
    updateAdBanner, 
    deleteAdBanner 
  } = useAdBanners();

  const [filteredAdBanners, setFilteredAdBanners] = useState<AdBanner[]>([]);
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [showAdDialog, setShowAdDialog] = useState(false);
  const [currentAdFormData, setCurrentAdFormData] = useState<Partial<AdBanner>>(initialAdFormData);
  const [isEditing, setIsEditing] = useState(false);
  const [adToDelete, setAdToDelete] = useState<AdBanner | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Filtering Logic
  useEffect(() => {
    let tempBanners = [...adBanners];
    if (statusFilter !== "all") {
      tempBanners = tempBanners.filter(banner => banner.isActive === (statusFilter === "active"));
    }
    if (searchQuery) {
      const lcQuery = searchQuery.toLowerCase();
      tempBanners = tempBanners.filter(banner =>
        banner.title.toLowerCase().includes(lcQuery) ||
        (banner.description && banner.description.toLowerCase().includes(lcQuery))
      );
    }
    setFilteredAdBanners(tempBanners);
  }, [adBanners, statusFilter, searchQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentAdFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setCurrentAdFormData(prev => ({ ...prev, isActive: checked }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentAdFormData(prev => ({ ...prev, [name]: value ? new Date(value) : undefined }));
  };
  
  const openAdDialog = (ad?: AdBanner) => {
    if (ad) {
      setIsEditing(true);
      setCurrentAdFormData({
        ...ad,
        startDate: ad.startDate ? new Date(ad.startDate) : new Date(),
        endDate: ad.endDate ? new Date(ad.endDate) : undefined,
      });
    } else {
      setIsEditing(false);
      setCurrentAdFormData({
        ...initialAdFormData,
        startDate: new Date(), // Ensure new ads default to today for startDate
        endDate: undefined,
      });
    }
    setShowAdDialog(true);
  };

  const handleSaveAd = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const dataToSave: Omit<AdBanner, 'id' | 'createdAt' | 'updatedAt'> = {
      title: currentAdFormData.title || "Untitled Banner",
      description: currentAdFormData.description || "",
      imageUrl: currentAdFormData.imageUrl || "",
      linkUrl: currentAdFormData.linkUrl || "",
      isActive: currentAdFormData.isActive === undefined ? true : currentAdFormData.isActive,
      startDate: currentAdFormData.startDate ? new Date(currentAdFormData.startDate) : new Date(),
      endDate: currentAdFormData.endDate ? new Date(currentAdFormData.endDate) : undefined,
    };

    try {
      if (isEditing && currentAdFormData.id) {
        await updateAdBanner(currentAdFormData.id, dataToSave);
      } else {
        await createAdBanner(dataToSave);
      }
      setShowAdDialog(false);
    } catch (error) {
      console.error("Failed to save ad banner:", error);
      alert(`Error saving banner: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAd = (ad: AdBanner) => {
    setAdToDelete(ad);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteAd = async () => {
    if (adToDelete) {
      try {
        await deleteAdBanner(adToDelete.id);
      } catch (error) {
        console.error("Failed to delete ad banner:", error);
        alert("Failed to delete banner.");
      } finally {
        setShowDeleteConfirm(false);
        setAdToDelete(null);
      }
    }
  };
  
  // Restrict actions if not admin
  const isAdmin = currentUserRole === 'admin';

  return (
    <AdminRouteGuard>
      <div className="flex min-h-screen flex-col bg-gray-100 md:flex-row">
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
              <Link href="/admin/support" className="flex items-center rounded-md px-4 py-3 text-sm font-medium text-green-100 hover:bg-green-700"><Ticket className="mr-3 h-5 w-5" />Support Tickets</Link>
              <Link href="/admin/ads" className="flex items-center rounded-md bg-green-700 px-4 py-3 text-sm font-medium"><GalleryHorizontalEnd className="mr-3 h-5 w-5" />Ad Management</Link>
              <Link href="/admin/settings" className="flex items-center rounded-md px-4 py-3 text-sm font-medium text-green-100 hover:bg-green-700"><Settings className="mr-3 h-5 w-5" />Settings</Link>
            </nav>
            <div className="mt-auto border-t border-green-700 pt-4"><Button variant="ghost" className="flex w-full items-center justify-start" onClick={logout}><LogOut className="mr-3 h-5 w-5" />Logout</Button></div>
          </div>
        </div>

        <div className="flex-1 p-4 md:p-6">
          <header className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div><h1 className="text-3xl font-bold text-gray-900">Ad Banner Management</h1><p className="text-gray-600">Create, manage, and track advertising banners.</p></div>
            {isAdmin && (
              <Button className="bg-green-700 hover:bg-green-800" onClick={() => openAdDialog()}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Banner
              </Button>
            )}
          </header>

          <Card>
            <CardHeader>
              <CardTitle>Ad Banners</CardTitle>
              <CardDescription>List of all current and past ad banners.</CardDescription>
              <div className="mt-4 flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search by title or description..." className="pl-8" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as "all" | "active" | "inactive")}>
                  <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Filter by status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {bannersLoading && <div className="flex items-center justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-green-700" /><p className="ml-2">Loading banners...</p></div>}
              {!bannersLoading && bannersError && <div className="text-red-500 py-10 text-center"><AlertTriangle className="mx-auto h-8 w-8 mb-2" />Error: {bannersError}</div>}
              {!bannersLoading && !bannersError && filteredAdBanners.length === 0 && <div className="py-10 text-center"><p className="text-gray-500">No ad banners found matching your criteria.</p></div>}
              {!bannersLoading && !bannersError && filteredAdBanners.length > 0 && (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Image</TableHead><TableHead>Status</TableHead><TableHead>Start Date</TableHead><TableHead>End Date</TableHead><TableHead>Link</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {filteredAdBanners.map((banner) => (
                        <TableRow key={banner.id}>
                          <TableCell className="font-medium max-w-[200px] truncate">{banner.title}</TableCell>
                          <TableCell><Image src={banner.imageUrl || "/placeholder.svg"} alt={banner.title} width={100} height={50} className="object-cover rounded-sm" onError={(e) => (e.currentTarget.src = "/placeholder.svg?text=Error")} /></TableCell>
                          <TableCell><span className={`px-2 py-0.5 text-xs rounded-full ${banner.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>{banner.isActive ? "Active" : "Inactive"}</span></TableCell>
                          <TableCell>{formatDate(banner.startDate)}</TableCell>
                          <TableCell>{formatDate(banner.endDate)}</TableCell>
                          <TableCell><a href={banner.linkUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate max-w-[150px] inline-block">{banner.linkUrl || "N/A"}</a></TableCell>
                          <TableCell className="text-right">
                            {isAdmin && (
                              <>
                                <Button variant="ghost" size="icon" onClick={() => openAdDialog(banner)}><Edit2 size={16}/></Button>
                                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={() => handleDeleteAd(banner)}><Trash2 size={16}/></Button>
                              </>
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

      {/* Add/Edit Ad Dialog */}
      <Dialog open={showAdDialog} onOpenChange={setShowAdDialog}>
        <DialogContent className="sm:max-w-lg">
          <form onSubmit={handleSaveAd}>
            <DialogHeader><DialogTitle>{isEditing ? "Edit Ad Banner" : "Add New Ad Banner"}</DialogTitle><DialogDescription>{isEditing ? "Update the details of this ad banner." : "Create a new ad banner for display."}</DialogDescription></DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-1"><Label htmlFor="title">Title</Label><Input id="title" name="title" value={currentAdFormData.title || ""} onChange={handleInputChange} required /></div>
              <div className="space-y-1"><Label htmlFor="description">Description (Optional)</Label><Textarea id="description" name="description" value={currentAdFormData.description || ""} onChange={handleInputChange} /></div>
              <div className="space-y-1"><Label htmlFor="imageUrl">Image URL</Label><Input id="imageUrl" name="imageUrl" value={currentAdFormData.imageUrl || ""} onChange={handleInputChange} placeholder="https://example.com/image.png" required/></div>
              <div className="space-y-1"><Label htmlFor="linkUrl">Link URL (Optional)</Label><Input id="linkUrl" name="linkUrl" value={currentAdFormData.linkUrl || ""} onChange={handleInputChange} placeholder="https://example.com/target-page"/></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1"><Label htmlFor="startDate">Start Date</Label><Input id="startDate" name="startDate" type="date" value={formatDateForInput(currentAdFormData.startDate)} onChange={handleDateChange} required/></div>
                <div className="space-y-1"><Label htmlFor="endDate">End Date (Optional)</Label><Input id="endDate" name="endDate" type="date" value={formatDateForInput(currentAdFormData.endDate)} onChange={handleDateChange} /></div>
              </div>
              <div className="flex items-center space-x-2"><Switch id="isActive" checked={currentAdFormData.isActive} onCheckedChange={handleSwitchChange} /><Label htmlFor="isActive">Active</Label></div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAdDialog(false)} disabled={isSaving}>Cancel</Button>
              <Button type="submit" className="bg-green-700 hover:bg-green-800" disabled={isSaving}>
                {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save Banner"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      {adToDelete && (
        <ConfirmDialog
          open={showDeleteConfirm}
          onOpenChange={setShowDeleteConfirm}
          onConfirm={confirmDeleteAd}
          title={`Delete Ad Banner: ${adToDelete.title}`}
          description="Are you sure you want to delete this ad banner? This action cannot be undone."
          confirmText="Delete"
          variant="destructive"
        />
      )}
    </AdminRouteGuard>
  );
}
