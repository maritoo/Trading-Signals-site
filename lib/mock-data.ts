import type { NewsItem } from "@/types/news"
import type { MarketData } from "@/types/market"

export const mockNews: NewsItem[] = [
  {
    id: "1",
    title: "Gold prices surge amid economic uncertainty",
    description: "Investors flock to safe-haven assets as global economic concerns grow.",
    url: "#",
    publishedAt: new Date().toISOString(),
    sentiment: "positive",
  },
  {
    id: "2",
    title: "EUR/USD reaches new monthly high",
    description: "European currency strengthens against USD following positive economic data.",
    url: "#",
    publishedAt: new Date().toISOString(),
    sentiment: "positive",
  },
  {
    id: "3",
    title: "Bitcoin stabilizes above support level",
    description: "Cryptocurrency market shows signs of consolidation after recent volatility.",
    url: "#",
    publishedAt: new Date().toISOString(),
    sentiment: "neutral",
  },
]

export const mockMarketData: MarketData[] = [
  {
    symbol: "XAUUSD",
    price: 2023.5,
    change24h: 0.75,
    volume24h: 1500000,
    high24h: 2025.0,
    low24h: 2018.0,
    lastUpdate: new Date().toISOString(),
  },
  {
    symbol: "EURUSD",
    price: 1.085,
    change24h: 0.25,
    volume24h: 850000,
    high24h: 1.0875,
    low24h: 1.0825,
    lastUpdate: new Date().toISOString(),
  },
  {
    symbol: "BTCUSD",
    price: 42500,
    change24h: 1.5,
    volume24h: 2500000,
    high24h: 43000,
    low24h: 42000,
    lastUpdate: new Date().toISOString(),
  },
]

