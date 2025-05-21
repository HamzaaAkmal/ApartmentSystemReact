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
  Search,
  Settings,
  Users,
  X,
  Edit,
  Trash2,
  UserPlus,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function UserManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showAddUserDialog, setShowAddUserDialog] = useState(false)

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
              className="flex items-center rounded-md bg-green-700 px-4 py-3 text-sm font-medium"
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
              className="flex items-center rounded-md px-4 py-3 text-sm font-medium text-green-100 hover:bg-green-700"
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
        <header className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-500">Manage admin and staff accounts</p>
          </div>
          <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
            <DialogTrigger asChild>
              <Button className="bg-green-700 hover:bg-green-800">
                <UserPlus className="mr-2 h-4 w-4" />
                Add New Admin
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Admin User</DialogTitle>
                <DialogDescription>
                  Create a new admin account. They will receive an email with login instructions.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input id="name" placeholder="Full name" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input id="email" type="email" placeholder="Email address" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Phone
                  </Label>
                  <Input id="phone" type="tel" placeholder="Phone number" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Role
                  </Label>
                  <Select defaultValue="admin">
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="permissions" className="text-right">
                    Permissions
                  </Label>
                  <Select defaultValue="full">
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select permissions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">Full Access</SelectItem>
                      <SelectItem value="limited">Limited Access</SelectItem>
                      <SelectItem value="readonly">Read Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddUserDialog(false)}>
                  Cancel
                </Button>
                <Button
                  className="bg-green-700 hover:bg-green-800"
                  onClick={() => {
                    // Handle user creation logic here
                    setShowAddUserDialog(false)
                  }}
                >
                  Create User
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </header>

        <Tabs defaultValue="admins">
          <TabsList className="mb-4">
            <TabsTrigger value="admins">Admins</TabsTrigger>
            <TabsTrigger value="managers">Managers</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
          </TabsList>

          <TabsContent value="admins" className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search admins..." className="pl-8" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Admin Users</CardTitle>
                <CardDescription>Manage users with administrative privileges</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="px-4 py-2 font-medium">Name</th>
                        <th className="px-4 py-2 font-medium">Email</th>
                        <th className="px-4 py-2 font-medium">Role</th>
                        <th className="px-4 py-2 font-medium">Permissions</th>
                        <th className="px-4 py-2 font-medium">Status</th>
                        <th className="px-4 py-2 font-medium">Last Login</th>
                        <th className="px-4 py-2 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="px-4 py-2">John Admin</td>
                        <td className="px-4 py-2">john.admin@example.com</td>
                        <td className="px-4 py-2">Super Admin</td>
                        <td className="px-4 py-2">Full Access</td>
                        <td className="px-4 py-2">
                          <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                            Active
                          </span>
                        </td>
                        <td className="px-4 py-2">Today, 10:30 AM</td>
                        <td className="px-4 py-2">
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit className="mr-1 h-3 w-3" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:bg-red-50 hover:text-red-700"
                            >
                              <Trash2 className="mr-1 h-3 w-3" />
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-2">Sarah Manager</td>
                        <td className="px-4 py-2">sarah.manager@example.com</td>
                        <td className="px-4 py-2">Admin</td>
                        <td className="px-4 py-2">Limited Access</td>
                        <td className="px-4 py-2">
                          <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                            Active
                          </span>
                        </td>
                        <td className="px-4 py-2">Yesterday, 3:45 PM</td>
                        <td className="px-4 py-2">
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit className="mr-1 h-3 w-3" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:bg-red-50 hover:text-red-700"
                            >
                              <Trash2 className="mr-1 h-3 w-3" />
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-2">Michael Admin</td>
                        <td className="px-4 py-2">michael.admin@example.com</td>
                        <td className="px-4 py-2">Admin</td>
                        <td className="px-4 py-2">Full Access</td>
                        <td className="px-4 py-2">
                          <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                            Inactive
                          </span>
                        </td>
                        <td className="px-4 py-2">2 weeks ago</td>
                        <td className="px-4 py-2">
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit className="mr-1 h-3 w-3" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:bg-red-50 hover:text-red-700"
                            >
                              <Trash2 className="mr-1 h-3 w-3" />
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="managers" className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search managers..." className="pl-8" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Manager Users</CardTitle>
                <CardDescription>Manage users with manager privileges</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="px-4 py-2 font-medium">Name</th>
                        <th className="px-4 py-2 font-medium">Email</th>
                        <th className="px-4 py-2 font-medium">Department</th>
                        <th className="px-4 py-2 font-medium">Permissions</th>
                        <th className="px-4 py-2 font-medium">Status</th>
                        <th className="px-4 py-2 font-medium">Last Login</th>
                        <th className="px-4 py-2 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="px-4 py-2">Robert Manager</td>
                        <td className="px-4 py-2">robert@example.com</td>
                        <td className="px-4 py-2">Sales</td>
                        <td className="px-4 py-2">Limited Access</td>
                        <td className="px-4 py-2">
                          <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                            Active
                          </span>
                        </td>
                        <td className="px-4 py-2">Today, 9:15 AM</td>
                        <td className="px-4 py-2">
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit className="mr-1 h-3 w-3" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:bg-red-50 hover:text-red-700"
                            >
                              <Trash2 className="mr-1 h-3 w-3" />
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-2">Lisa Manager</td>
                        <td className="px-4 py-2">lisa@example.com</td>
                        <td className="px-4 py-2">Finance</td>
                        <td className="px-4 py-2">Limited Access</td>
                        <td className="px-4 py-2">
                          <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                            Active
                          </span>
                        </td>
                        <td className="px-4 py-2">Yesterday, 2:30 PM</td>
                        <td className="px-4 py-2">
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit className="mr-1 h-3 w-3" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:bg-red-50 hover:text-red-700"
                            >
                              <Trash2 className="mr-1 h-3 w-3" />
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="staff" className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search staff..." className="pl-8" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Staff Users</CardTitle>
                <CardDescription>Manage users with staff privileges</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="px-4 py-2 font-medium">Name</th>
                        <th className="px-4 py-2 font-medium">Email</th>
                        <th className="px-4 py-2 font-medium">Department</th>
                        <th className="px-4 py-2 font-medium">Permissions</th>
                        <th className="px-4 py-2 font-medium">Status</th>
                        <th className="px-4 py-2 font-medium">Last Login</th>
                        <th className="px-4 py-2 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="px-4 py-2">James Staff</td>
                        <td className="px-4 py-2">james@example.com</td>
                        <td className="px-4 py-2">Support</td>
                        <td className="px-4 py-2">Read Only</td>
                        <td className="px-4 py-2">
                          <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                            Active
                          </span>
                        </td>
                        <td className="px-4 py-2">Today, 11:45 AM</td>
                        <td className="px-4 py-2">
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit className="mr-1 h-3 w-3" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:bg-red-50 hover:text-red-700"
                            >
                              <Trash2 className="mr-1 h-3 w-3" />
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-2">Emily Staff</td>
                        <td className="px-4 py-2">emily@example.com</td>
                        <td className="px-4 py-2">Maintenance</td>
                        <td className="px-4 py-2">Limited Access</td>
                        <td className="px-4 py-2">
                          <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                            Active
                          </span>
                        </td>
                        <td className="px-4 py-2">Yesterday, 4:20 PM</td>
                        <td className="px-4 py-2">
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit className="mr-1 h-3 w-3" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:bg-red-50 hover:text-red-700"
                            >
                              <Trash2 className="mr-1 h-3 w-3" />
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-2">David Staff</td>
                        <td className="px-4 py-2">david@example.com</td>
                        <td className="px-4 py-2">Customer Service</td>
                        <td className="px-4 py-2">Read Only</td>
                        <td className="px-4 py-2">
                          <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                            Inactive
                          </span>
                        </td>
                        <td className="px-4 py-2">1 month ago</td>
                        <td className="px-4 py-2">
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit className="mr-1 h-3 w-3" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:bg-red-50 hover:text-red-700"
                            >
                              <Trash2 className="mr-1 h-3 w-3" />
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
