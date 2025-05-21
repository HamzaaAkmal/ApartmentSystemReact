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
import type { Client, ClientType, ClientStatus } from "@/lib/types"

interface ClientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (client: Omit<Client, "id" | "createdAt" | "updatedAt">) => void
  client?: Client
  title?: string
  description?: string
}

export function ClientDialog({
  open,
  onOpenChange,
  onSave,
  client,
  title = "Add New Client",
  description = "Add a new client to the system.",
}: ClientDialogProps) {
  const [formData, setFormData] = useState<{
    name: string
    email: string
    phone: string
    type: ClientType
    status: ClientStatus
    apartmentId?: string
  }>({
    name: "",
    email: "",
    phone: "",
    type: "buyer",
    status: "active",
    apartmentId: "",
  })

  // Reset form when dialog opens/closes or client changes
  useEffect(() => {
    if (open && client) {
      setFormData({
        name: client.name,
        email: client.email,
        phone: client.phone,
        type: client.type,
        status: client.status,
        apartmentId: client.apartmentId,
      })
    } else if (open) {
      setFormData({
        name: "",
        email: "",
        phone: "",
        type: "buyer",
        status: "active",
        apartmentId: "",
      })
    }
  }, [open, client])

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
    })
    onOpenChange(false)
  }

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
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Client Type
              </Label>
              <Select value={formData.type} onValueChange={(value) => handleChange("type", value as ClientType)}>
                <SelectTrigger id="type" className="col-span-3">
                  <SelectValue placeholder="Select client type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buyer">Buyer</SelectItem>
                  <SelectItem value="investor">Investor</SelectItem>
                  <SelectItem value="tenant">Tenant</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select value={formData.status} onValueChange={(value) => handleChange("status", value as ClientStatus)}>
                <SelectTrigger id="status" className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="apartmentId" className="text-right">
                Apartment ID
              </Label>
              <Input
                id="apartmentId"
                value={formData.apartmentId || ""}
                onChange={(e) => handleChange("apartmentId", e.target.value)}
                className="col-span-3"
                placeholder="Optional"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-700 hover:bg-green-800">
              Save Client
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
