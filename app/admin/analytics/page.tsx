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
  Calendar,
  Download,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AnalyticsDashboard() {
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
              className="flex items-center rounded-md bg-green-700 px-4 py-3 text-sm font-medium"
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
            <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-500">Track performance and financial metrics</p>
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue="month">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-1">
              <Calendar className="h-4 w-4" />
              <span>Custom</span>
            </Button>
            <Button variant="outline" className="gap-1">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
          </div>
        </header>

        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="finance">Finance</TabsTrigger>
            <TabsTrigger value="occupancy">Occupancy</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Revenue</CardDescription>
                  <CardTitle className="text-4xl">$3.2M</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-green-600">+12% from last month</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Apartments Sold</CardDescription>
                  <CardTitle className="text-4xl">24</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-green-600">+4 from last month</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Occupancy Rate</CardDescription>
                  <CardTitle className="text-4xl">68%</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-green-600">+5% from last month</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>New Clients</CardDescription>
                  <CardTitle className="text-4xl">18</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-green-600">+3 from last month</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Breakdown</CardTitle>
                  <CardDescription>Revenue by building and apartment type</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center text-gray-500">
                      <BarChart3 className="mx-auto h-16 w-16 opacity-50" />
                      <p className="mt-2">Revenue chart visualization</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Sales Performance</CardTitle>
                  <CardDescription>Monthly sales performance</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center text-gray-500">
                      <BarChart3 className="mx-auto h-16 w-16 opacity-50" />
                      <p className="mt-2">Sales performance chart visualization</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Building Performance</CardTitle>
                <CardDescription>Performance metrics by building</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="px-4 py-2 font-medium">Building</th>
                        <th className="px-4 py-2 font-medium">Total Units</th>
                        <th className="px-4 py-2 font-medium">Sold</th>
                        <th className="px-4 py-2 font-medium">Available</th>
                        <th className="px-4 py-2 font-medium">Occupancy Rate</th>
                        <th className="px-4 py-2 font-medium">Revenue</th>
                        <th className="px-4 py-2 font-medium">Avg. Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="px-4 py-2">Building A</td>
                        <td className="px-4 py-2">12</td>
                        <td className="px-4 py-2">7</td>
                        <td className="px-4 py-2">5</td>
                        <td className="px-4 py-2">58.3%</td>
                        <td className="px-4 py-2">$840,000</td>
                        <td className="px-4 py-2">$120,000</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-2">Building B</td>
                        <td className="px-4 py-2">18</td>
                        <td className="px-4 py-2">8</td>
                        <td className="px-4 py-2">10</td>
                        <td className="px-4 py-2">44.4%</td>
                        <td className="px-4 py-2">$960,000</td>
                        <td className="px-4 py-2">$120,000</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-2">Building C</td>
                        <td className="px-4 py-2">24</td>
                        <td className="px-4 py-2">9</td>
                        <td className="px-4 py-2">15</td>
                        <td className="px-4 py-2">37.5%</td>
                        <td className="px-4 py-2">$1,400,000</td>
                        <td className="px-4 py-2">$155,556</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sales" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Sales</CardDescription>
                  <CardTitle className="text-4xl">$3.2M</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-green-600">+12% from last month</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Units Sold</CardDescription>
                  <CardTitle className="text-4xl">24</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-green-600">+4 from last month</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Avg. Sale Price</CardDescription>
                  <CardTitle className="text-4xl">$133k</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-green-600">+5% from last month</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Sales Conversion</CardDescription>
                  <CardTitle className="text-4xl">24%</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-green-600">+2% from last month</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Sales by Apartment Type</CardTitle>
                <CardDescription>Distribution of sales by apartment type</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <div className="flex h-full items-center justify-center">
                  <div className="text-center text-gray-500">
                    <BarChart3 className="mx-auto h-16 w-16 opacity-50" />
                    <p className="mt-2">Sales by apartment type chart visualization</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
                <CardDescription>Latest apartment sales</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="px-4 py-2 font-medium">Date</th>
                        <th className="px-4 py-2 font-medium">Building</th>
                        <th className="px-4 py-2 font-medium">Unit</th>
                        <th className="px-4 py-2 font-medium">Type</th>
                        <th className="px-4 py-2 font-medium">Client</th>
                        <th className="px-4 py-2 font-medium">Sale Price</th>
                        <th className="px-4 py-2 font-medium">Payment Method</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="px-4 py-2">May 15, 2023</td>
                        <td className="px-4 py-2">Building A</td>
                        <td className="px-4 py-2">#102</td>
                        <td className="px-4 py-2">2 Bedroom</td>
                        <td className="px-4 py-2">John Doe</td>
                        <td className="px-4 py-2">$120,000</td>
                        <td className="px-4 py-2">Installment</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-2">May 10, 2023</td>
                        <td className="px-4 py-2">Building B</td>
                        <td className="px-4 py-2">#203</td>
                        <td className="px-4 py-2">1 Bedroom</td>
                        <td className="px-4 py-2">Jane Smith</td>
                        <td className="px-4 py-2">$90,000</td>
                        <td className="px-4 py-2">Full Payment</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-2">May 5, 2023</td>
                        <td className="px-4 py-2">Building C</td>
                        <td className="px-4 py-2">#301</td>
                        <td className="px-4 py-2">3 Bedroom</td>
                        <td className="px-4 py-2">Robert Johnson</td>
                        <td className="px-4 py-2">$180,000</td>
                        <td className="px-4 py-2">Installment</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-2">May 1, 2023</td>
                        <td className="px-4 py-2">Building A</td>
                        <td className="px-4 py-2">#103</td>
                        <td className="px-4 py-2">2 Bedroom</td>
                        <td className="px-4 py-2">Emily Chen</td>
                        <td className="px-4 py-2">$125,000</td>
                        <td className="px-4 py-2">Installment</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="finance" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Revenue</CardDescription>
                  <CardTitle className="text-4xl">$3.2M</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-green-600">+12% from last month</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Construction Costs</CardDescription>
                  <CardTitle className="text-4xl">$1.8M</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-red-600">+8% from last month</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Operating Expenses</CardDescription>
                  <CardTitle className="text-4xl">$450k</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-red-600">+3% from last month</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Net Profit</CardDescription>
                  <CardTitle className="text-4xl">$950k</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-green-600">+15% from last month</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue vs Expenses</CardTitle>
                  <CardDescription>Monthly comparison of revenue and expenses</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center text-gray-500">
                      <BarChart3 className="mx-auto h-16 w-16 opacity-50" />
                      <p className="mt-2">Revenue vs expenses chart visualization</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Profit Margin</CardTitle>
                  <CardDescription>Monthly profit margin analysis</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center text-gray-500">
                      <BarChart3 className="mx-auto h-16 w-16 opacity-50" />
                      <p className="mt-2">Profit margin chart visualization</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Payment Status</CardTitle>
                <CardDescription>Status of client payments</CardDescription>
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
          </TabsContent>

          <TabsContent value="occupancy" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Overall Occupancy</CardDescription>
                  <CardTitle className="text-4xl">68%</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-green-600">+5% from last month</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Units</CardDescription>
                  <CardTitle className="text-4xl">54</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-gray-500">Across all buildings</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Sold Units</CardDescription>
                  <CardTitle className="text-4xl">24</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-green-600">+4 from last month</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Occupancy by Building</CardTitle>
                <CardDescription>Occupancy rates across different buildings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium">Building A (12 units)</span>
                      <span className="text-sm font-medium">58.3%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-200">
                      <div className="h-2 rounded-full bg-green-600" style={{ width: "58.3%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium">Building B (18 units)</span>
                      <span className="text-sm font-medium">44.4%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-200">
                      <div className="h-2 rounded-full bg-green-600" style={{ width: "44.4%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium">Building C (24 units)</span>
                      <span className="text-sm font-medium">37.5%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-200">
                      <div className="h-2 rounded-full bg-green-600" style={{ width: "37.5%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Occupancy by Apartment Type</CardTitle>
                <CardDescription>Occupancy rates by apartment type</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <div className="flex h-full items-center justify-center">
                  <div className="text-center text-gray-500">
                    <BarChart3 className="mx-auto h-16 w-16 opacity-50" />
                    <p className="mt-2">Occupancy by apartment type chart visualization</p>
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
