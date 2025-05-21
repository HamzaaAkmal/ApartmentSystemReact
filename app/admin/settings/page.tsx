"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  BarChart3,
  Building,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  Users,
  X,
  Save,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SettingsDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 md:flex-row">
      {/* Mobile sidebar toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-4 z-50 md:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-green-800 p-4 text-white transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="mb-8 flex items-center gap-2 px-2">
            <Image
              src="/placeholder.svg?height=40&width=40"
              alt="Logo"
              width={40}
              height={40}
              className="rounded-md bg-white p-1"
            />
            <span className="text-xl font-bold">ApartmentPro</span>
          </div>

          <nav className="flex-1 space-y-1">
            <Link
              href="/admin/dashboard"
              className="flex items-center rounded-md px-4 py-3 text-sm font-medium text-green-100 hover:bg-green-700"
            >
              <LayoutDashboard className="mr-3 h-5 w-5" />
              Dashboard
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center rounded-md px-4 py-3 text-sm font-medium text-green-100 hover:bg-green-700"
            >
              <Users className="mr-3 h-5 w-5" />
              User Management
            </Link>
            <Link
              href="/admin/clients"
              className="flex items-center rounded-md px-4 py-3 text-sm font-medium text-green-100 hover:bg-green-700"
            >
              <Users className="mr-3 h-5 w-5" />
              Client Management
            </Link>
            <Link
              href="/admin/apartments"
              className="flex items-center rounded-md px-4 py-3 text-sm font-medium text-green-100 hover:bg-green-700"
            >
              <Building className="mr-3 h-5 w-5" />
              Apartments
            </Link>
            <Link
              href="/admin/payments"
              className="flex items-center rounded-md px-4 py-3 text-sm font-medium text-green-100 hover:bg-green-700"
            >
              <CreditCard className="mr-3 h-5 w-5" />
              Payments
            </Link>
            <Link
              href="/admin/crm"
              className="flex items-center rounded-md px-4 py-3 text-sm font-medium text-green-100 hover:bg-green-700"
            >
              <MessageSquare className="mr-3 h-5 w-5" />
              CRM
            </Link>
            <Link
              href="/admin/analytics"
              className="flex items-center rounded-md px-4 py-3 text-sm font-medium text-green-100 hover:bg-green-700"
            >
              <BarChart3 className="mr-3 h-5 w-5" />
              Analytics
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center rounded-md bg-green-700 px-4 py-3 text-sm font-medium"
            >
              <Settings className="mr-3 h-5 w-5" />
              Settings
            </Link>
          </nav>

          <div className="mt-auto border-t border-green-700 pt-4">
            <Link
              href="/"
              className="flex items-center rounded-md px-4 py-3 text-sm font-medium text-green-100 hover:bg-green-700"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 md:p-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500">Manage system settings and preferences</p>
        </header>

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
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Manage general system settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">System Preferences</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select defaultValue="en">
                        <SelectTrigger id="language">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                          <SelectItem value="ar">Arabic</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select defaultValue="utc">
                        <SelectTrigger id="timezone">
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="utc">UTC (GMT+0)</SelectItem>
                          <SelectItem value="est">Eastern Time (GMT-5)</SelectItem>
                          <SelectItem value="cst">Central Time (GMT-6)</SelectItem>
                          <SelectItem value="mst">Mountain Time (GMT-7)</SelectItem>
                          <SelectItem value="pst">Pacific Time (GMT-8)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date-format">Date Format</Label>
                      <Select defaultValue="mdy">
                        <SelectTrigger id="date-format">
                          <SelectValue placeholder="Select date format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                          <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                          <SelectItem value="ymd">YYYY/MM/DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select defaultValue="usd">
                        <SelectTrigger id="currency">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="usd">USD ($)</SelectItem>
                          <SelectItem value="eur">EUR (€)</SelectItem>
                          <SelectItem value="gbp">GBP (£)</SelectItem>
                          <SelectItem value="jpy">JPY (¥)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-notifications" className="block">
                          Email Notifications
                        </Label>
                        <p className="text-sm text-gray-500">Receive email notifications for important events</p>
                      </div>
                      <Switch id="email-notifications" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="sms-notifications" className="block">
                          SMS Notifications
                        </Label>
                        <p className="text-sm text-gray-500">Receive SMS notifications for critical alerts</p>
                      </div>
                      <Switch id="sms-notifications" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="browser-notifications" className="block">
                          Browser Notifications
                        </Label>
                        <p className="text-sm text-gray-500">Receive browser notifications when logged in</p>
                      </div>
                      <Switch id="browser-notifications" defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="bg-green-700 hover:bg-green-800">
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="company" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>Manage your company details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input id="company-name" placeholder="Your company name" defaultValue="ApartmentPro Inc." />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="company-email">Email</Label>
                      <Input
                        id="company-email"
                        type="email"
                        placeholder="company@example.com"
                        defaultValue="info@apartmentpro.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company-phone">Phone</Label>
                      <Input
                        id="company-phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        defaultValue="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-address">Address</Label>
                    <Textarea
                      id="company-address"
                      placeholder="Company address"
                      defaultValue="123 Business Street, Suite 100, City, State, 12345"
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="company-city">City</Label>
                      <Input id="company-city" placeholder="City" defaultValue="New York" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company-state">State/Province</Label>
                      <Input id="company-state" placeholder="State/Province" defaultValue="NY" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company-zip">ZIP/Postal Code</Label>
                      <Input id="company-zip" placeholder="ZIP/Postal Code" defaultValue="10001" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-country">Country</Label>
                    <Select defaultValue="us">
                      <SelectTrigger id="company-country">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="au">Australia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Company Logo</h3>
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-20 overflow-hidden rounded-md border bg-white p-1">
                      <Image
                        src="/placeholder.svg?height=80&width=80"
                        alt="Company logo"
                        width={80}
                        height={80}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div>
                      <Button variant="outline" size="sm" className="mb-2">
                        Upload New Logo
                      </Button>
                      <p className="text-xs text-gray-500">Recommended size: 200x200px. Max file size: 2MB.</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="bg-green-700 hover:bg-green-800">
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Email Settings</CardTitle>
                <CardDescription>Configure email settings and templates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">SMTP Configuration</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="smtp-host">SMTP Host</Label>
                      <Input id="smtp-host" placeholder="smtp.example.com" defaultValue="smtp.gmail.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtp-port">SMTP Port</Label>
                      <Input id="smtp-port" placeholder="587" defaultValue="587" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtp-username">SMTP Username</Label>
                      <Input
                        id="smtp-username"
                        placeholder="username@example.com"
                        defaultValue="notifications@apartmentpro.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtp-password">SMTP Password</Label>
                      <Input id="smtp-password" type="password" placeholder="••••••••" defaultValue="password" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-encryption">Encryption</Label>
                    <Select defaultValue="tls">
                      <SelectTrigger id="smtp-encryption">
                        <SelectValue placeholder="Select encryption" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tls">TLS</SelectItem>
                        <SelectItem value="ssl">SSL</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="smtp-auth" className="block">
                        Use SMTP Authentication
                      </Label>
                      <p className="text-sm text-gray-500">Enable SMTP authentication for sending emails</p>
                    </div>
                    <Switch id="smtp-auth" defaultChecked />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Email Templates</h3>
                  <div className="space-y-4">
                    <div className="rounded-md border p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="font-medium">Payment Reminder</h4>
                        <Button variant="outline" size="sm">
                          Edit Template
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500">Sent to clients when a payment is due</p>
                    </div>
                    <div className="rounded-md border p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="font-medium">Welcome Email</h4>
                        <Button variant="outline" size="sm">
                          Edit Template
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500">Sent to new clients when they register</p>
                    </div>
                    <div className="rounded-md border p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="font-medium">Invoice</h4>
                        <Button variant="outline" size="sm">
                          Edit Template
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500">Sent to clients with payment invoices</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button variant="outline" className="mr-2">
                    Test Email
                  </Button>
                  <Button className="bg-green-700 hover:bg-green-800">
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Configure security and authentication settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Password Policy</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="min-password-length" className="block">
                          Minimum Password Length
                        </Label>
                        <p className="text-sm text-gray-500">Minimum number of characters required</p>
                      </div>
                      <Select defaultValue="8">
                        <SelectTrigger id="min-password-length" className="w-20">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="6">6</SelectItem>
                          <SelectItem value="8">8</SelectItem>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="12">12</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="require-uppercase" className="block">
                          Require Uppercase
                        </Label>
                        <p className="text-sm text-gray-500">Require at least one uppercase letter</p>
                      </div>
                      <Switch id="require-uppercase" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="require-numbers" className="block">
                          Require Numbers
                        </Label>
                        <p className="text-sm text-gray-500">Require at least one number</p>
                      </div>
                      <Switch id="require-numbers" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="require-symbols" className="block">
                          Require Symbols
                        </Label>
                        <p className="text-sm text-gray-500">Require at least one special character</p>
                      </div>
                      <Switch id="require-symbols" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="password-expiry" className="block">
                          Password Expiry
                        </Label>
                        <p className="text-sm text-gray-500">Force password change after specified days</p>
                      </div>
                      <Select defaultValue="90">
                        <SelectTrigger id="password-expiry" className="w-24">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="never">Never</SelectItem>
                          <SelectItem value="30">30 days</SelectItem>
                          <SelectItem value="60">60 days</SelectItem>
                          <SelectItem value="90">90 days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="enable-2fa" className="block">
                          Enable Two-Factor Authentication
                        </Label>
                        <p className="text-sm text-gray-500">Require 2FA for all admin users</p>
                      </div>
                      <Switch id="enable-2fa" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="2fa-method" className="block">
                          2FA Method
                        </Label>
                        <p className="text-sm text-gray-500">Select the preferred 2FA method</p>
                      </div>
                      <Select defaultValue="app">
                        <SelectTrigger id="2fa-method" className="w-40">
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="app">Authenticator App</SelectItem>
                          <SelectItem value="sms">SMS</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Session Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="session-timeout" className="block">
                          Session Timeout
                        </Label>
                        <p className="text-sm text-gray-500">Automatically log out after inactivity</p>
                      </div>
                      <Select defaultValue="30">
                        <SelectTrigger id="session-timeout" className="w-32">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="120">2 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="bg-green-700 hover:bg-green-800">
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="backup" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Backup & Export</CardTitle>
                <CardDescription>Manage system backups and data exports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Automated Backups</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="enable-backups" className="block">
                          Enable Automated Backups
                        </Label>
                        <p className="text-sm text-gray-500">Automatically backup system data</p>
                      </div>
                      <Switch id="enable-backups" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="backup-frequency" className="block">
                          Backup Frequency
                        </Label>
                        <p className="text-sm text-gray-500">How often to create backups</p>
                      </div>
                      <Select defaultValue="daily">
                        <SelectTrigger id="backup-frequency" className="w-32">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="backup-retention" className="block">
                          Backup Retention
                        </Label>
                        <p className="text-sm text-gray-500">How long to keep backups</p>
                      </div>
                      <Select defaultValue="30">
                        <SelectTrigger id="backup-retention" className="w-32">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7">7 days</SelectItem>
                          <SelectItem value="30">30 days</SelectItem>
                          <SelectItem value="90">90 days</SelectItem>
                          <SelectItem value="365">1 year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Manual Backup</h3>
                  <div className="rounded-md border p-4">
                    <p className="mb-4 text-sm text-gray-500">Create a manual backup of all system data</p>
                    <Button className="bg-green-700 hover:bg-green-800">Create Backup Now</Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Data Export</h3>
                  <div className="space-y-4">
                    <div className="rounded-md border p-4">
                      <h4 className="mb-2 font-medium">Client Data</h4>
                      <p className="mb-4 text-sm text-gray-500">Export all client information</p>
                      <div className="flex gap-2">
                        <Button variant="outline">Export as CSV</Button>
                        <Button variant="outline">Export as Excel</Button>
                      </div>
                    </div>
                    <div className="rounded-md border p-4">
                      <h4 className="mb-2 font-medium">Apartment Data</h4>
                      <p className="mb-4 text-sm text-gray-500">Export all apartment information</p>
                      <div className="flex gap-2">
                        <Button variant="outline">Export as CSV</Button>
                        <Button variant="outline">Export as Excel</Button>
                      </div>
                    </div>
                    <div className="rounded-md border p-4">
                      <h4 className="mb-2 font-medium">Financial Data</h4>
                      <p className="mb-4 text-sm text-gray-500">Export all financial records</p>
                      <div className="flex gap-2">
                        <Button variant="outline">Export as CSV</Button>
                        <Button variant="outline">Export as Excel</Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="bg-green-700 hover:bg-green-800">
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
