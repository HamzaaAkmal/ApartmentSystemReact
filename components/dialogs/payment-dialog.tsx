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
import { Textarea } from "@/components/ui/textarea";
import { CurrencySelector } from "@/components/ui/currency-selector"; // Assuming path, adjust if needed
import type { Payment, PaymentStatus, PaymentMethod, Currency, Client, Apartment } from "@/lib/types";
// Remove getAllClients, import useClientCrud (actual useCrud for Firestore clients)
import { useCrud as useClientCrud } from "@/lib/hooks/use-crud"; 
import type { Payment, PaymentStatus, PaymentMethod, Currency, Client, Apartment, Building as BuildingType } from "@/lib/types"; // Removed getAllApartments, Added BuildingType
import { Loader2 } from "lucide-react"; // For loading states

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (payment: Omit<Payment, "id" | "createdAt" | "updatedAt">) => void;
  payment?: Payment;
  title?: string;
  description?: string;
  clients: Client[]; // Expect clients from Firestore
  apartments: Apartment[]; // Expect apartments from Firestore
  // Optional: Pass buildings if you want to display building names with apartment numbers
  buildings?: BuildingType[]; 
  clientsLoading?: boolean; // Optional loading state for clients
  apartmentsLoading?: boolean; // Optional loading state for apartments
}

export function PaymentDialog({
  open,
  onOpenChange,
  onSave,
  payment,
  title = "Add New Payment",
  description = "Record a new payment in the system.",
  clients, // Use passed clients
  apartments, // Use passed apartments
  buildings, // Optional
  clientsLoading = false, // Default to false
  apartmentsLoading = false, // Default to false
}: PaymentDialogProps) {
  const [formData, setFormData] = useState<{
    clientId: string;
    apartmentId: string;
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

  // const { items: clients, loading: clientsLoading, error: clientsError } = useClientCrud(); // Clients are now passed as props
  // const apartments = getAllApartments(); // Apartments are now passed as props

  useEffect(() => {
    if (open) {
      if (payment) {
        setFormData({
          clientId: payment.clientId,
          apartmentId: payment.apartmentId,
          amount: payment.amount,
          currency: payment.currency,
          status: payment.status,
          method: payment.method,
          dueDate: payment.dueDate instanceof Date ? payment.dueDate.toISOString().split("T")[0] : new Date(payment.dueDate).toISOString().split("T")[0],
          paidDate: payment.paidDate ? (payment.paidDate instanceof Date ? payment.paidDate.toISOString().split("T")[0] : new Date(payment.paidDate).toISOString().split("T")[0]) : "",
          notes: (payment as any).notes || "", 
        });
      } else {
        // Default for new payment
        setFormData({
          clientId: !clientsLoading && clients && clients.length > 0 ? clients[0].id : "", 
          apartmentId: !apartmentsLoading && apartments && apartments.length > 0 ? apartments[0].id : "", 
          amount: 0,
          currency: "USD",
          status: "pending",
          method: "bank_transfer",
          dueDate: new Date().toISOString().split("T")[0],
          paidDate: "",
          notes: "",
        });
      }
    }
  }, [open, payment, clients, apartments, clientsLoading, apartmentsLoading ]);

  const handleChange = (field: string, value: string | number | Currency | PaymentStatus | PaymentMethod) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSave = {
      ...formData,
      dueDate: new Date(formData.dueDate), // Ensure JS Date
      paidDate: formData.paidDate ? new Date(formData.paidDate) : undefined, // Ensure JS Date or undefined
    };
    onSave(dataToSave);
    onOpenChange(false);
  };

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
              <Select value={formData.clientId} onValueChange={(value) => handleChange("clientId", value)} disabled={clientsLoading}>
                <SelectTrigger id="clientId" className="col-span-3">
                  <SelectValue placeholder={clientsLoading ? "Loading clients..." : "Select client"} />
                </SelectTrigger>
                <SelectContent>
                  {/* Removed clientsError display from here as it's not part of props */}
                  {!clientsLoading && clients && clients.map((client: Client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                   {!clientsLoading && (!clients || clients.length === 0) && <SelectItem value="no-clients" disabled>No clients available</SelectItem>}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="apartmentId" className="text-right">
                Apartment
              </Label>
              <Select value={formData.apartmentId} onValueChange={(value) => handleChange("apartmentId", value)} disabled={apartmentsLoading}>
                <SelectTrigger id="apartmentId" className="col-span-3">
                  <SelectValue placeholder={apartmentsLoading ? "Loading apartments..." : "Select apartment"} />
                </SelectTrigger>
                <SelectContent>
                  {/* Assuming apartmentsError might be passed or handled similarly if needed */}
                  {!apartmentsLoading && apartments && apartments.map((apartment: Apartment) => {
                    const buildingName = buildings?.find(b => b.id === apartment.buildingId)?.name;
                    const displayText = buildingName 
                      ? `${apartment.number} (${buildingName} - ${apartment.type})`
                      : `${apartment.number} (${apartment.type})`;
                    return (
                      <SelectItem key={apartment.id} value={apartment.id}>
                        {displayText}
                      </SelectItem>
                    );
                  })}
                  {!apartmentsLoading && (!apartments || apartments.length === 0) && <SelectItem value="no-apartments" disabled>No apartments available</SelectItem>}
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
