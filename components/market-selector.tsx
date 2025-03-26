"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const markets = [
  {
    value: "btc-usd",
    label: "BTC/USD",
    category: "Crypto",
  },
  {
    value: "eth-usd",
    label: "ETH/USD",
    category: "Crypto",
  },
  {
    value: "eur-usd",
    label: "EUR/USD",
    category: "Forex",
  },
  {
    value: "gbp-usd",
    label: "GBP/USD",
    category: "Forex",
  },
  {
    value: "aapl",
    label: "Apple Inc.",
    category: "Stocks",
  },
  {
    value: "tsla",
    label: "Tesla Inc.",
    category: "Stocks",
  },
]

export function MarketSelector() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("btc-usd")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-[250px] justify-between">
          {value ? markets.find((market) => market.value === value)?.label : "Select market..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput placeholder="Search markets..." />
          <CommandList>
            <CommandEmpty>No market found.</CommandEmpty>
            {["Crypto", "Forex", "Stocks"].map((category) => (
              <CommandGroup key={category} heading={category}>
                {markets
                  .filter((market) => market.category === category)
                  .map((market) => (
                    <CommandItem
                      key={market.value}
                      value={market.value}
                      onSelect={(currentValue) => {
                        setValue(currentValue)
                        setOpen(false)
                      }}
                    >
                      <Check className={cn("mr-2 h-4 w-4", value === market.value ? "opacity-100" : "opacity-0")} />
                      {market.label}
                    </CommandItem>
                  ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

