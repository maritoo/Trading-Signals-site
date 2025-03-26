"use client"

import { useEffect, useRef, useState } from "react"
import { Loader2 } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

declare global {
  interface Window {
    TradingView: any
  }
}

export function TradingViewChart() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [symbol, setSymbol] = useState("BINANCE:BTCUSDT")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://s3.tradingview.com/tv.js"
    script.async = true
    script.onload = () => {
      if (containerRef.current && window.TradingView) {
        new window.TradingView.widget({
          container_id: "tradingview_chart",
          symbol: symbol,
          interval: "D",
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          toolbar_bg: "#f1f3f6",
          enable_publishing: false,
          hide_side_toolbar: false,
          allow_symbol_change: true,
          studies: ["RSI@tv-basicstudies", "MASimple@tv-basicstudies"],
          height: 400,
        })
        setLoading(false)
      }
    }
    document.head.appendChild(script)

    return () => {
      script.remove()
    }
  }, [symbol])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Market Chart</CardTitle>
        <Select value={symbol} onValueChange={setSymbol}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select market" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="BINANCE:BTCUSDT">BTC/USDT</SelectItem>
            <SelectItem value="BINANCE:ETHUSDT">ETH/USDT</SelectItem>
            <SelectItem value="BINANCE:BNBUSDT">BNB/USDT</SelectItem>
            <SelectItem value="BINANCE:SOLUSDT">SOL/USDT</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex h-[400px] items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}
        <div ref={containerRef} id="tradingview_chart" />
      </CardContent>
    </Card>
  )
}

