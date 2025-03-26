"use client"

import type * as React from "react"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

interface RightMenuProps {
  title?: string
  children: React.ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RightMenu({ title, children, open, onOpenChange }: RightMenuProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <SheetTitle>{title}</SheetTitle>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="-mr-2">
              <X className="h-4 w-4" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-8rem)] pb-10">{children}</ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

