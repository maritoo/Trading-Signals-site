"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function SignalFilters() {
  return (
    <Tabs defaultValue="1h">
      <TabsList>
        <TabsTrigger value="5m">5M</TabsTrigger>
        <TabsTrigger value="15m">15M</TabsTrigger>
        <TabsTrigger value="1h">1H</TabsTrigger>
        <TabsTrigger value="4h">4H</TabsTrigger>
        <TabsTrigger value="1d">1D</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}

