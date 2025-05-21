"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CurrencySelector } from "@/components/currency-selector"
import type { Payment, PaymentStatus, PaymentMethod, Currency } from "@/lib/types"
import { getAllClients, getAllApartments } from "@/lib/data"

interface PaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (payment: Omit<Payment, "id" | "createdAt" | "updatedAt">) => void
  payment?: Payment
  title?: string
  description?: string
}

export function PaymentDialog({
  open,
  onOpenChange,
  onSave,
  payment,
  title = "Add New Payment",
  description = "Record a new payment in the system.",
}: PaymentDialogProps) {
  const [formData, setFormData] = useState<{
    clientId: string
    apartmentId: string
    amount: number
    currency: Currency
    status: PaymentStatus
    method: PaymentMethod
    dueDate: string
    paidDate?: string
    notes?: string
  }>({
    clientId: "",
    apartmentId: "",
    amount: 0,
    currency: "USD",
    status: "pending",
    method: "bank_transfer",
    dueDate: new Date().toISOString().split("T")[0],
    paidDate: "",
    notes: "",
  })

  // Reset form when dialog opens/closes or payment changes
  useEffect(() => {
    if (open && payment) {
      setFormData({
        clientId: payment.clientId,
        apartmentId: payment.apartmentId,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        method: payment.method,
        dueDate: payment.dueDate.toISOString().split("T")[0],
        paidDate: payment.paidDate ? payment.paidDate.toISOString().split("T")[0] : "",
        notes: "",
      })
    } else if (open) {
      setFormData({
        clientId: getAllClients()[0]?.id || "",
        apartmentId: getAllApartments()[0]?.id || "",
        amount: 0,
        currency: "USD",
        status: "pending",
        method: "bank_transfer",
        dueDate: new Date().toISOString().split("T")[0],
        paidDate: "",
        notes: "",
      })
    }
  }, [open, payment])

  const handleChange = (field: string, value: string | number | Currency) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      dueDate: new Date(formData.dueDate),
      paidDate: formData.paidDate ? new Date(formData.paidDate) : undefined,
    })
    onOpenChange(false)
  }

  const clients = getAllClients()
  const apartments = getAllApartments()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="clientId" className="text-right">
                Client
              </Label>
              <Select value={formData.clientId} onValueChange={(value) => handleChange("clientId", value)}>
                <SelectTrigger id="clientId" className="col-span-3">
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="apartmentId" className="text-right">
                Apartment
              </Label>
              <Select value={formData.apartmentId} onValueChange={(value) => handleChange("apartmentId", value)}>
                <SelectTrigger id="apartmentId" className="col-span-3">
                  <SelectValue placeholder="Select apartment" />
                </SelectTrigger>
                <SelectContent>
                  {apartments.map((apartment) => (
                    <SelectItem key={apartment.id} value={apartment.id}>
                      {apartment.number} ({apartment.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <div className="col-span-3 flex gap-2">
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => handleChange("amount", Number.parseFloat(e.target.value))}
                  className="flex-1"
                  required
                />
                <CurrencySelector
                  defaultCurrency={formData.currency}
                  onCurrencyChange={(currency) => handleChange("currency", currency)}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select value={formData.status} onValueChange={(value) => handleChange("status", value as PaymentStatus)}>
                <SelectTrigger id="status" className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="method" className="text-right">
                Payment Method
              </Label>
              <Select value={formData.method} onValueChange={(value) => handleChange("method", value as PaymentMethod)}>
                <SelectTrigger id="method" className="col-span-3">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="check">Check</SelectItem>
                  <SelectItem value="credit_card">Credit Card</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dueDate" className="text-right">
                Due Date
              </Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleChange("dueDate", e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="paidDate" className="text-right">
                Paid Date
              </Label>
              <Input
                id="paidDate"
                type="date"
                value={formData.paidDate || ""}
                onChange={(e) => handleChange("paidDate", e.target.value)}
                className="col-span-3"
                disabled={formData.status !== "paid"}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Textarea
                id="notes"
                value={formData.notes || ""}
                onChange={(e) => handleChange("notes", e.target.value)}
                className="col-span-3"
                placeholder="Optional notes about this payment"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-700 hover:bg-green-800">
              Save Payment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
