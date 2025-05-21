"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getClientById, getApartmentById, getBuildingById, getPaymentsByClient, formatCurrency } from "@/lib/data"
import type { Currency } from "@/lib/types"

interface ViewClientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clientId: string
  onEdit: () => void
  onDelete: () => void
  currency: Currency
}

export function ViewClientDialog({ open, onOpenChange, clientId, onEdit, onDelete, currency }: ViewClientDialogProps) {
  const client = getClientById(clientId)

  if (!client) {
    return null
  }

  const apartment = client.apartmentId ? getApartmentById(client.apartmentId) : null
  const building = apartment?.buildingId ? getBuildingById(apartment.buildingId) : null
  const payments = getPaymentsByClient(client.id)

  // Calculate total payments
  const totalPaid = payments.filter((p) => p.status === "paid").reduce((sum, payment) => sum + payment.amount, 0)

  const totalPending = payments.filter((p) => p.status === "pending").reduce((sum, payment) => sum + payment.amount, 0)

  const totalOverdue = payments.filter((p) => p.status === "overdue").reduce((sum, payment) => sum + payment.amount, 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Client Details</DialogTitle>
          <DialogDescription>View detailed information about this client.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="apartment">Apartment</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Name</p>
                <p className="text-lg">{client.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-lg">{client.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Phone</p>
                <p className="text-lg">{client.phone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Type</p>
                <p className="text-lg capitalize">{client.type}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <p className="inline-block rounded-full bg-green-100 px-2 py-1 text-sm font-medium text-green-700 capitalize">
                  {client.status}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Client Since</p>
                <p className="text-lg">{client.createdAt.toLocaleDateString()}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="apartment" className="space-y-4 pt-4">
            {apartment ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Building</p>
                  <p className="text-lg">{building?.name || "Unknown"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Apartment Number</p>
                  <p className="text-lg">{apartment.number}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Type</p>
                  <p className="text-lg">{apartment.type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Size</p>
                  <p className="text-lg">{apartment.size} sq ft</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Price</p>
                  <p className="text-lg">{formatCurrency(apartment.price, currency)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p className="inline-block rounded-full bg-green-100 px-2 py-1 text-sm font-medium text-green-700 capitalize">
                    {apartment.status}
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-md bg-yellow-50 p-4 text-yellow-700">No apartment assigned to this client.</div>
            )}
          </TabsContent>

          <TabsContent value="payments" className="space-y-4 pt-4">
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Paid</CardDescription>
                  <CardTitle>{formatCurrency(totalPaid, currency)}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Pending</CardDescription>
                  <CardTitle>{formatCurrency(totalPending, currency)}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Overdue</CardDescription>
                  <CardTitle className="text-red-600">{formatCurrency(totalOverdue, currency)}</CardTitle>
                </CardHeader>
              </Card>
            </div>

            {payments.length > 0 ? (
              <div className="mt-4 rounded-md border">
                <div className="grid grid-cols-4 border-b bg-muted p-2 text-sm font-medium">
                  <div>Date</div>
                  <div>Amount</div>
                  <div>Status</div>
                  <div>Method</div>
                </div>
                <div className="divide-y">
                  {payments.map((payment) => (
                    <div key={payment.id} className="grid grid-cols-4 p-2 text-sm">
                      <div>{payment.dueDate.toLocaleDateString()}</div>
                      <div>{formatCurrency(payment.amount, currency)}</div>
                      <div>
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
                      </div>
                      <div className="capitalize">{payment.method.replace("_", " ")}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-md bg-yellow-50 p-4 text-yellow-700">
                No payment records found for this client.
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={onEdit} className="bg-green-700 hover:bg-green-800">
            Edit Client
          </Button>
          <Button onClick={onDelete} variant="destructive">
            Delete Client
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
