import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-green-700 text-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Image
              src="/placeholder.svg?height=32&width=32"
              alt="Logo"
              width={32}
              height={32}
              className="rounded-md bg-white p-1"
            />
            <span className="text-xl font-bold">ApartmentPro</span>
          </div>
          <nav className="hidden md:flex md:items-center md:gap-6">
            <Link href="#features" className="text-sm font-medium hover:underline">
              Features
            </Link>
            <Link href="#about" className="text-sm font-medium hover:underline">
              About
            </Link>
            <Link href="#contact" className="text-sm font-medium hover:underline">
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-green-700">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="bg-gradient-to-b from-green-700 to-green-600 py-20 text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-6 text-4xl font-bold md:text-5xl lg:text-6xl">Apartment Management System</h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-green-100">
              A comprehensive solution for property managers to handle apartments, clients, payments, and more.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/admin/login">
                <Button className="bg-white text-green-700 hover:bg-green-100">
                  Admin Portal
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/client/login">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-green-700">
                  Client Portal
                </Button>
              </Link>
            </div>
          </div>
        </section>
        <section id="features" className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold text-green-700">Key Features</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border border-gray-200 p-6 shadow-sm">
                <div className="mb-4 inline-flex rounded-full bg-green-100 p-3 text-green-700">
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
                    <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                    <path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4" />
                    <path d="M12 14v3" />
                    <path d="M8 14v3" />
                    <path d="M16 14v3" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-bold text-green-700">Apartment Management</h3>
                <p className="text-gray-600">
                  Easily manage all your properties with color-coded availability status and detailed information.
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 p-6 shadow-sm">
                <div className="mb-4 inline-flex rounded-full bg-green-100 p-3 text-green-700">
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
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-bold text-green-700">Client Management</h3>
                <p className="text-gray-600">
                  Complete CRUD functionality for managing clients, their details, and communication.
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 p-6 shadow-sm">
                <div className="mb-4 inline-flex rounded-full bg-green-100 p-3 text-green-700">
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
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <line x1="2" x2="22" y1="10" y2="10" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-bold text-green-700">Payment Tracking</h3>
                <p className="text-gray-600">
                  Track installment plans, send invoices, and manage construction and finance accounts.
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 p-6 shadow-sm">
                <div className="mb-4 inline-flex rounded-full bg-green-100 p-3 text-green-700">
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
                    <path d="M3 3v18h18" />
                    <path d="m19 9-5 5-4-4-3 3" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-bold text-green-700">Analytics Dashboard</h3>
                <p className="text-gray-600">
                  Comprehensive analytics for profit/loss tracking on daily, weekly, and monthly basis.
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 p-6 shadow-sm">
                <div className="mb-4 inline-flex rounded-full bg-green-100 p-3 text-green-700">
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
                    <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2" />
                    <path d="M9 10h10a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2Z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-bold text-green-700">Email Notifications</h3>
                <p className="text-gray-600">
                  Automated email notifications for payment reminders, invoices, and important updates.
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 p-6 shadow-sm">
                <div className="mb-4 inline-flex rounded-full bg-green-100 p-3 text-green-700">
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
                    <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
                    <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
                    <line x1="6" x2="6" y1="2" y2="4" />
                    <line x1="10" x2="10" y1="2" y2="4" />
                    <line x1="14" x2="14" y1="2" y2="4" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-bold text-green-700">CRM Module</h3>
                <p className="text-gray-600">
                  Complete customer relationship management with customizable fields and tracking.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-green-800 py-8 text-white">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="mb-4 text-lg font-bold">ApartmentPro</h3>
              <p className="text-green-100">
                A comprehensive apartment management solution for property managers and clients.
              </p>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-bold">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/admin/login" className="text-green-100 hover:text-white hover:underline">
                    Admin Login
                  </Link>
                </li>
                <li>
                  <Link href="/client/login" className="text-green-100 hover:text-white hover:underline">
                    Client Login
                  </Link>
                </li>
                <li>
                  <Link href="#features" className="text-green-100 hover:text-white hover:underline">
                    Features
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-bold">Contact</h3>
              <address className="not-italic text-green-100">
                <p>Email: info@apartmentpro.com</p>
                <p>Phone: +1 (555) 123-4567</p>
              </address>
            </div>
          </div>
          <div className="mt-8 border-t border-green-700 pt-4 text-center text-sm text-green-100">
            <p>&copy; {new Date().getFullYear()} ApartmentPro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
