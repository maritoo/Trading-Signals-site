"use client"

import { useState, useEffect } from "react"
import type { MarketData, WebSocketMessage } from "@/types/market"
import { getMarketData } from "@/lib/api-service"

export function useMarketData() {
  const [markets, setMarkets] = useState<MarketData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let ws: WebSocket | null = null

    async function fetchInitialData() {
      try {
        const data = await getMarketData()
        setMarkets(data)
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch market data")
        setLoading(false)
      }
    }

    function connectWebSocket() {
      ws = new WebSocket("wss://stream.binance.com:9443/ws")

      ws.onopen = () => {
        const subscribeMessage = {
          method: "SUBSCRIBE",
          params: ["btcusdt@ticker", "ethusdt@ticker", "bnbusdt@ticker", "solusdt@ticker"],
          id: 1,
        }
        ws.send(JSON.stringify(subscribeMessage))
      }

      ws.onmessage = (event) => {
        const message: WebSocketMessage = JSON.parse(event.data)
        if (message.data) {
          setMarkets((prevMarkets) => {
            return prevMarkets.map((market) => {
              if (market.symbol === message.data.s) {
                return {
                  ...market,
                  price: Number.parseFloat(message.data.p),
                  change24h: Number.parseFloat(message.data.P),
                  lastUpdate: new Date().toISOString(),
                }
              }
              return market
            })
          })
        }
      }

      ws.onerror = (error) => {
        console.error("WebSocket error:", error)
        setError("WebSocket connection error")
      }
    }

    fetchInitialData()
    connectWebSocket()

    return () => {
      if (ws) {
        ws.close()
      }
    }
  }, [])

  return { markets, loading, error }
}

