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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea"; // For interaction form
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // For interaction form
import { useState } from "react"; // For interaction form state

// Remove getClientById, as client object will be passed as a prop
import { getApartmentById, getBuildingById, getPaymentsByClient, formatCurrency } from "@/lib/data";
import type { Client, Currency, Interaction, InteractionType } from "@/lib/types"; // Import Client and Interaction types
import { useInteractions } from "@/lib/hooks/use-interactions"; // Import the new hook
import { useAuth } from "@/context/AuthContext"; // To get current user ID

interface ViewClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client | null | undefined; // Accept the full client object
  onEdit: () => void;
  onDelete: () => void;
  currency: Currency;
}

export function ViewClientDialog({ open, onOpenChange, client, onEdit, onDelete, currency }: ViewClientDialogProps) {
  const { interactions, loading: interactionsLoading, error: interactionsError, addInteraction } = useInteractions(client?.id);
  const { currentUser } = useAuth();

  const [newInteractionContent, setNewInteractionContent] = useState("");
  const [newInteractionType, setNewInteractionType] = useState<InteractionType>("note");

  const handleAddInteraction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInteractionContent.trim() || !client) return;

    try {
      await addInteraction({
        timestamp: new Date(), // Firestore will convert this to Timestamp
        type: newInteractionType,
        content: newInteractionContent,
        userId: currentUser?.uid, // Optional: include current user's ID
      });
      setNewInteractionContent(""); // Reset form
      setNewInteractionType("note");
    } catch (error) {
      console.error("Failed to add interaction:", error);
      // Optionally show an error message to the user
    }
  };

  if (!client) {
    // Optionally, render a loading state or a message if client is null/undefined
    // For now, returning null keeps the previous behavior if client is not found
    return null;
  }

  const apartment = client.apartmentId ? getApartmentById(client.apartmentId) : null;
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
          <DialogTitle>Client Details: {client?.name}</DialogTitle>
          <DialogDescription>View detailed information, apartment, payments, and interactions for this client.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-4"> {/* Updated to 4 columns */}
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="apartment">Apartment</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="interactions">Interactions</TabsTrigger> {/* New Tab */}
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
                <p className="text-lg">
                  {client.createdAt ? new Date(client.createdAt).toLocaleDateString() : "N/A"}
                </p>
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

          {/* Interactions Tab Content START */}
          <TabsContent value="interactions" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Log Interaction</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddInteraction} className="space-y-4">
                  <div>
                    <Label htmlFor="interactionType">Type</Label>
                    <Select value={newInteractionType} onValueChange={(value) => setNewInteractionType(value as InteractionType)}>
                      <SelectTrigger id="interactionType">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="note">Note</SelectItem>
                        <SelectItem value="call">Call</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="meeting">Meeting</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="interactionContent">Details</Label>
                    <Textarea
                      id="interactionContent"
                      value={newInteractionContent}
                      onChange={(e) => setNewInteractionContent(e.target.value)}
                      placeholder="Write down notes or a summary of the interaction..."
                      rows={3}
                      required
                    />
                  </div>
                  <Button type="submit" className="bg-green-700 hover:bg-green-800" disabled={interactionsLoading}>
                    Add Interaction
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Interaction History</h3>
              {interactionsLoading && <p>Loading interactions...</p>}
              {interactionsError && <p className="text-red-500">Error: {interactionsError}</p>}
              {!interactionsLoading && !interactionsError && interactions.length === 0 && (
                <p className="text-gray-500">No interactions logged for this client yet.</p>
              )}
              {!interactionsLoading && !interactionsError && interactions.length > 0 && (
                <div className="space-y-4">
                  {interactions.map((interaction) => (
                    <Card key={interaction.id} className="bg-gray-50">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-sm font-semibold capitalize bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                            {interaction.type}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(interaction.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{interaction.content}</p>
                        {interaction.userId && (
                          <p className="text-xs text-gray-400 mt-2">Logged by: User {interaction.userId.substring(0,6)}...</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          {/* Interactions Tab Content END */}
        </Tabs>

        <DialogFooter className="gap-2 pt-4 border-t mt-4"> {/* Added padding and border */}
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
