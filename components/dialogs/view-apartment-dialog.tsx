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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// Removed getApartmentById, getBuildingById, getClientByApartment
import { formatCurrency } from "@/lib/data"; // Keep formatCurrency or move to a utils file
import type { Currency, Apartment, Client as ClientType, Building as BuildingType } from "@/lib/types"; // Added Apartment, Client, Building types
import Image from "next/image";
import { useBuildings } from "@/lib/hooks/use-buildings"; // Added
import { useCrud as useClientCrud } from "@/lib/hooks/use-crud"; // Added
import { Loader2 } from "lucide-react"; // For loading state

interface ViewApartmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  apartment: Apartment | null | undefined; // Changed from apartmentId to apartment object
  onEdit: () => void;
  onDelete: () => void;
  currency: Currency;
}

export function ViewApartmentDialog({
  open,
  onOpenChange,
  apartment, // Use apartment object directly
  onEdit,
  onDelete,
  currency,
}: ViewApartmentDialogProps) {
  const { buildings, loading: buildingsLoading } = useBuildings();
  const { items: clients, loading: clientsLoading } = useClientCrud();

  if (!apartment) {
    return null; // Or a placeholder if open is true but apartment is null
  }

  const building = !buildingsLoading && apartment ? buildings.find(b => b.id === apartment.buildingId) : null;
  // Assuming Client type has apartmentId for this relation.
  // If Apartment stores clientId, then it would be: clients.find(c => c.id === apartment.clientId)
  const client = !clientsLoading && apartment ? clients.find((c: ClientType) => c.apartmentId === apartment.id) : null;


  if (buildingsLoading || clientsLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px] flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-green-700" />
          <p className="ml-2">Loading details...</p>
        </DialogContent>
      </Dialog>
    );
  }
  
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
                <p className="text-lg">{apartment.createdAt ? new Date(apartment.createdAt).toLocaleDateString() : "N/A"}</p>
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
                  <p className="text-lg">{client.createdAt ? new Date(client.createdAt).toLocaleDateString() : "N/A"}</p>
                </div>
              </div>
            ) : (
              <div className="rounded-md bg-yellow-50 p-4 text-yellow-700">
                {clientsLoading ? "Loading client information..." : "No client assigned to this apartment."}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2 pt-4 border-t mt-2"> {/* Added padding and border */}
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
