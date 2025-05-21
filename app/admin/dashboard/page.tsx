"use client"

import { useState, useEffect } from "react"
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
  Eye,
  Edit,
  Trash2,
  Phone,
  Plus,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdBannerCarousel } from "@/components/ad-banner"
import { SearchBar } from "@/components/search-bar"
import { CurrencySelector } from "@/components/currency-selector"
import { ClientDialog } from "@/components/dialogs/client-dialog"
import { ApartmentDialog } from "@/components/dialogs/apartment-dialog"
import { PaymentDialog } from "@/components/dialogs/payment-dialog"
import { TransactionDialog } from "@/components/dialogs/transaction-dialog"
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog"
import { ViewClientDialog } from "@/components/dialogs/view-client-dialog"
import { ViewApartmentDialog } from "@/components/dialogs/view-apartment-dialog"
import { useCrud } from "@/lib/hooks/use-crud"
import { useAccounts } from "@/lib/hooks/use-accounts"
import {
  getAllBuildings,
  getAllApartments,
  getAllClients,
  getAllPayments,
  formatCurrency,
  systemSettings,
} from "@/lib/data"
import type { Client, Apartment, Payment, Currency } from "@/lib/types"

export default function AdminDashboard() {
  // State for UI
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currency, setCurrency] = useState<Currency>(systemSettings.defaultCurrency)
  const [searchQuery, setSearchQuery] = useState("")

  // CRUD hooks for data management
  const clientsCrud = useCrud<Client>(getAllClients())
  const apartmentsCrud = useCrud<Apartment>(getAllApartments())
  const paymentsCrud = useCrud<Payment>(getAllPayments())

  // Accounts management
  const accounts = useAccounts(
    {
      total: 2500000,
      used: 1750000,
      remaining: 750000,
      currency: currency,
    },
    {
      total: 3250000,
      used: 2300000,
      remaining: 950000,
      currency: currency,
    },
  )

  // Dialog states
  const [addClientDialogOpen, setAddClientDialogOpen] = useState(false)
  const [editClientDialogOpen, setEditClientDialogOpen] = useState(false)
  const [viewClientDialogOpen, setViewClientDialogOpen] = useState(false)
  const [deleteClientDialogOpen, setDeleteClientDialogOpen] = useState(false)
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)

  const [addApartmentDialogOpen, setAddApartmentDialogOpen] = useState(false)
  const [editApartmentDialogOpen, setEditApartmentDialogOpen] = useState(false)
  const [viewApartmentDialogOpen, setViewApartmentDialogOpen] = useState(false)
  const [deleteApartmentDialogOpen, setDeleteApartmentDialogOpen] = useState(false)
  const [selectedApartmentId, setSelectedApartmentId] = useState<string | null>(null)

  const [addPaymentDialogOpen, setAddPaymentDialogOpen] = useState(false)

  const [addConstructionTransactionDialogOpen, setAddConstructionTransactionDialogOpen] = useState(false)
  const [addFinanceTransactionDialogOpen, setAddFinanceTransactionDialogOpen] = useState(false)

  // Filtered data states
  const [filteredClients, setFilteredClients] = useState<Client[]>(clientsCrud.items)
  const [filteredApartments, setFilteredApartments] = useState<Apartment[]>(apartmentsCrud.items)
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>(paymentsCrud.items)

  // Update filtered data when source data changes
  useEffect(() => {
    handleSearch(searchQuery)
  }, [clientsCrud.items, apartmentsCrud.items, paymentsCrud.items])

  // Handle currency change
  const handleCurrencyChange = (newCurrency: Currency) => {
    setCurrency(newCurrency)
    accounts.changeCurrency(newCurrency)
  }

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query)

    if (query) {
      // Filter clients
      const clients = clientsCrud.filter(
        (client) =>
          client.name.toLowerCase().includes(query.toLowerCase()) ||
          client.email.toLowerCase().includes(query.toLowerCase()) ||
          client.phone.includes(query),
      )
      setFilteredClients(clients)

      // Filter apartments
      const apartments = apartmentsCrud.filter(
        (apt) =>
          apt.number.toLowerCase().includes(query.toLowerCase()) ||
          apt.type.toLowerCase().includes(query.toLowerCase()),
      )
      setFilteredApartments(apartments)

      // Filter payments
      const payments = paymentsCrud.filter((payment) => {
        const client = clientsCrud.getById(payment.clientId)
        return client?.name.toLowerCase().includes(query.toLowerCase()) || false
      })
      setFilteredPayments(payments)
    } else {
      // Reset to all data if query is empty
      setFilteredClients(clientsCrud.items)
      setFilteredApartments(apartmentsCrud.items)
      setFilteredPayments(paymentsCrud.items)
    }
  }

  // Client CRUD handlers
  const handleAddClient = (client: Omit<Client, "id" | "createdAt" | "updatedAt">) => {
    clientsCrud.create({
      ...client,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  const handleEditClient = (client: Omit<Client, "createdAt" | "updatedAt">) => {
    if (selectedClientId) {
      clientsCrud.update(selectedClientId, {
        ...client,
        updatedAt: new Date(),
      })
    }
  }

  const handleDeleteClient = () => {
    if (selectedClientId) {
      clientsCrud.remove(selectedClientId)
    }
  }

  // Apartment CRUD handlers
  const handleAddApartment = (apartment: Omit<Apartment, "id" | "createdAt" | "updatedAt">) => {
    apartmentsCrud.create({
      ...apartment,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  const handleEditApartment = (apartment: Omit<Apartment, "createdAt" | "updatedAt">) => {
    if (selectedApartmentId) {
      apartmentsCrud.update(selectedApartmentId, {
        ...apartment,
        updatedAt: new Date(),
      })
    }
  }

  const handleDeleteApartment = () => {
    if (selectedApartmentId) {
      apartmentsCrud.remove(selectedApartmentId)
    }
  }

  // Payment handlers
  const handleAddPayment = (payment: Omit<Payment, "id" | "createdAt" | "updatedAt">) => {
    const newPayment = paymentsCrud.create({
      ...payment,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // Update finance account if payment is paid
    if (payment.status === "paid") {
      accounts.addFinanceTransaction(
        payment.amount,
        `Payment received for apartment ${payment.apartmentId}`,
        "income",
        "payment",
        payment.currency,
      )
    }
  }

  // Transaction handlers
  const handleAddConstructionTransaction = (transaction: {
    amount: number
    description: string
    type: "income" | "expense"
    category: string
    currency: Currency
  }) => {
    accounts.addConstructionTransaction(
      transaction.amount,
      transaction.description,
      transaction.type,
      transaction.category,
      transaction.currency,
    )
  }

  const handleAddFinanceTransaction = (transaction: {
    amount: number
    description: string
    type: "income" | "expense"
    category: string
    currency: Currency
  }) => {
    accounts.addFinanceTransaction(
      transaction.amount,
      transaction.description,
      transaction.type,
      transaction.category,
      transaction.currency,
    )
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
                href="/admin/dashboard"
                className="flex items-center rounded-md bg-green-700 px-4 py-3 text-sm font-medium"
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
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-500">Welcome back, Admin</p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <SearchBar placeholder="Search clients, apartments..." onSearch={handleSearch} />
              <CurrencySelector defaultCurrency={currency} onCurrencyChange={handleCurrencyChange} />
            </div>
          </header>

          <Tabs defaultValue="overview">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="apartments">Apartments</TabsTrigger>
              <TabsTrigger value="clients">Clients</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Total Buildings</CardDescription>
                    <CardTitle className="text-4xl">{getAllBuildings().length}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-green-600">+2 from last month</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Available Apartments</CardDescription>
                    <CardTitle className="text-4xl">
                      {apartmentsCrud.filter((apt) => apt.status === "available").length}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-green-600">
                      {Math.round(
                        (apartmentsCrud.filter((apt) => apt.status !== "available").length /
                          apartmentsCrud.items.length) *
                          100,
                      )}
                      % occupancy rate
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Total Clients</CardDescription>
                    <CardTitle className="text-4xl">{clientsCrud.items.length}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-green-600">+7 new this month</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Monthly Revenue</CardDescription>
                    <CardTitle className="text-4xl">
                      {formatCurrency(accounts.financeAccount.total / 12, currency)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-green-600">+12% from last month</div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {accounts.getRecentTransactions(3).map((transaction, index) => (
                        <div key={index} className="flex items-start gap-4">
                          <div className="rounded-full bg-green-100 p-2 text-green-700">
                            {transaction.type === "income" ? (
                              <CreditCard className="h-4 w-4" />
                            ) : (
                              <Building className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">
                              {transaction.type === "income" ? "Payment Received" : "Expense"}
                            </p>
                            <p className="text-sm text-gray-500">{transaction.description}</p>
                            <p className="text-xs text-gray-400">{transaction.date.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Payment Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-sm font-medium">Paid</span>
                          <span className="text-sm font-medium">65%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-gray-200">
                          <div className="h-2 rounded-full bg-green-600" style={{ width: "65%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-sm font-medium">Pending</span>
                          <span className="text-sm font-medium">25%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-gray-200">
                          <div className="h-2 rounded-full bg-yellow-500" style={{ width: "25%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-sm font-medium">Overdue</span>
                          <span className="text-sm font-medium">10%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-gray-200">
                          <div className="h-2 rounded-full bg-red-500" style={{ width: "10%" }}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="apartments" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Apartment Status</CardTitle>
                    <CardDescription>Overview of all apartments and their current status</CardDescription>
                  </div>
                  <Button className="bg-green-700 hover:bg-green-800" onClick={() => setAddApartmentDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Apartment
                  </Button>
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
                          <th className="px-4 py-2 font-medium">Price</th>
                          <th className="px-4 py-2 font-medium">Status</th>
                          <th className="px-4 py-2 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredApartments.map((apartment) => {
                          const building = getAllBuildings().find((b) => b.id === apartment.buildingId)
                          return (
                            <tr key={apartment.id} className="border-b">
                              <td className="px-4 py-2">{building?.name || apartment.buildingId}</td>
                              <td className="px-4 py-2">{apartment.number}</td>
                              <td className="px-4 py-2">{apartment.type}</td>
                              <td className="px-4 py-2">{apartment.size}</td>
                              <td className="px-4 py-2">{formatCurrency(apartment.price, currency)}</td>
                              <td className="px-4 py-2">
                                <span
                                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                                    apartment.status === "available"
                                      ? "bg-green-100 text-green-700"
                                      : apartment.status === "reserved"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {apartment.status.charAt(0).toUpperCase() + apartment.status.slice(1)}
                                </span>
                              </td>
                              <td className="px-4 py-2">
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedApartmentId(apartment.id)
                                      setViewApartmentDialogOpen(true)
                                    }}
                                  >
                                    <Eye className="mr-1 h-3 w-3" />
                                    View
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedApartmentId(apartment.id)
                                      setEditApartmentDialogOpen(true)
                                    }}
                                  >
                                    <Edit className="mr-1 h-3 w-3" />
                                    Edit
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 hover:bg-red-50"
                                    onClick={() => {
                                      setSelectedApartmentId(apartment.id)
                                      setDeleteApartmentDialogOpen(true)
                                    }}
                                  >
                                    <Trash2 className="mr-1 h-3 w-3" />
                                    Delete
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="clients" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Client Management</CardTitle>
                    <CardDescription>Manage all your clients and their information</CardDescription>
                  </div>
                  <Button className="bg-green-700 hover:bg-green-800" onClick={() => setAddClientDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Client
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b text-left">
                          <th className="px-4 py-2 font-medium">Name</th>
                          <th className="px-4 py-2 font-medium">Email</th>
                          <th className="px-4 py-2 font-medium">Phone</th>
                          <th className="px-4 py-2 font-medium">Type</th>
                          <th className="px-4 py-2 font-medium">Status</th>
                          <th className="px-4 py-2 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredClients.map((client) => (
                          <tr key={client.id} className="border-b">
                            <td className="px-4 py-2">{client.name}</td>
                            <td className="px-4 py-2">{client.email}</td>
                            <td className="px-4 py-2">{client.phone}</td>
                            <td className="px-4 py-2">
                              <span className="capitalize">{client.type}</span>
                            </td>
                            <td className="px-4 py-2">
                              <span
                                className={`rounded-full px-2 py-1 text-xs font-medium ${
                                  client.status === "active"
                                    ? "bg-green-100 text-green-700"
                                    : client.status === "pending"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-4 py-2">
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedClientId(client.id)
                                    setViewClientDialogOpen(true)
                                  }}
                                >
                                  <Eye className="mr-1 h-3 w-3" />
                                  View
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedClientId(client.id)
                                    setEditClientDialogOpen(true)
                                  }}
                                >
                                  <Edit className="mr-1 h-3 w-3" />
                                  Edit
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-green-50 text-green-700"
                                  onClick={() => {
                                    window.open(`tel:${client.phone}`, "_self")
                                  }}
                                >
                                  <Phone className="mr-1 h-3 w-3" />
                                  Contact
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payments" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Construction Account</CardTitle>
                      <CardDescription>Financial overview of construction expenses</CardDescription>
                    </div>
                    <Button
                      className="bg-green-700 hover:bg-green-800"
                      onClick={() => setAddConstructionTransactionDialogOpen(true)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Transaction
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Total Budget</span>
                        <span className="font-semibold">
                          {formatCurrency(accounts.constructionAccount.total, currency)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Spent</span>
                        <span className="font-semibold">
                          {formatCurrency(accounts.constructionAccount.used, currency)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Remaining</span>
                        <span className="font-semibold text-green-700">
                          {formatCurrency(accounts.constructionAccount.remaining, currency)}
                        </span>
                      </div>
                      <div>
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-sm font-medium">Budget Usage</span>
                          <span className="text-sm font-medium">
                            {Math.round((accounts.constructionAccount.used / accounts.constructionAccount.total) * 100)}
                            %
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-gray-200">
                          <div
                            className="h-2 rounded-full bg-green-600"
                            style={{
                              width: `${Math.round((accounts.constructionAccount.used / accounts.constructionAccount.total) * 100)}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Client Finance Account</CardTitle>
                      <CardDescription>Overview of client payments and revenue</CardDescription>
                    </div>
                    <Button
                      className="bg-green-700 hover:bg-green-800"
                      onClick={() => setAddFinanceTransactionDialogOpen(true)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Transaction
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Total Revenue</span>
                        <span className="font-semibold">{formatCurrency(accounts.financeAccount.total, currency)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Pending Payments</span>
                        <span className="font-semibold">
                          {formatCurrency(
                            paymentsCrud.filter((p) => p.status === "pending").reduce((sum, p) => sum + p.amount, 0),
                            currency,
                          )}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Overdue Payments</span>
                        <span className="font-semibold text-red-700">
                          {formatCurrency(
                            paymentsCrud.filter((p) => p.status === "overdue").reduce((sum, p) => sum + p.amount, 0),
                            currency,
                          )}
                        </span>
                      </div>
                      <div>
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-sm font-medium">Collection Rate</span>
                          <span className="text-sm font-medium">82%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-gray-200">
                          <div className="h-2 rounded-full bg-green-600" style={{ width: "82%" }}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Installment Plans</CardTitle>
                    <CardDescription>Track client installment plans and payment schedules</CardDescription>
                  </div>
                  <Button className="bg-green-700 hover:bg-green-800" onClick={() => setAddPaymentDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Payment
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b text-left">
                          <th className="px-4 py-2 font-medium">Client</th>
                          <th className="px-4 py-2 font-medium">Apartment</th>
                          <th className="px-4 py-2 font-medium">Amount</th>
                          <th className="px-4 py-2 font-medium">Status</th>
                          <th className="px-4 py-2 font-medium">Due Date</th>
                          <th className="px-4 py-2 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPayments.map((payment) => {
                          const client = clientsCrud.getById(payment.clientId)
                          const apartment = apartmentsCrud.getById(payment.apartmentId)

                          return (
                            <tr key={payment.id} className="border-b">
                              <td className="px-4 py-2">{client?.name || "Unknown"}</td>
                              <td className="px-4 py-2">{apartment?.number || "Unknown"}</td>
                              <td className="px-4 py-2">{formatCurrency(payment.amount, currency)}</td>
                              <td className="px-4 py-2">
                                <span
                                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                                    payment.status === "paid"
                                      ? "bg-green-100 text-green-700"
                                      : payment.status === "pending"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                </span>
                              </td>
                              <td className="px-4 py-2">{payment.dueDate.toLocaleDateString()}</td>
                              <td className="px-4 py-2">
                                <div className="flex space-x-2">
                                  <Button variant="outline" size="sm">
                                    <Eye className="mr-1 h-3 w-3" />
                                    View
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className={
                                      payment.status === "overdue"
                                        ? "bg-red-50 text-red-700 hover:bg-red-100"
                                        : "bg-green-50 text-green-700 hover:bg-green-100"
                                    }
                                    onClick={() => {
                                      if (payment.status === "pending" || payment.status === "overdue") {
                                        // Mark as paid
                                        paymentsCrud.update(payment.id, {
                                          status: "paid",
                                          paidDate: new Date(),
                                          updatedAt: new Date(),
                                        })

                                        // Add to finance account
                                        accounts.addFinanceTransaction(
                                          payment.amount,
                                          `Payment received for apartment ${payment.apartmentId}`,
                                          "income",
                                          "payment",
                                          payment.currency,
                                        )
                                      }
                                    }}
                                  >
                                    {payment.status === "overdue" ? "Mark Paid" : "Send Invoice"}
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Dialogs */}
      <ClientDialog
        open={addClientDialogOpen}
        onOpenChange={setAddClientDialogOpen}
        onSave={handleAddClient}
        title="Add New Client"
        description="Add a new client to the system."
      />

      <ClientDialog
        open={editClientDialogOpen}
        onOpenChange={setEditClientDialogOpen}
        onSave={handleEditClient}
        client={selectedClientId ? clientsCrud.getById(selectedClientId) : undefined}
        title="Edit Client"
        description="Update client information."
      />

      <ViewClientDialog
        open={viewClientDialogOpen}
        onOpenChange={setViewClientDialogOpen}
        clientId={selectedClientId || ""}
        onEdit={() => {
          setViewClientDialogOpen(false)
          setEditClientDialogOpen(true)
        }}
        onDelete={() => {
          setViewClientDialogOpen(false)
          setDeleteClientDialogOpen(true)
        }}
        currency={currency}
      />

      <ConfirmDialog
        open={deleteClientDialogOpen}
        onOpenChange={setDeleteClientDialogOpen}
        onConfirm={handleDeleteClient}
        title="Delete Client"
        description="Are you sure you want to delete this client? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
      />

      <ApartmentDialog
        open={addApartmentDialogOpen}
        onOpenChange={setAddApartmentDialogOpen}
        onSave={handleAddApartment}
        title="Add New Apartment"
        description="Add a new apartment to the system."
      />

      <ApartmentDialog
        open={editApartmentDialogOpen}
        onOpenChange={setEditApartmentDialogOpen}
        onSave={handleEditApartment}
        apartment={selectedApartmentId ? apartmentsCrud.getById(selectedApartmentId) : undefined}
        title="Edit Apartment"
        description="Update apartment information."
      />

      <ViewApartmentDialog
        open={viewApartmentDialogOpen}
        onOpenChange={setViewApartmentDialogOpen}
        apartmentId={selectedApartmentId || ""}
        onEdit={() => {
          setViewApartmentDialogOpen(false)
          setEditApartmentDialogOpen(true)
        }}
        onDelete={() => {
          setViewApartmentDialogOpen(false)
          setDeleteApartmentDialogOpen(true)
        }}
        currency={currency}
      />

      <ConfirmDialog
        open={deleteApartmentDialogOpen}
        onOpenChange={setDeleteApartmentDialogOpen}
        onConfirm={handleDeleteApartment}
        title="Delete Apartment"
        description="Are you sure you want to delete this apartment? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
      />

      <PaymentDialog
        open={addPaymentDialogOpen}
        onOpenChange={setAddPaymentDialogOpen}
        onSave={handleAddPayment}
        title="Add New Payment"
        description="Record a new payment in the system."
      />

      <TransactionDialog
        open={addConstructionTransactionDialogOpen}
        onOpenChange={setAddConstructionTransactionDialogOpen}
        onSave={handleAddConstructionTransaction}
        title="Add Construction Transaction"
        description="Record a new transaction for the construction account."
        accountType="construction"
      />

      <TransactionDialog
        open={addFinanceTransactionDialogOpen}
        onOpenChange={setAddFinanceTransactionDialogOpen}
        onSave={handleAddFinanceTransaction}
        title="Add Finance Transaction"
        description="Record a new transaction for the finance account."
        accountType="finance"
      />
    </div>
  )
}
