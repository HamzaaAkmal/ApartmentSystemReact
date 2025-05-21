"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import type { Currency } from "@/lib/types"

interface CurrencySelectorProps {
  defaultCurrency?: Currency
  onCurrencyChange?: (currency: Currency) => void
}

const currencies = [
  { value: "USD", label: "USD ($)", symbol: "$" },
  { value: "PKR", label: "PKR (Rs)", symbol: "Rs" },
]

export function CurrencySelector({ defaultCurrency = "USD", onCurrencyChange }: CurrencySelectorProps) {
  const [open, setOpen] = useState(false)
  const [currency, setCurrency] = useState<Currency>(defaultCurrency)

  useEffect(() => {
    // Set initial currency from props
    if (defaultCurrency) {
      setCurrency(defaultCurrency)
    }
  }, [defaultCurrency])

  const handleCurrencyChange = (value: Currency) => {
    setCurrency(value)
    setOpen(false)
    if (onCurrencyChange) {
      onCurrencyChange(value)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-[120px] justify-between">
          {currency ? currencies.find((c) => c.value === currency)?.label : "Select currency..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search currency..." />
          <CommandList>
            <CommandEmpty>No currency found.</CommandEmpty>
            <CommandGroup>
              {currencies.map((c) => (
                <CommandItem key={c.value} value={c.value} onSelect={() => handleCurrencyChange(c.value as Currency)}>
                  <Check className={cn("mr-2 h-4 w-4", currency === c.value ? "opacity-100" : "opacity-0")} />
                  {c.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
