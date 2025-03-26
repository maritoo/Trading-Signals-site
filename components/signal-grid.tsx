"use client"

import { useState } from "react"
import { ArrowDown, ArrowUp, Star, MessageSquare, Copy, Timer } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface TradingSignal {
  id: string
  type: "BUY" | "SELL"
  symbol: string
  entry: number
  stopLoss: number
  takeProfit: number
  confidence: number
  timeRemaining: string
  sentiment: "bullish" | "bearish" | "neutral"
  ratings: number
  comments: number
}

export function SignalGrid() {
  const [signals, setSignals] = useState<TradingSignal[]>([
    {
      id: "1",
      type: "BUY",
      symbol: "BTC/USD",
      entry: 43250,
      stopLoss: 42800,
      takeProfit: 44100,
      confidence: 85,
      timeRemaining: "45m",
      sentiment: "bullish",
      ratings: 24,
      comments: 12,
    },
    {
      id: "2",
      type: "SELL",
      symbol: "ETH/USD",
      entry: 2250,
      stopLoss: 2290,
      takeProfit: 2150,
      confidence: 78,
      timeRemaining: "2h",
      sentiment: "bearish",
      ratings: 18,
      comments: 8,
    },
  ])

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Active Signals</h2>
        {signals.map((signal) => (
          <Card key={signal.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium">{signal.symbol}</CardTitle>
                <span
                  className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
                    signal.type === "BUY" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                  }`}
                >
                  {signal.type === "BUY" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                  {signal.type}
                </span>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Entry</p>
                  <p className="font-medium">${signal.entry}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Stop Loss</p>
                  <p className="font-medium">${signal.stopLoss}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Take Profit</p>
                  <p className="font-medium">${signal.takeProfit}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>Confidence</span>
                    <span>{signal.confidence}%</span>
                  </div>
                  <Progress value={signal.confidence} className="mt-1" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Star className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Rate signal</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Discuss signal</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy trade</TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Timer className="h-4 w-4" />
                  {signal.timeRemaining}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </TooltipProvider>
  )
}

