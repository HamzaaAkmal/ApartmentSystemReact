"use client"

import { useState, useEffect, useCallback, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";

// Custom Hooks
import { useAuth } from "../../../context/AuthContext"; // For logout, if needed by sidebar
import { useSystemSettings } from "@/lib/hooks/use-system-settings";

// Types
import type { SystemSettings, Currency } from "@/lib/types";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AdminRouteGuard from '../../components/auth/AdminRouteGuard'; 
import { Loader2, AlertTriangle, Menu, X, Save, LayoutDashboard, Users, Building, CreditCard, MessageSquare, BarChart3, Settings as SettingsIcon, LogOut, Briefcase } from "lucide-react";


// Default settings values (align with fromFirestore defaults in the hook if possible)
const defaultSettingsData: Partial<SystemSettings> = {
  companyName: "ApartmentPro Inc.",
  companyEmail: "info@apartmentpro.com",
  companyPhone: "+1 (555) 123-4567",
  companyAddress: "123 Business Street, Suite 100, City, State, 12345",
  defaultCurrency: "USD",
  language: "en",
  timezone: "UTC",
  dateFormat: "MM/DD/YYYY",
  logoUrl: "",
  enableEmailNotifications: true,
  enableSmsNotifications: false,
  enableBrowserNotifications: true,
  smtpHost: "",
  smtpPort: 587,
  smtpUsername: "",
  smtpPassword: "",
  smtpEncryption: "tls",
  useSmtpAuth: false,
  minPasswordLength: 8,
  requireUppercasePassword: true,
  requireNumbersInPassword: true,
  requireSymbolsInPassword: true,
  passwordExpiryDays: 0,
  enableTwoFactorAuth: false,
  twoFactorAuthMethod: "app",
  sessionTimeoutMinutes: 30,
  enableAutoBackups: true,
  backupFrequency: "daily",
  backupRetentionDays: 30,
};


export default function SettingsDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth(); // For sidebar
  const { settings, loading: settingsLoading, error: settingsError, updateSettings } = useSystemSettings();
  
  const [formData, setFormData] = useState<Partial<SystemSettings>>(defaultSettingsData);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{type: "success" | "error", text: string} | null>(null);

  useEffect(() => {
    if (settings) {
      // Merge fetched settings with defaults to ensure all fields are present in formData
      const mergedSettings = { ...defaultSettingsData, ...settings };
      setFormData(mergedSettings);
    } else if (!settingsLoading && !settingsError) {
      // If settings are explicitly null (not just loading) and no error, use defaults
      // This can happen if the settings document doesn't exist in Firestore yet
      setFormData(defaultSettingsData);
    }
  }, [settings, settingsLoading, settingsError]);

  const handleChange = (field: keyof SystemSettings, value: any) => {
    setSaveMessage(null); // Clear save message on new change
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSwitchChange = (field: keyof SystemSettings, checked: boolean) => {
    setSaveMessage(null);
    setFormData(prev => ({ ...prev, [field]: checked }));
  };

  const handleSaveChanges = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage(null);
    try {
      // Ensure numeric fields are numbers
      const dataToSave = {
        ...formData,
        smtpPort: formData.smtpPort ? Number(formData.smtpPort) : undefined,
        minPasswordLength: formData.minPasswordLength ? Number(formData.minPasswordLength) : undefined,
        passwordExpiryDays: formData.passwordExpiryDays ? Number(formData.passwordExpiryDays) : undefined,
        sessionTimeoutMinutes: formData.sessionTimeoutMinutes ? Number(formData.sessionTimeoutMinutes) : undefined,
        backupRetentionDays: formData.backupRetentionDays ? Number(formData.backupRetentionDays) : undefined,
      };
      await updateSettings(dataToSave);
      setSaveMessage({type: "success", text: "Settings saved successfully!"});
    } catch (error: any) {
      console.error("Failed to save settings:", error);
      setSaveMessage({type: "error", text: `Failed to save settings: ${error.message || "Unknown error"}`});
    } finally {
      setIsSaving(false);
    }
  };

  if (settingsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-green-700" />
        <p className="ml-3 text-lg">Loading Settings...</p>
      </div>
    );
  }


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
              <Link href="/admin/settings" className="flex items-center rounded-md bg-green-700 px-4 py-3 text-sm font-medium"><SettingsIcon className="mr-3 h-5 w-5" />Settings</Link>
            </nav>
            <div className="mt-auto border-t border-green-700 pt-4"><Button variant="ghost" className="flex w-full items-center justify-start" onClick={logout}><LogOut className="mr-3 h-5 w-5" />Logout</Button></div>
          </div>
        </div>

        <div className="flex-1 p-4 md:p-6">
          <header className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-500">Manage system settings and preferences</p>
          </header>

          {settingsError && (
            <Card className="mb-6 border-red-500 bg-red-50">
              <CardHeader><CardTitle className="text-red-700 flex items-center"><AlertTriangle className="mr-2"/>Error Loading Settings</CardTitle></CardHeader>
              <CardContent><p className="text-red-600">{settingsError}</p><p className="text-sm text-gray-600 mt-2">Default values will be used. Any changes you make will attempt to create the settings document.</p></CardContent>
            </Card>
          )}
          
          {saveMessage && (
            <div className={`mb-4 p-3 rounded-md text-sm ${saveMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {saveMessage.text}
            </div>
          )}

          <form onSubmit={handleSaveChanges}>
            <Tabs defaultValue="general">
              <TabsList className="mb-4">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="company">Company</TabsTrigger>
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="backup">Backup & Export</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-4">
                <Card>
                  <CardHeader><CardTitle>General Settings</CardTitle><CardDescription>Manage general system settings</CardDescription></CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">System Preferences</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2"><Label htmlFor="language">Language</Label><Select value={formData.language || "en"} onValueChange={(v) => handleChange("language", v)}><SelectTrigger id="language"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="en">English</SelectItem><SelectItem value="es">Spanish</SelectItem></SelectContent></Select></div>
                        <div className="space-y-2"><Label htmlFor="timezone">Timezone</Label><Select value={formData.timezone || "UTC"} onValueChange={(v) => handleChange("timezone", v)}><SelectTrigger id="timezone"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="UTC">UTC</SelectItem><SelectItem value="EST">EST</SelectItem></SelectContent></Select></div>
                        <div className="space-y-2"><Label htmlFor="date-format">Date Format</Label><Select value={formData.dateFormat || "MM/DD/YYYY"} onValueChange={(v) => handleChange("dateFormat", v)}><SelectTrigger id="date-format"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem><SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem></SelectContent></Select></div>
                        <div className="space-y-2"><Label htmlFor="currency">Default Currency</Label><Select value={formData.defaultCurrency || "USD"} onValueChange={(v) => handleChange("defaultCurrency", v as Currency)}><SelectTrigger id="currency"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="USD">USD ($)</SelectItem><SelectItem value="PKR">PKR (Rs)</SelectItem></SelectContent></Select></div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Notifications</h3>
                      <div className="flex items-center justify-between"><Label htmlFor="enableEmailNotifications" className="flex flex-col"><span className="font-medium">Email Notifications</span><span className="text-xs text-gray-500">Receive email for important events.</span></Label><Switch id="enableEmailNotifications" checked={formData.enableEmailNotifications || false} onCheckedChange={(c) => handleSwitchChange("enableEmailNotifications", c)} /></div>
                      <div className="flex items-center justify-between"><Label htmlFor="enableSmsNotifications" className="flex flex-col"><span className="font-medium">SMS Notifications</span><span className="text-xs text-gray-500">Receive SMS for critical alerts.</span></Label><Switch id="enableSmsNotifications" checked={formData.enableSmsNotifications || false} onCheckedChange={(c) => handleSwitchChange("enableSmsNotifications", c)} /></div>
                      <div className="flex items-center justify-between"><Label htmlFor="enableBrowserNotifications" className="flex flex-col"><span className="font-medium">Browser Notifications</span><span className="text-xs text-gray-500">Receive notifications in browser.</span></Label><Switch id="enableBrowserNotifications" checked={formData.enableBrowserNotifications || false} onCheckedChange={(c) => handleSwitchChange("enableBrowserNotifications", c)} /></div>
                    </div>
                    <div className="flex justify-end"><Button type="submit" className="bg-green-700 hover:bg-green-800" disabled={isSaving}>{isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Save className="mr-2 h-4 w-4" />} Save General</Button></div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="company" className="space-y-4">
                <Card>
                  <CardHeader><CardTitle>Company Information</CardTitle><CardDescription>Manage your company details</CardDescription></CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2"><Label htmlFor="company-name">Company Name</Label><Input id="company-name" value={formData.companyName || ""} onChange={(e) => handleChange("companyName", e.target.value)} /></div>
                    <div className="grid gap-4 md:grid-cols-2"><div className="space-y-2"><Label htmlFor="company-email">Email</Label><Input id="company-email" type="email" value={formData.companyEmail || ""} onChange={(e) => handleChange("companyEmail", e.target.value)} /></div><div className="space-y-2"><Label htmlFor="company-phone">Phone</Label><Input id="company-phone" type="tel" value={formData.companyPhone || ""} onChange={(e) => handleChange("companyPhone", e.target.value)} /></div></div>
                    <div className="space-y-2"><Label htmlFor="company-address">Address</Label><Textarea id="company-address" value={formData.companyAddress || ""} onChange={(e) => handleChange("companyAddress", e.target.value)} /></div>
                    <div className="space-y-2"><Label htmlFor="logoUrl">Logo URL (Optional)</Label><Input id="logoUrl" value={formData.logoUrl || ""} onChange={(e) => handleChange("logoUrl", e.target.value)} placeholder="https://example.com/logo.png"/></div>
                    <div className="flex justify-end"><Button type="submit" className="bg-green-700 hover:bg-green-800" disabled={isSaving}>{isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Save className="mr-2 h-4 w-4" />} Save Company Info</Button></div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="email" className="space-y-4">
                <Card>
                  <CardHeader><CardTitle>Email Settings</CardTitle><CardDescription>Configure SMTP settings for outgoing emails.</CardDescription></CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2"><Label htmlFor="smtpHost">SMTP Host</Label><Input id="smtpHost" value={formData.smtpHost || ""} onChange={(e) => handleChange("smtpHost", e.target.value)} /></div>
                        <div className="space-y-2"><Label htmlFor="smtpPort">SMTP Port</Label><Input id="smtpPort" type="number" value={formData.smtpPort || ""} onChange={(e) => handleChange("smtpPort", Number(e.target.value))} /></div>
                        <div className="space-y-2"><Label htmlFor="smtpUsername">SMTP Username</Label><Input id="smtpUsername" value={formData.smtpUsername || ""} onChange={(e) => handleChange("smtpUsername", e.target.value)} /></div>
                        <div className="space-y-2"><Label htmlFor="smtpPassword">SMTP Password</Label><Input id="smtpPassword" type="password" value={formData.smtpPassword || ""} onChange={(e) => handleChange("smtpPassword", e.target.value)} /></div>
                    </div>
                    <div className="space-y-2"><Label htmlFor="smtpEncryption">Encryption</Label><Select value={formData.smtpEncryption || "none"} onValueChange={(v) => handleChange("smtpEncryption", v as "tls"|"ssl"|"none")}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="tls">TLS</SelectItem><SelectItem value="ssl">SSL</SelectItem><SelectItem value="none">None</SelectItem></SelectContent></Select></div>
                    <div className="flex items-center justify-between"><Label htmlFor="useSmtpAuth" className="flex flex-col"><span className="font-medium">Use SMTP Authentication</span></Label><Switch id="useSmtpAuth" checked={formData.useSmtpAuth || false} onCheckedChange={(c) => handleSwitchChange("useSmtpAuth", c)} /></div>
                    <div className="flex justify-end"><Button type="submit" className="bg-green-700 hover:bg-green-800" disabled={isSaving}>{isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Save className="mr-2 h-4 w-4" />} Save Email Settings</Button></div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-4">
                <Card>
                  <CardHeader><CardTitle>Security Settings</CardTitle><CardDescription>Manage password policies and multi-factor authentication.</CardDescription></CardHeader>
                  <CardContent className="space-y-6">
                     <div className="space-y-2"><Label htmlFor="minPasswordLength">Minimum Password Length</Label><Input id="minPasswordLength" type="number" value={formData.minPasswordLength || 8} onChange={(e) => handleChange("minPasswordLength", Number(e.target.value))} /></div>
                     <div className="flex items-center justify-between"><Label htmlFor="requireUppercasePassword">Require Uppercase</Label><Switch id="requireUppercasePassword" checked={formData.requireUppercasePassword || false} onCheckedChange={(c) => handleSwitchChange("requireUppercasePassword", c)} /></div>
                     <div className="flex items-center justify-between"><Label htmlFor="requireNumbersInPassword">Require Numbers</Label><Switch id="requireNumbersInPassword" checked={formData.requireNumbersInPassword || false} onCheckedChange={(c) => handleSwitchChange("requireNumbersInPassword", c)} /></div>
                     <div className="flex items-center justify-between"><Label htmlFor="requireSymbolsInPassword">Require Symbols</Label><Switch id="requireSymbolsInPassword" checked={formData.requireSymbolsInPassword || false} onCheckedChange={(c) => handleSwitchChange("requireSymbolsInPassword", c)} /></div>
                     <div className="space-y-2"><Label htmlFor="passwordExpiryDays">Password Expiry Days (0 for never)</Label><Input id="passwordExpiryDays" type="number" value={formData.passwordExpiryDays || 0} onChange={(e) => handleChange("passwordExpiryDays", Number(e.target.value))} /></div>
                     <div className="flex items-center justify-between"><Label htmlFor="enableTwoFactorAuth">Enable 2FA</Label><Switch id="enableTwoFactorAuth" checked={formData.enableTwoFactorAuth || false} onCheckedChange={(c) => handleSwitchChange("enableTwoFactorAuth", c)} /></div>
                     {formData.enableTwoFactorAuth && <div className="space-y-2"><Label htmlFor="twoFactorAuthMethod">2FA Method</Label><Select value={formData.twoFactorAuthMethod || "app"} onValueChange={(v) => handleChange("twoFactorAuthMethod", v as "app"|"sms"|"email")}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="app">Authenticator App</SelectItem><SelectItem value="sms">SMS</SelectItem><SelectItem value="email">Email</SelectItem></SelectContent></Select></div>}
                     <div className="space-y-2"><Label htmlFor="sessionTimeoutMinutes">Session Timeout (minutes, 0 for no timeout)</Label><Input id="sessionTimeoutMinutes" type="number" value={formData.sessionTimeoutMinutes || 30} onChange={(e) => handleChange("sessionTimeoutMinutes", Number(e.target.value))} /></div>
                    <div className="flex justify-end"><Button type="submit" className="bg-green-700 hover:bg-green-800" disabled={isSaving}>{isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Save className="mr-2 h-4 w-4" />} Save Security Settings</Button></div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="backup" className="space-y-4">
                <Card>
                  <CardHeader><CardTitle>Backup & Export</CardTitle><CardDescription>Manage data backup and retention policies.</CardDescription></CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between"><Label htmlFor="enableAutoBackups">Enable Automated Backups</Label><Switch id="enableAutoBackups" checked={formData.enableAutoBackups || false} onCheckedChange={(c) => handleSwitchChange("enableAutoBackups", c)} /></div>
                    {formData.enableAutoBackups && <>
                        <div className="space-y-2"><Label htmlFor="backupFrequency">Backup Frequency</Label><Select value={formData.backupFrequency || "daily"} onValueChange={(v) => handleChange("backupFrequency", v as "daily"|"weekly"|"monthly")}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="daily">Daily</SelectItem><SelectItem value="weekly">Weekly</SelectItem><SelectItem value="monthly">Monthly</SelectItem></SelectContent></Select></div>
                        <div className="space-y-2"><Label htmlFor="backupRetentionDays">Backup Retention (days)</Label><Input id="backupRetentionDays" type="number" value={formData.backupRetentionDays || 30} onChange={(e) => handleChange("backupRetentionDays", Number(e.target.value))} /></div>
                    </>}
                    <div className="flex justify-end"><Button type="submit" className="bg-green-700 hover:bg-green-800" disabled={isSaving}>{isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Save className="mr-2 h-4 w-4" />} Save Backup Settings</Button></div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </form>
        </div>
      </div>
    </AdminRouteGuard>
  );
}
