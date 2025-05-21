import type { Client, Apartment, Building, Payment, User, Lead, AdBanner, SystemSettings } from "./types"

// Mock data for clients
export const clients: Client[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    type: "investor",
    status: "active",
    apartmentId: "102",
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-05-10"),
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+1 (555) 987-6543",
    type: "buyer",
    status: "active",
    apartmentId: "203",
    createdAt: new Date("2023-02-20"),
    updatedAt: new Date("2023-05-12"),
  },
  {
    id: "3",
    name: "Robert Johnson",
    email: "robert@example.com",
    phone: "+1 (555) 456-7890",
    type: "investor",
    status: "pending",
    apartmentId: "301",
    createdAt: new Date("2023-03-05"),
    updatedAt: new Date("2023-05-15"),
  },
  {
    id: "4",
    name: "Sarah Williams",
    email: "sarah@example.com",
    phone: "+1 (555) 234-5678",
    type: "buyer",
    status: "active",
    createdAt: new Date("2023-04-10"),
    updatedAt: new Date("2023-05-18"),
  },
  {
    id: "5",
    name: "Michael Brown",
    email: "michael@example.com",
    phone: "+1 (555) 876-5432",
    type: "tenant",
    status: "inactive",
    createdAt: new Date("2023-01-25"),
    updatedAt: new Date("2023-04-30"),
  },
]

// Mock data for buildings
export const buildings: Building[] = [
  {
    id: "A",
    name: "Building A",
    address: "123 Main Street, City",
    floors: 5,
    units: 12,
    status: "active",
    createdAt: new Date("2022-06-15"),
    updatedAt: new Date("2023-01-10"),
  },
  {
    id: "B",
    name: "Building B",
    address: "456 Park Avenue, City",
    floors: 8,
    units: 18,
    status: "active",
    createdAt: new Date("2022-08-20"),
    updatedAt: new Date("2023-02-15"),
  },
  {
    id: "C",
    name: "Building C",
    address: "789 Ocean Drive, City",
    floors: 10,
    units: 24,
    status: "construction",
    createdAt: new Date("2022-11-10"),
    updatedAt: new Date("2023-04-05"),
  },
  {
    id: "D",
    name: "Building D",
    address: "321 Mountain View, City",
    floors: 12,
    units: 30,
    status: "planned",
    createdAt: new Date("2023-03-01"),
    updatedAt: new Date("2023-05-01"),
  },
]

// Mock data for apartments
export const apartments: Apartment[] = [
  {
    id: "101",
    buildingId: "A",
    number: "#101",
    floor: 1,
    type: "2 Bedroom",
    size: 1200,
    price: 120000,
    status: "available",
    createdAt: new Date("2022-06-20"),
    updatedAt: new Date("2023-01-15"),
  },
  {
    id: "102",
    buildingId: "A",
    number: "#102",
    floor: 1,
    type: "2 Bedroom",
    size: 1200,
    price: 120000,
    status: "sold",
    createdAt: new Date("2022-06-20"),
    updatedAt: new Date("2023-02-10"),
  },
  {
    id: "103",
    buildingId: "A",
    number: "#103",
    floor: 1,
    type: "2 Bedroom",
    size: 1200,
    price: 125000,
    status: "sold",
    createdAt: new Date("2022-06-20"),
    updatedAt: new Date("2023-03-05"),
  },
  {
    id: "201",
    buildingId: "B",
    number: "#201",
    floor: 2,
    type: "1 Bedroom",
    size: 850,
    price: 90000,
    status: "available",
    createdAt: new Date("2022-08-25"),
    updatedAt: new Date("2023-02-20"),
  },
  {
    id: "202",
    buildingId: "B",
    number: "#202",
    floor: 2,
    type: "3 Bedroom",
    size: 1500,
    price: 150000,
    status: "available",
    createdAt: new Date("2022-08-25"),
    updatedAt: new Date("2023-02-20"),
  },
  {
    id: "203",
    buildingId: "B",
    number: "#203",
    floor: 2,
    type: "2 Bedroom",
    size: 1200,
    price: 120000,
    status: "sold",
    createdAt: new Date("2022-08-25"),
    updatedAt: new Date("2023-03-15"),
  },
  {
    id: "301",
    buildingId: "C",
    number: "#301",
    floor: 3,
    type: "Penthouse",
    size: 2200,
    price: 350000,
    status: "sold",
    createdAt: new Date("2022-11-15"),
    updatedAt: new Date("2023-04-10"),
  },
  {
    id: "302",
    buildingId: "C",
    number: "#302",
    floor: 3,
    type: "2 Bedroom",
    size: 1200,
    price: 130000,
    status: "sold",
    createdAt: new Date("2022-11-15"),
    updatedAt: new Date("2023-04-15"),
  },
  {
    id: "303",
    buildingId: "C",
    number: "#303",
    floor: 3,
    type: "3 Bedroom",
    size: 1600,
    price: 180000,
    status: "available",
    createdAt: new Date("2022-11-15"),
    updatedAt: new Date("2023-04-20"),
  },
]

// Mock data for payments
export const payments: Payment[] = [
  {
    id: "1",
    clientId: "1",
    apartmentId: "102",
    amount: 120000,
    currency: "USD",
    status: "paid",
    method: "bank_transfer",
    dueDate: new Date("2023-05-15"),
    paidDate: new Date("2023-05-14"),
    createdAt: new Date("2023-01-20"),
    updatedAt: new Date("2023-05-14"),
  },
  {
    id: "2",
    clientId: "2",
    apartmentId: "203",
    amount: 150000,
    currency: "USD",
    status: "pending",
    method: "bank_transfer",
    dueDate: new Date("2023-06-20"),
    createdAt: new Date("2023-02-25"),
    updatedAt: new Date("2023-05-15"),
  },
  {
    id: "3",
    clientId: "3",
    apartmentId: "301",
    amount: 180000,
    currency: "USD",
    status: "overdue",
    method: "bank_transfer",
    dueDate: new Date("2023-06-10"),
    createdAt: new Date("2023-03-10"),
    updatedAt: new Date("2023-06-11"),
  },
]

// Mock data for users
export const users: User[] = [
  {
    id: "1",
    name: "John Admin",
    email: "john.admin@example.com",
    phone: "+1 (555) 111-2222",
    role: "admin",
    status: "active",
    permissions: ["full_access"],
    lastLogin: new Date("2023-06-15T10:30:00"),
    createdAt: new Date("2022-01-01"),
    updatedAt: new Date("2023-05-15"),
  },
  {
    id: "2",
    name: "Sarah Manager",
    email: "sarah.manager@example.com",
    phone: "+1 (555) 333-4444",
    role: "manager",
    status: "active",
    permissions: ["limited_access"],
    lastLogin: new Date("2023-06-14T15:45:00"),
    createdAt: new Date("2022-03-15"),
    updatedAt: new Date("2023-05-10"),
  },
  {
    id: "3",
    name: "Michael Admin",
    email: "michael.admin@example.com",
    phone: "+1 (555) 555-6666",
    role: "admin",
    status: "inactive",
    permissions: ["full_access"],
    lastLogin: new Date("2023-06-01T09:15:00"),
    createdAt: new Date("2022-02-10"),
    updatedAt: new Date("2023-06-02"),
  },
]

// Mock data for leads
export const leads: Lead[] = [
  {
    id: "1",
    name: "Michael Brown",
    email: "michael@example.com",
    phone: "+1 (555) 123-7890",
    interest: "2BR Apartment",
    source: "website",
    status: "contacted",
    notes: "Interested in Building A apartments",
    lastContact: new Date("2023-06-13"),
    createdAt: new Date("2023-06-10"),
    updatedAt: new Date("2023-06-13"),
  },
  {
    id: "2",
    name: "Sarah Wilson",
    email: "sarah@example.com",
    phone: "+1 (555) 987-6543",
    interest: "1BR Apartment",
    source: "referral",
    status: "qualified",
    notes: "Looking for a unit with balcony",
    lastContact: new Date("2023-06-14"),
    createdAt: new Date("2023-06-12"),
    updatedAt: new Date("2023-06-14"),
  },
  {
    id: "3",
    name: "David Lee",
    email: "david@example.com",
    phone: "+1 (555) 456-7890",
    interest: "3BR Apartment",
    source: "property_portal",
    status: "new",
    notes: "Has a budget of $200,000",
    lastContact: new Date("2023-06-10"),
    createdAt: new Date("2023-06-10"),
    updatedAt: new Date("2023-06-10"),
  },
  {
    id: "4",
    name: "Emily Chen",
    email: "emily@example.com",
    phone: "+1 (555) 234-5678",
    interest: "2BR Apartment",
    source: "social_media",
    status: "unqualified",
    notes: "Budget too low for our offerings",
    lastContact: new Date("2023-06-08"),
    createdAt: new Date("2023-06-07"),
    updatedAt: new Date("2023-06-08"),
  },
]

// Mock data for ad banners
export const adBanners: AdBanner[] = [
  {
    id: "1",
    title: "Summer Special Offer",
    description: "Get 10% off on selected apartments this summer!",
    imageUrl: "/placeholder.svg?height=300&width=800",
    linkUrl: "/special-offers",
    isActive: true,
    startDate: new Date("2023-06-01"),
    endDate: new Date("2023-08-31"),
    createdAt: new Date("2023-05-15"),
    updatedAt: new Date("2023-05-15"),
  },
  {
    id: "2",
    title: "New Building Launch",
    description: "Introducing our newest luxury building with premium amenities",
    imageUrl: "/placeholder.svg?height=300&width=800",
    linkUrl: "/new-building",
    isActive: true,
    startDate: new Date("2023-06-15"),
    endDate: new Date("2023-09-15"),
    createdAt: new Date("2023-06-01"),
    updatedAt: new Date("2023-06-01"),
  },
  {
    id: "3",
    title: "Investor Special",
    description: "Special rates for bulk purchases",
    imageUrl: "/placeholder.svg?height=300&width=800",
    linkUrl: "/investor-program",
    isActive: false,
    startDate: new Date("2023-07-01"),
    endDate: new Date("2023-10-31"),
    createdAt: new Date("2023-06-10"),
    updatedAt: new Date("2023-06-10"),
  },
]

// Mock system settings
export const systemSettings: SystemSettings = {
  id: "1",
  companyName: "ApartmentPro Inc.",
  companyEmail: "info@apartmentpro.com",
  companyPhone: "+1 (555) 123-4567",
  companyAddress: "123 Business Street, Suite 100, City, State, 12345",
  defaultCurrency: "USD",
  language: "en",
  timezone: "utc",
  dateFormat: "mdy",
  logoUrl: "/placeholder.svg?height=80&width=80",
  updatedAt: new Date("2023-05-15"),
}

// Helper functions to simulate CRUD operations

// Get all items
export const getAllClients = () => clients
export const getAllApartments = () => apartments
export const getAllBuildings = () => buildings
export const getAllPayments = () => payments
export const getAllUsers = () => users
export const getAllLeads = () => leads
export const getAllAdBanners = () => adBanners
export const getSystemSettings = () => systemSettings

// Get item by ID
export const getClientById = (id: string) => clients.find((client) => client.id === id)
export const getApartmentById = (id: string) => apartments.find((apartment) => apartment.id === id)
export const getBuildingById = (id: string) => buildings.find((building) => building.id === id)
export const getPaymentById = (id: string) => payments.find((payment) => payment.id === id)
export const getUserById = (id: string) => users.find((user) => user.id === id)
export const getLeadById = (id: string) => leads.find((lead) => lead.id === id)
export const getAdBannerById = (id: string) => adBanners.find((banner) => banner.id === id)

// Get apartments by building
export const getApartmentsByBuilding = (buildingId: string) =>
  apartments.filter((apartment) => apartment.buildingId === buildingId)

// Get client by apartment
export const getClientByApartment = (apartmentId: string) =>
  clients.find((client) => client.apartmentId === apartmentId)

// Get payments by client
export const getPaymentsByClient = (clientId: string) => payments.filter((payment) => payment.clientId === clientId)

// Convert currency
export const convertCurrency = (amount: number, from: "USD" | "PKR", to: "USD" | "PKR") => {
  const rate = 285 // 1 USD = 285 PKR (example rate)

  if (from === "USD" && to === "PKR") {
    return amount * rate
  } else if (from === "PKR" && to === "USD") {
    return amount / rate
  }

  return amount // Same currency, no conversion needed
}

// Format currency
export const formatCurrency = (amount: number, currency: "USD" | "PKR") => {
  if (currency === "USD") {
    return `$${amount.toLocaleString()}`
  } else {
    return `PKR ${amount.toLocaleString()}`
  }
}
