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
  createdAt?: Date // Optional, will be Timestamp in Firestore
  updatedAt?: Date // Optional, will be Timestamp in Firestore
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
  createdAt?: Date // Optional, will be Timestamp in Firestore
  updatedAt?: Date // Optional, will be Timestamp in Firestore
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
  createdAt?: Date // Optional, will be Timestamp in Firestore
  updatedAt?: Date // Optional, will be Timestamp in Firestore
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
  createdAt?: Date // Optional, will be Timestamp in Firestore
  updatedAt?: Date // Optional, will be Timestamp in Firestore
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
  createdAt?: Date // Optional, will be Timestamp in Firestore
  updatedAt?: Date // Optional, will be Timestamp in Firestore
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
  createdAt?: Date // Optional, will be Timestamp in Firestore
  updatedAt?: Date // Optional, will be Timestamp in Firestore
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
  createdAt?: Date // Optional, will be Timestamp in Firestore
  updatedAt?: Date // Optional, will be Timestamp in Firestore
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
  
  // Notification Preferences
  enableEmailNotifications?: boolean;
  enableSmsNotifications?: boolean;
  enableBrowserNotifications?: boolean;

  // Email SMTP Configuration
  smtpHost?: string;
  smtpPort?: number;
  smtpUsername?: string;
  smtpPassword?: string; // Note: handle securely
  smtpEncryption?: "tls" | "ssl" | "none";
  useSmtpAuth?: boolean;

  // Security Settings
  minPasswordLength?: number;
  requireUppercasePassword?: boolean;
  requireNumbersInPassword?: boolean;
  requireSymbolsInPassword?: boolean;
  passwordExpiryDays?: number; // 0 for never
  enableTwoFactorAuth?: boolean;
  twoFactorAuthMethod?: "app" | "sms" | "email";
  sessionTimeoutMinutes?: number; // 0 for no timeout

  // Backup Settings
  enableAutoBackups?: boolean;
  backupFrequency?: "daily" | "weekly" | "monthly";
  backupRetentionDays?: number; // How long to keep backups

  updatedAt?: Date // Optional, will be Timestamp in Firestore
}

// Interaction Types
export type InteractionType = "note" | "call" | "email" | "meeting";

export interface Interaction {
  id: string; // Firestore document ID
  clientId: string; // ID of the client this interaction belongs to
  timestamp: Date; // Will be Firestore Timestamp
  type: InteractionType;
  content: string; // The actual note, summary of call/email/meeting
  userId?: string; // Optional: ID of the admin/user who logged the interaction
  createdAt?: Date; // Firestore Timestamp
  updatedAt?: Date; // Firestore Timestamp
}

// Task Types
export type TaskStatus = "pending" | "in_progress" | "completed" | "cancelled";
export type TaskPriority = "low" | "medium" | "high" | "urgent";

export interface Task {
  id: string; // Firestore document ID
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;       // Optional due date, will be Firestore Timestamp
  assignedTo?: string;  // Optional: User ID of the assignee
  leadId?: string;      // Optional: Link to a Lead
  clientId?: string;    // Optional: Link to a Client
  createdAt?: Date;     // Firestore Timestamp
  updatedAt?: Date;     // Firestore Timestamp
  completedAt?: Date;   // Optional: Firestore Timestamp, set when status becomes "completed"
}

// Finance System Types

export interface Account {
  id: string;                 // Firestore document ID (e.g., "construction_main", "client_revenue_usd")
  name: string;               // User-friendly account name (e.g., "Construction Main Fund", "Client Revenue (USD)")
  type: string;               // Account type identifier (e.g., "construction", "client_finance", "operational_expenses")
  balance: number;            // Current balance of the account
  currency: Currency;           // Currency of the account (using existing Currency type)
  createdAt?: Date;           // Firestore Timestamp
  updatedAt?: Date;           // Firestore Timestamp
}

// Support Ticket System Types
export type SupportTicketStatus = "open" | "in_progress" | "resolved" | "closed";

export interface SupportTicket {
  id: string;                // Firestore document ID
  clientId: string;          // ID of the Client who submitted the ticket
  firebaseUserId?: string;     // Optional: Firebase UID of the user who submitted, if different from clientId or for cross-referencing
  subject: string;
  message: string;
  status: SupportTicketStatus;
  submittedAt: Date;         // Firestore Timestamp
  lastUpdatedAt?: Date;       // Firestore Timestamp, when status or message updated
  resolvedAt?: Date;          // Firestore Timestamp, when status becomes "resolved"
  priority?: "low" | "medium" | "high"; // Optional priority
  category?: string;          // Optional: e.g., "technical", "billing", "maintenance"
}

export type TransactionType = "income" | "expense";

export interface FinancialTransaction {
  id: string;                 // Firestore document ID
  accountId: string;          // ID of the Account this transaction belongs to
  type: TransactionType;
  category: string;           // E.g., "materials", "labor", "client_payment", "office_rent"
  description: string;
  amount: number;             // Positive number, type (income/expense) determines effect on balance
  currency: Currency;           // Currency of the transaction
  transactionDate: Date;      // Date of the transaction, will be Firestore Timestamp
  relatedPaymentId?: string;   // Optional: Link to a Payment document if this transaction is from a client payment
  relatedInvoiceId?: string;   // Optional: Link to an invoice
  createdAt?: Date;           // Firestore Timestamp
  updatedAt?: Date;           // Firestore Timestamp
}
