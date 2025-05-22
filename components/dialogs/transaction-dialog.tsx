"use client"

import type React from "react"

import { useState } from "react"
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
import { CurrencySelector } from "@/components/currency-selector";
import type { Currency, TransactionType } from "@/lib/types"; // Import TransactionType

interface TransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (transactionData: { // Renamed and type updated
    amount: number;
    description: string;
    type: TransactionType; // Use imported TransactionType
    category: string;
    currency: Currency;
    transactionDate: Date; // Added transactionDate
  }) => void;
  title?: string;
  description?: string;
  accountType?: "construction" | "finance"; // Make optional if it can be
}

export function TransactionDialog({
  open,
  onOpenChange,
  onSave,
  title = "Add Transaction",
  description = "Record a new transaction.",
  accountType, // Can be undefined if made optional above
}: TransactionDialogProps) {
  const [formData, setFormData] = useState<{
    amount: number;
    description: string;
    type: TransactionType;
    category: string;
    currency: Currency;
    transactionDate: string; // Store as string for date input
  }>({
    amount: 0,
    description: "",
    type: "income",
    category: accountType === "construction" ? "materials" : accountType === "finance" ? "payment" : "other", // Default category
    currency: "USD",
    transactionDate: new Date().toISOString().split("T")[0], // Default to today
  });

  // Update category if accountType changes and dialog is open
  useEffect(() => {
    if (open) {
      setFormData(prev => ({
        ...prev,
        category: accountType === "construction" ? "materials" : accountType === "finance" ? "payment" : prev.category || "other",
      }));
    }
  }, [accountType, open]);


  const handleChange = (field: string, value: string | number | Currency | TransactionType) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      transactionDate: new Date(formData.transactionDate), // Convert string to Date
    });
    onOpenChange(false);
    // Optionally reset form here if dialog is reused without re-initializing state from parent
    setFormData({
        amount: 0,
        description: "",
        type: "income",
        category: accountType === "construction" ? "materials" : accountType === "finance" ? "payment" : "other",
        currency: "USD",
        transactionDate: new Date().toISOString().split("T")[0],
    });
  };

  // Different category options based on account type
  const constructionCategories = ["materials", "labor", "permits", "equipment", "other_construction_expense", "construction_income"];
  const financeCategories = ["client_payment", "refund_issued", "bank_fee", "service_fee", "interest_income", "other_finance_expense", "other_finance_income"];
  const genericCategories = ["utility_bill", "office_supplies", "salary", "miscellaneous_expense", "miscellaneous_income"];
  
  let categories: string[] = genericCategories;
  if (accountType === "construction") {
    categories = constructionCategories;
  } else if (accountType === "finance") {
    categories = financeCategories;
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
              <Label htmlFor="transactionDate" className="text-right">
                Date
              </Label>
              <Input
                id="transactionDate"
                type="date"
                value={formData.transactionDate}
                onChange={(e) => handleChange("transactionDate", e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Transaction Type
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleChange("type", value as TransactionType)}
              >
                <SelectTrigger id="type" className="col-span-3">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
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
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                <SelectTrigger id="category" className="col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-700 hover:bg-green-800">
              Save Transaction
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
