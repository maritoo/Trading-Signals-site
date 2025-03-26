"use client"

import { useState } from "react"
import { Suspense } from "react"
import { Info } from "lucide-react"

import { MarketSelector } from "@/components/market-selector"
import { SignalFilters } from "@/components/signal-filters"
import { SignalGrid } from "@/components/signal-grid"
import { SignalChart } from "@/components/signal-chart"
import { MarketSentiment } from "@/components/market-sentiment"
import { EconomicCalendar } from "@/components/economic-calendar"
import { SignalDiscussion } from "@/components/signal-discussion"
import { RightMenu } from "@/components/right-menu"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export default function SignalsPage() {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">Trading Signals</h1>
            <Button variant="outline" size="sm" onClick={() => setShowDetails(true)}>
              <Info className="mr-2 h-4 w-4" />
              Signal Details
            </Button>
          </div>
          <p className="text-muted-foreground">AI-powered trading signals with real-time market analysis</p>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <MarketSelector />
          <SignalFilters />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
          <div className="space-y-6">
            <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
              <SignalChart />
            </Suspense>
            <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
              <SignalDiscussion />
            </Suspense>
          </div>
          <div className="space-y-6">
            <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
              <SignalGrid />
            </Suspense>
            <MarketSentiment />
            <EconomicCalendar />
          </div>
        </div>
      </div>

      <RightMenu title="Signal Details" open={showDetails} onOpenChange={setShowDetails}>
        <div className="space-y-6 py-6">
          <div>
            <h3 className="font-semibold">Technical Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Detailed breakdown of technical indicators and their implications for the current trading signal.
            </p>
            <div className="mt-4 rounded-lg border p-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">RSI (14)</span>
                  <span className="text-sm font-medium">65.42</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">MACD</span>
                  <span className="text-sm font-medium text-green-500">Bullish Crossover</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Moving Averages</span>
                  <span className="text-sm font-medium">Above 200 MA</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold">Risk Management</h3>
            <p className="text-sm text-muted-foreground">
              Suggested position sizing and risk parameters based on your account settings.
            </p>
            <div className="mt-4 rounded-lg border p-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Recommended Position Size</span>
                  <span className="text-sm font-medium">0.5 BTC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Risk per Trade</span>
                  <span className="text-sm font-medium">2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Risk/Reward Ratio</span>
                  <span className="text-sm font-medium">1:3</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold">Market Context</h3>
            <p className="text-sm text-muted-foreground">
              Current market conditions and important events affecting this trading signal.
            </p>
            <div className="mt-4 space-y-3">
              <div className="rounded-lg border p-4">
                <h4 className="font-medium">Upcoming Events</h4>
                <p className="mt-1 text-sm text-muted-foreground">FOMC Meeting Minutes (19:00 UTC)</p>
              </div>
              <div className="rounded-lg border p-4">
                <h4 className="font-medium">Market Volatility</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  Current volatility is 15% higher than 30-day average
                </p>
              </div>
            </div>
          </div>
        </div>
      </RightMenu>
    </>
  )
}

