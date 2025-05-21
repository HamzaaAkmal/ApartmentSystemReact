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
import { getApartmentById, getBuildingById, getClientByApartment, formatCurrency } from "@/lib/data"
import type { Currency } from "@/lib/types"
import Image from "next/image"

interface ViewApartmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  apartmentId: string
  onEdit: () => void
  onDelete: () => void
  currency: Currency
}

export function ViewApartmentDialog({
  open,
  onOpenChange,
  apartmentId,
  onEdit,
  onDelete,
  currency,
}: ViewApartmentDialogProps) {
  const apartment = getApartmentById(apartmentId)

  if (!apartment) {
    return null
  }

  const building = getBuildingById(apartment.buildingId)
  const client = getClientByApartment(apartment.id)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Apartment Details</DialogTitle>
          <DialogDescription>View detailed information about this apartment.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
            <TabsTrigger value="client">Client</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 pt-4">
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
                <p className="text-sm font-medium text-gray-500">Floor</p>
                <p className="text-lg">{apartment.floor}</p>
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
                <p
                  className={`inline-block rounded-full px-2 py-1 text-sm font-medium capitalize ${
                    apartment.status === "available"
                      ? "bg-green-100 text-green-700"
                      : apartment.status === "reserved"
                        ? "bg-yellow-100 text-yellow-700"
                        : apartment.status === "maintenance"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-red-100 text-red-700"
                  }`}
                >
                  {apartment.status}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Added On</p>
                <p className="text-lg">{apartment.createdAt.toLocaleDateString()}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="photos" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="relative h-64 w-full overflow-hidden rounded-lg">
                <Image src="/placeholder.svg?height=400&width=600" alt="Apartment" fill className="object-cover" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="relative h-24 overflow-hidden rounded-md">
                  <Image
                    src="/placeholder.svg?height=100&width=150"
                    alt="Apartment thumbnail"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-24 overflow-hidden rounded-md">
                  <Image
                    src="/placeholder.svg?height=100&width=150"
                    alt="Apartment thumbnail"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-24 overflow-hidden rounded-md">
                  <Image
                    src="/placeholder.svg?height=100&width=150"
                    alt="Apartment thumbnail"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="flex justify-center">
                <Button variant="outline">Upload Photos</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="client" className="space-y-4 pt-4">
            {client ? (
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
            ) : (
              <div className="rounded-md bg-yellow-50 p-4 text-yellow-700">No client assigned to this apartment.</div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={onEdit} className="bg-green-700 hover:bg-green-800">
            Edit Apartment
          </Button>
          <Button onClick={onDelete} variant="destructive">
            Delete Apartment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
