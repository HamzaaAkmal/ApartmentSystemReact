"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Building, CreditCard, LayoutDashboard, LogOut, Menu, MessageSquare, Settings, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CurrencySelector } from "@/components/currency-selector"
import { AdBannerCarousel } from "@/components/ad-banner"
import { formatCurrency } from "@/lib/data"
import type { Currency } from "@/lib/types"

export default function ClientDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currency, setCurrency] = useState<Currency>("USD")

  // Mock client data
  const clientData = {
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    type: "investor",
    status: "active",
    apartment: {
      building: "Building A",
      number: "#102",
      floor: "1st Floor",
      size: "1,200 sq ft",
      bedrooms: 2,
      bathrooms: 2,
      price: 120000,
    },
    payment: {
      total: 120000,
      paid: 80000,
      remaining: 40000,
      nextPayment: {
        date: new Date("2023-06-15"),
        amount: 5000,
      },
      progress: 66.7,
    },
    notifications: [
      {
        id: "1",
        type: "payment",
        title: "Payment Confirmation",
        description: "Your payment of $5,000 was received on May 15, 2023",
        date: "5 days ago",
      },
      {
        id: "2",
        type: "maintenance",
        title: "Building Maintenance",
        description: "Scheduled maintenance for water pipes on June 5, 2023 from 10 AM to 2 PM",
        date: "2 days ago",
      },
      {
        id: "3",
        type: "payment",
        title: "Upcoming Payment Reminder",
        description: "Your next payment of $5,000 is due on June 15, 2023",
        date: "Yesterday",
      },
    ],
    paymentHistory: [
      {
        id: "1",
        date: new Date("2023-05-15"),
        amount: 5000,
        status: "completed",
        method: "Bank Transfer",
      },
      {
        id: "2",
        date: new Date("2023-04-15"),
        amount: 5000,
        status: "completed",
        method: "Bank Transfer",
      },
      {
        id: "3",
        date: new Date("2023-03-15"),
        amount: 5000,
        status: "completed",
        method: "Credit Card",
      },
      {
        id: "4",
        date: new Date("2023-02-15"),
        amount: 5000,
        status: "completed",
        method: "Bank Transfer",
      },
    ],
  }

  // Handle currency change
  const handleCurrencyChange = (newCurrency: Currency) => {
    setCurrency(newCurrency)
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      {/* Ad Banner */}
      <AdBannerCarousel />

      <div className="flex flex-1 flex-col md:flex-row">
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
                href="/client/dashboard"
                className="flex items-center rounded-md bg-green-700 px-4 py-3 text-sm font-medium"
              >
                <LayoutDashboard className="mr-3 h-5 w-5" />
                Dashboard
              </Link>
              <Link
                href="/client/apartment"
                className="flex items-center rounded-md px-4 py-3 text-sm font-medium text-green-100 hover:bg-green-700"
              >
                <Building className="mr-3 h-5 w-5" />
                My Apartment
              </Link>
              <Link
                href="/client/payments"
                className="flex items-center rounded-md px-4 py-3 text-sm font-medium text-green-100 hover:bg-green-700"
              >
                <CreditCard className="mr-3 h-5 w-5" />
                Payments
              </Link>
              <Link
                href="/client/support"
                className="flex items-center rounded-md px-4 py-3 text-sm font-medium text-green-100 hover:bg-green-700"
              >
                <MessageSquare className="mr-3 h-5 w-5" />
                Support
              </Link>
              <Link
                href="/client/settings"
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
          <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Client Dashboard</h1>
              <p className="text-gray-500">Welcome back, {clientData.name}</p>
            </div>
            <CurrencySelector defaultCurrency={currency} onCurrencyChange={handleCurrencyChange} />
          </header>

          <Tabs defaultValue="overview">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="apartment">My Apartment</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Apartment Details</CardTitle>
                    <CardDescription>Your apartment information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Building:</span>
                        <span>{clientData.apartment.building}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Apartment Number:</span>
                        <span>{clientData.apartment.number}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Floor:</span>
                        <span>{clientData.apartment.floor}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Size:</span>
                        <span>{clientData.apartment.size}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Bedrooms:</span>
                        <span>{clientData.apartment.bedrooms}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Bathrooms:</span>
                        <span>{clientData.apartment.bathrooms}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Payment Summary</CardTitle>
                    <CardDescription>Your payment progress</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Total Amount:</span>
                        <span>{formatCurrency(clientData.payment.total, currency)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Paid Amount:</span>
                        <span className="text-green-700">{formatCurrency(clientData.payment.paid, currency)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Remaining:</span>
                        <span>{formatCurrency(clientData.payment.remaining, currency)}</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Payment Progress</span>
                          <span className="text-sm font-medium">{clientData.payment.progress}%</span>
                        </div>
                        <Progress value={clientData.payment.progress} className="h-2 w-full" />
                      </div>
                      <div className="rounded-md bg-green-50 p-3 text-sm text-green-700">
                        <p className="font-medium">
                          Next Payment Due: {clientData.payment.nextPayment.date.toLocaleDateString()}
                        </p>
                        <p>Amount: {formatCurrency(clientData.payment.nextPayment.amount, currency)}</p>
                      </div>
                      <Button className="w-full bg-green-700 hover:bg-green-800">Make Payment</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Notifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {clientData.notifications.map((notification) => (
                      <div key={notification.id} className="flex items-start gap-4">
                        <div className="rounded-full bg-green-100 p-2 text-green-700">
                          {notification.type === "payment" ? (
                            <CreditCard className="h-4 w-4" />
                          ) : (
                            <Building className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{notification.title}</p>
                          <p className="text-sm text-gray-500">{notification.description}</p>
                          <p className="text-xs text-gray-400">{notification.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="apartment" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Apartment Details</CardTitle>
                  <CardDescription>Detailed information about your apartment</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <Image
                        src="/placeholder.svg?height=300&width=500"
                        alt="Apartment"
                        width={500}
                        height={300}
                        className="rounded-lg object-cover"
                      />
                      <div className="mt-4 grid grid-cols-3 gap-2">
                        <Image
                          src="/placeholder.svg?height=80&width=120"
                          alt="Apartment thumbnail"
                          width={120}
                          height={80}
                          className="rounded-md object-cover"
                        />
                        <Image
                          src="/placeholder.svg?height=80&width=120"
                          alt="Apartment thumbnail"
                          width={120}
                          height={80}
                          className="rounded-md object-cover"
                        />
                        <Image
                          src="/placeholder.svg?height=80&width=120"
                          alt="Apartment thumbnail"
                          width={120}
                          height={80}
                          className="rounded-md object-cover"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {clientData.apartment.building}, {clientData.apartment.number}
                        </h3>
                        <p className="text-gray-500">
                          {clientData.apartment.floor}, {clientData.apartment.size}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-lg bg-gray-50 p-3">
                          <p className="text-sm text-gray-500">Bedrooms</p>
                          <p className="text-lg font-medium">{clientData.apartment.bedrooms}</p>
                        </div>
                        <div className="rounded-lg bg-gray-50 p-3">
                          <p className="text-sm text-gray-500">Bathrooms</p>
                          <p className="text-lg font-medium">{clientData.apartment.bathrooms}</p>
                        </div>
                        <div className="rounded-lg bg-gray-50 p-3">
                          <p className="text-sm text-gray-500">Parking</p>
                          <p className="text-lg font-medium">1 Spot</p>
                        </div>
                        <div className="rounded-lg bg-gray-50 p-3">
                          <p className="text-sm text-gray-500">Balcony</p>
                          <p className="text-lg font-medium">Yes</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium">Features</h4>
                        <ul className="mt-2 list-inside list-disc space-y-1 text-gray-600">
                          <li>Modern kitchen with granite countertops</li>
                          <li>Hardwood flooring throughout</li>
                          <li>Central air conditioning</li>
                          <li>In-unit washer and dryer</li>
                          <li>Walk-in closet in master bedroom</li>
                        </ul>
                      </div>
                      <Button className="w-full bg-green-700 hover:bg-green-800">Request Maintenance</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Building Amenities</CardTitle>
                  <CardDescription>Amenities available in your building</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    <div className="rounded-lg border p-4">
                      <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700">
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
                          className="h-6 w-6"
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
                      <h3 className="font-medium">Swimming Pool</h3>
                      <p className="text-sm text-gray-500">Open daily from 7 AM to 10 PM</p>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700">
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
                          className="h-6 w-6"
                        >
                          <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                          <line x1="6" y1="1" x2="6" y2="4" />
                          <line x1="10" y1="1" x2="10" y2="4" />
                          <line x1="14" y1="1" x2="14" y2="4" />
                        </svg>
                      </div>
                      <h3 className="font-medium">Fitness Center</h3>
                      <p className="text-sm text-gray-500">24/7 access with keycard</p>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700">
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
                          className="h-6 w-6"
                        >
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <line x1="3" y1="9" x2="21" y2="9" />
                          <line x1="9" y1="21" x2="9" y2="9" />
                        </svg>
                      </div>
                      <h3 className="font-medium">Community Room</h3>
                      <p className="text-sm text-gray-500">Available for reservations</p>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700">
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
                          className="h-6 w-6"
                        >
                          <path d="M5 12h14" />
                          <path d="M12 5v14" />
                        </svg>
                      </div>
                      <h3 className="font-medium">24/7 Security</h3>
                      <p className="text-sm text-gray-500">On-site security personnel</p>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700">
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
                          className="h-6 w-6"
                        >
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                      </div>
                      <h3 className="font-medium">Landscaped Gardens</h3>
                      <p className="text-sm text-gray-500">Beautiful outdoor spaces</p>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700">
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
                          className="h-6 w-6"
                        >
                          <rect x="2" y="6" width="20" height="12" rx="2" />
                          <path d="M12 12h.01" />
                          <path d="M17 12h.01" />
                          <path d="M7 12h.01" />
                        </svg>
                      </div>
                      <h3 className="font-medium">Covered Parking</h3>
                      <p className="text-sm text-gray-500">Assigned parking spots</p>
                    </div>
                  </div\
