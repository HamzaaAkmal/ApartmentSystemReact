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
  Plus,
  Search,
  Settings,
  Users,
  X,
  Edit,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function ApartmentManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showAddBuildingDialog, setShowAddBuildingDialog] = useState(false)
  const [showAddApartmentDialog, setShowAddApartmentDialog] = useState(false)

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
              className="flex items-center rounded-md bg-green-700 px-4 py-3 text-sm font-medium"
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
            <h1 className="text-2xl font-bold text-gray-900">Apartment Management</h1>
            <p className="text-gray-500">Manage buildings and apartments</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Dialog open={showAddBuildingDialog} onOpenChange={setShowAddBuildingDialog}>
              <DialogTrigger asChild>
                <Button className="bg-green-700 hover:bg-green-800">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Building
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Building</DialogTitle>
                  <DialogDescription>Create a new building to add apartments to your inventory.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="building-name" className="text-right">
                      Name
                    </Label>
                    <Input id="building-name" placeholder="Building name" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="building-address" className="text-right">
                      Address
                    </Label>
                    <Input id="building-address" placeholder="Full address" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="building-floors" className="text-right">
                      Floors
                    </Label>
                    <Input id="building-floors" type="number" placeholder="Number of floors" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="building-units" className="text-right">
                      Units
                    </Label>
                    <Input id="building-units" type="number" placeholder="Total units" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="building-status" className="text-right">
                      Status
                    </Label>
                    <Select defaultValue="active">
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="construction">Under Construction</SelectItem>
                        <SelectItem value="planned">Planned</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAddBuildingDialog(false)}>
                    Cancel
                  </Button>
                  <Button
                    className="bg-green-700 hover:bg-green-800"
                    onClick={() => {
                      // Handle building creation logic here
                      setShowAddBuildingDialog(false)
                    }}
                  >
                    Create Building
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={showAddApartmentDialog} onOpenChange={setShowAddApartmentDialog}>
              <DialogTrigger asChild>
                <Button className="bg-green-700 hover:bg-green-800">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Apartment
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Apartment</DialogTitle>
                  <DialogDescription>Add a new apartment unit to an existing building.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="apartment-building" className="text-right">
                      Building
                    </Label>
                    <Select>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select building" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="building-a">Building A</SelectItem>
                        <SelectItem value="building-b">Building B</SelectItem>
                        <SelectItem value="building-c">Building C</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="apartment-number" className="text-right">
                      Number
                    </Label>
                    <Input id="apartment-number" placeholder="Apartment number" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="apartment-floor" className="text-right">
                      Floor
                    </Label>
                    <Input id="apartment-floor" type="number" placeholder="Floor number" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="apartment-type" className="text-right">
                      Type
                    </Label>
                    <Select>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="studio">Studio</SelectItem>
                        <SelectItem value="1br">1 Bedroom</SelectItem>
                        <SelectItem value="2br">2 Bedroom</SelectItem>
                        <SelectItem value="3br">3 Bedroom</SelectItem>
                        <SelectItem value="penthouse">Penthouse</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="apartment-size" className="text-right">
                      Size (sq ft)
                    </Label>
                    <Input id="apartment-size" type="number" placeholder="Size in square feet" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="apartment-price" className="text-right">
                      Price
                    </Label>
                    <Input id="apartment-price" type="number" placeholder="Price in USD" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="apartment-status" className="text-right">
                      Status
                    </Label>
                    <Select defaultValue="available">
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="reserved">Reserved</SelectItem>
                        <SelectItem value="sold">Sold</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAddApartmentDialog(false)}>
                    Cancel
                  </Button>
                  <Button
                    className="bg-green-700 hover:bg-green-800"
                    onClick={() => {
                      // Handle apartment creation logic here
                      setShowAddApartmentDialog(false)
                    }}
                  >
                    Create Apartment
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        <Tabs defaultValue="buildings">
          <TabsList className="mb-4">
            <TabsTrigger value="buildings">Buildings</TabsTrigger>
            <TabsTrigger value="apartments">Apartments</TabsTrigger>
            <TabsTrigger value="amenities">Amenities</TabsTrigger>
          </TabsList>

          <TabsContent value="buildings" className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search buildings..." className="pl-8" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="construction">Under Construction</SelectItem>
                  <SelectItem value="planned">Planned</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle>Building A</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                          >
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="12" cy="5" r="1" />
                            <circle cx="12" cy="19" r="1" />
                          </svg>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardDescription>123 Main Street, City</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Total Units:</span>
                      <span className="font-medium">12</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Available:</span>
                      <span className="font-medium text-green-700">5</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Sold:</span>
                      <span className="font-medium text-red-700">7</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Status:</span>
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                        Active
                      </span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button variant="outline" className="w-full">
                      View Apartments
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle>Building B</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                          >
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="12" cy="5" r="1" />
                            <circle cx="12" cy="19" r="1" />
                          </svg>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardDescription>456 Park Avenue, City</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Total Units:</span>
                      <span className="font-medium">18</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Available:</span>
                      <span className="font-medium text-green-700">10</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Sold:</span>
                      <span className="font-medium text-red-700">8</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Status:</span>
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                        Active
                      </span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button variant="outline" className="w-full">
                      View Apartments
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle>Building C</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                          >
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="12" cy="5" r="1" />
                            <circle cx="12" cy="19" r="1" />
                          </svg>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardDescription>789 Ocean Drive, City</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Total Units:</span>
                      <span className="font-medium">24</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Available:</span>
                      <span className="font-medium text-green-700">15</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Sold:</span>
                      <span className="font-medium text-red-700">9</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Status:</span>
                      <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700">
                        Under Construction
                      </span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button variant="outline" className="w-full">
                      View Apartments
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle>Building D</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                          >
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="12" cy="5" r="1" />
                            <circle cx="12" cy="19" r="1" />
                          </svg>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardDescription>321 Mountain View, City</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Total Units:</span>
                      <span className="font-medium">30</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Available:</span>
                      <span className="font-medium text-green-700">30</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Sold:</span>
                      <span className="font-medium text-red-700">0</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Status:</span>
                      <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                        Planned
                      </span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button variant="outline" className="w-full">
                      View Apartments
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="apartments" className="space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search apartments..." className="pl-8" />
              </div>
              <Select defaultValue="all-buildings">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by building" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-buildings">All Buildings</SelectItem>
                  <SelectItem value="building-a">Building A</SelectItem>
                  <SelectItem value="building-b">Building B</SelectItem>
                  <SelectItem value="building-c">Building C</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all-status">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-status">All Statuses</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="reserved">Reserved</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Apartment Inventory</CardTitle>
                <CardDescription>Manage all apartment units across buildings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="px-4 py-2 font-medium">Building</th>
                        <th className="px-4 py-2 font-medium">Unit #</th>
                        <th className="px-4 py-2 font-medium">Type</th>
                        <th className="px-4 py-2 font-medium">Size (sq ft)</th>
                        <th className="px-4 py-2 font-medium">Floor</th>
                        <th className="px-4 py-2 font-medium">Price</th>
                        <th className="px-4 py-2 font-medium">Status</th>
                        <th className="px-4 py-2 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="px-4 py-2">Building A</td>
                        <td className="px-4 py-2">#101</td>
                        <td className="px-4 py-2">2 Bedroom</td>
                        <td className="px-4 py-2">1,200</td>
                        <td className="px-4 py-2">1</td>
                        <td className="px-4 py-2">$120,000</td>
                        <td className="px-4 py-2">
                          <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                            Available
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit className="mr-1 h-3 w-3" />
                              Edit
                            </Button>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-2">Building A</td>
                        <td className="px-4 py-2">#102</td>
                        <td className="px-4 py-2">2 Bedroom</td>
                        <td className="px-4 py-2">1,200</td>
                        <td className="px-4 py-2">1</td>
                        <td className="px-4 py-2">$120,000</td>
                        <td className="px-4 py-2">
                          <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                            Sold
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit className="mr-1 h-3 w-3" />
                              Edit
                            </Button>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-2">Building B</td>
                        <td className="px-4 py-2">#201</td>
                        <td className="px-4 py-2">1 Bedroom</td>
                        <td className="px-4 py-2">850</td>
                        <td className="px-4 py-2">2</td>
                        <td className="px-4 py-2">$90,000</td>
                        <td className="px-4 py-2">
                          <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                            Available
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit className="mr-1 h-3 w-3" />
                              Edit
                            </Button>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-2">Building B</td>
                        <td className="px-4 py-2">#202</td>
                        <td className="px-4 py-2">3 Bedroom</td>
                        <td className="px-4 py-2">1,500</td>
                        <td className="px-4 py-2">2</td>
                        <td className="px-4 py-2">$150,000</td>
                        <td className="px-4 py-2">
                          <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700">
                            Reserved
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit className="mr-1 h-3 w-3" />
                              Edit
                            </Button>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-2">Building C</td>
                        <td className="px-4 py-2">#301</td>
                        <td className="px-4 py-2">Penthouse</td>
                        <td className="px-4 py-2">2,200</td>
                        <td className="px-4 py-2">10</td>
                        <td className="px-4 py-2">$350,000</td>
                        <td className="px-4 py-2">
                          <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                            Available
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit className="mr-1 h-3 w-3" />
                              Edit
                            </Button>
                            <Button variant="outline" size="sm">
                              View
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

          <TabsContent value="amenities" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Building Amenities</CardTitle>
                  <CardDescription>Manage amenities for each building</CardDescription>
                </div>
                <Button className="bg-green-700 hover:bg-green-800">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Amenity
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-3 text-lg font-medium">Building A</h3>
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                      <div className="rounded-lg border p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-700">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4"
                              >
                                <path d="M22 9h-5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h5" />
                                <path d="M10 13V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1Z" />
                                <path d="M10 17v4" />
                                <path d="M14 17v4" />
                                <path d="M18 17v4" />
                                <path d="M4 17v4" />
                                <path d="M22 13v4a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4v-4" />
                              </svg>
                            </div>
                            <h4 className="font-medium">Swimming Pool</h4>
                          </div>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <path d="M12 20h9" />
                              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                            </svg>
                            <span className="sr-only">Edit</span>
                          </Button>
                        </div>
                        <p className="text-sm text-gray-500">Open daily from 7 AM to 10 PM</p>
                      </div>
                      <div className="rounded-lg border p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-700">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4"
                              >
                                <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                                <line x1="6" y1="1" x2="6" y2="4" />
                                <line x1="10" y1="1" x2="10" y2="4" />
                                <line x1="14" y1="1" x2="14" y2="4" />
                              </svg>
                            </div>
                            <h4 className="font-medium">Fitness Center</h4>
                          </div>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <path d="M12 20h9" />
                              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                            </svg>
                            <span className="sr-only">Edit</span>
                          </Button>
                        </div>
                        <p className="text-sm text-gray-500">24/7 access with keycard</p>
                      </div>
                      <div className="rounded-lg border p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-700">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4"
                              >
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                <line x1="3" y1="9" x2="21" y2="9" />
                                <line x1="9" y1="21" x2="9" y2="9" />
                              </svg>
                            </div>
                            <h4 className="font-medium">Community Room</h4>
                          </div>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <path d="M12 20h9" />
                              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                            </svg>
                            <span className="sr-only">Edit</span>
                          </Button>
                        </div>
                        <p className="text-sm text-gray-500">Available for reservations</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-lg font-medium">Building B</h3>
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                      <div className="rounded-lg border p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-700">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4"
                              >
                                <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                                <line x1="6" y1="1" x2="6" y2="4" />
                                <line x1="10" y1="1" x2="10" y2="4" />
                                <line x1="14" y1="1" x2="14" y2="4" />
                              </svg>
                            </div>
                            <h4 className="font-medium">Fitness Center</h4>
                          </div>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <path d="M12 20h9" />
                              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                            </svg>
                            <span className="sr-only">Edit</span>
                          </Button>
                        </div>
                        <p className="text-sm text-gray-500">24/7 access with keycard</p>
                      </div>
                      <div className="rounded-lg border p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-700">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4"
                              >
                                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                <circle cx="12" cy="10" r="3" />
                              </svg>
                            </div>
                            <h4 className="font-medium">Landscaped Gardens</h4>
                          </div>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <path d="M12 20h9" />
                              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                            </svg>
                            <span className="sr-only">Edit</span>
                          </Button>
                        </div>
                        <p className="text-sm text-gray-500">Beautiful outdoor spaces</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
