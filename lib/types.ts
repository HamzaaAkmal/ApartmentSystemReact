// Client Types
export type ClientType = "investor" | "buyer" | "tenant"
export type ClientStatus = "active" | "pending" | "inactive"

export interface Client {
  id: string
  name: string
  email: string
  phone: string
  type: ClientType
  status: ClientStatus
  apartmentId?: string
  createdAt: Date
  updatedAt: Date
}

// Apartment Types
export type ApartmentStatus = "available" | "reserved" | "sold" | "maintenance"

export interface Apartment {
  id: string
  buildingId: string
  number: string
  floor: number
  type: string
  size: number
  price: number
  status: ApartmentStatus
  createdAt: Date
  updatedAt: Date
}

// Building Types
export type BuildingStatus = "active" | "construction" | "planned"

export interface Building {
  id: string
  name: string
  address: string
  floors: number
  units: number
  status: BuildingStatus
  createdAt: Date
  updatedAt: Date
}

// Payment Types
export type PaymentStatus = "paid" | "pending" | "overdue"
export type PaymentMethod = "bank_transfer" | "cash" | "check" | "credit_card"
export type Currency = "USD" | "PKR"

export interface Payment {
  id: string
  clientId: string
  apartmentId: string
  amount: number
  currency: Currency
  status: PaymentStatus
  method: PaymentMethod
  dueDate: Date
  paidDate?: Date
  createdAt: Date
  updatedAt: Date
}

// User Types
export type UserRole = "admin" | "manager" | "staff"
export type UserStatus = "active" | "inactive"

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: UserRole
  status: UserStatus
  permissions: string[]
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
}

// Lead Types
export type LeadStatus = "new" | "contacted" | "qualified" | "unqualified" | "converted"
export type LeadSource = "website" | "referral" | "social_media" | "property_portal" | "walk_in" | "other"

export interface Lead {
  id: string
  name: string
  email: string
  phone: string
  interest: string
  source: LeadSource
  status: LeadStatus
  notes?: string
  lastContact?: Date
  createdAt: Date
  updatedAt: Date
}

// Ad Banner Type
export interface AdBanner {
  id: string
  title: string
  description?: string
  imageUrl: string
  linkUrl?: string
  isActive: boolean
  startDate: Date
  endDate?: Date
  createdAt: Date
  updatedAt: Date
}

// Settings Type
export interface SystemSettings {
  id: string
  companyName: string
  companyEmail: string
  companyPhone: string
  companyAddress: string
  defaultCurrency: Currency
  language: string
  timezone: string
  dateFormat: string
  logoUrl?: string
  updatedAt: Date
}
