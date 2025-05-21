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
import type { Apartment, ApartmentStatus } from "@/lib/types"
import { getAllBuildings } from "@/lib/data"

interface ApartmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (apartment: Omit<Apartment, "id" | "createdAt" | "updatedAt">) => void
  apartment?: Apartment
  title?: string
  description?: string
}

export function ApartmentDialog({
  open,
  onOpenChange,
  onSave,
  apartment,
  title = "Add New Apartment",
  description = "Add a new apartment to the system.",
}: ApartmentDialogProps) {
  const [formData, setFormData] = useState<{
    buildingId: string
    number: string
    floor: number
    type: string
    size: number
    price: number
    status: ApartmentStatus
  }>({
    buildingId: "",
    number: "",
    floor: 1,
    type: "1 Bedroom",
    size: 0,
    price: 0,
    status: "available",
  })

  // Reset form when dialog opens/closes or apartment changes
  useEffect(() => {
    if (open && apartment) {
      setFormData({
        buildingId: apartment.buildingId,
        number: apartment.number,
        floor: apartment.floor,
        type: apartment.type,
        size: apartment.size,
        price: apartment.price,
        status: apartment.status,
      })
    } else if (open) {
      setFormData({
        buildingId: getAllBuildings()[0]?.id || "",
        number: "",
        floor: 1,
        type: "1 Bedroom",
        size: 0,
        price: 0,
        status: "available",
      })
    }
  }, [open, apartment])

  const handleChange = (field: string, value: string | number) => {
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

  const buildings = getAllBuildings()

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
              <Label htmlFor="buildingId" className="text-right">
                Building
              </Label>
              <Select value={formData.buildingId} onValueChange={(value) => handleChange("buildingId", value)}>
                <SelectTrigger id="buildingId" className="col-span-3">
                  <SelectValue placeholder="Select building" />
                </SelectTrigger>
                <SelectContent>
                  {buildings.map((building) => (
                    <SelectItem key={building.id} value={building.id}>
                      {building.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="number" className="text-right">
                Apartment Number
              </Label>
              <Input
                id="number"
                value={formData.number}
                onChange={(e) => handleChange("number", e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="floor" className="text-right">
                Floor
              </Label>
              <Input
                id="floor"
                type="number"
                min="1"
                value={formData.floor}
                onChange={(e) => handleChange("floor", Number.parseInt(e.target.value))}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select value={formData.type} onValueChange={(value) => handleChange("type", value)}>
                <SelectTrigger id="type" className="col-span-3">
                  <SelectValue placeholder="Select apartment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Studio">Studio</SelectItem>
                  <SelectItem value="1 Bedroom">1 Bedroom</SelectItem>
                  <SelectItem value="2 Bedroom">2 Bedroom</SelectItem>
                  <SelectItem value="3 Bedroom">3 Bedroom</SelectItem>
                  <SelectItem value="Penthouse">Penthouse</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="size" className="text-right">
                Size (sq ft)
              </Label>
              <Input
                id="size"
                type="number"
                min="0"
                value={formData.size}
                onChange={(e) => handleChange("size", Number.parseInt(e.target.value))}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price
              </Label>
              <Input
                id="price"
                type="number"
                min="0"
                value={formData.price}
                onChange={(e) => handleChange("price", Number.parseInt(e.target.value))}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange("status", value as ApartmentStatus)}
              >
                <SelectTrigger id="status" className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="reserved">Reserved</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-700 hover:bg-green-800">
              Save Apartment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
