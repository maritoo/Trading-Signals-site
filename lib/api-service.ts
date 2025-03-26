import axios from "axios";
import { MarketData, NewsItem } from "../types";

const API_KEY = process.env.NEXT_PUBLIC_FOREX_API_KEY;

// Mock data for testing
const mockMarketData: MarketData[] = [
  {
    symbol: "EURUSD",
    price: 1.0876,
    change24h: 0.25,
    volume24h: 125000000,
    high24h: 1.089,
    low24h: 1.085,
  },
  {
    symbol: "XAUUSD",
    price: 2023.5,
    change24h: -0.15,
    volume24h: 45000000,
    high24h: 2030.0,
    low24h: 2020.0,
  },
  {
    symbol: "BTCUSD",
    price: 43500,
    change24h: 1.2,
    volume24h: 28000000000,
    high24h: 44000,
    low24h: 43000,
  },
  {
    symbol: "GBPUSD",
    price: 1.264,
    change24h: -0.3,
    volume24h: 98000000,
    high24h: 1.268,
    low24h: 1.262,
  },
  {
    symbol: "USDJPY",
    price: 148.5,
    change24h: 0.45,
    volume24h: 115000000,
    high24h: 148.8,
    low24h: 148.2,
  },
];

const mockNewsData: NewsItem[] = [
  {
    title: "Fed Signals Potential Rate Cuts in 2024",
    description:
      "Federal Reserve officials indicate possibility of multiple rate cuts next year as inflation shows signs of cooling",
    publishedAt: new Date().toISOString(),
    sentiment: "positive",
    url: "#",
    source: "Reuters",
  },
  {
    title: "ECB Maintains Hawkish Stance on Monetary Policy", 
    description:
      "European Central Bank emphasizes commitment to fighting inflation despite economic slowdown concerns",
    publishedAt: new Date().toISOString(),
    sentiment: "negative",
    url: "#",
    source: "Bloomberg",
  },
  {
    title: "Gold Prices Rally Amid Global Uncertainty",
    description:
      "Safe-haven demand drives gold prices higher as geopolitical tensions increase",
    publishedAt: new Date().toISOString(),
    sentiment: "positive",
    url: "#",
    source: "Financial Times"
  },
];

export async function getMarketData(): Promise<MarketData[]> {
  try {
    const response = await axios.get("/api/market-data");
    return response.data;
  } catch (error) {
    console.error("Error fetching market data:", error);
    return [];
  }
}

export async function getMarketNews(): Promise<NewsItem[]> {
  try {
    const response = await axios.get("/api/market-news");
    return response.data;
  } catch (error) {
    console.error("Error fetching market news:", error);
    return [];
  }
}

export function formatVolume(volume: number): string {
  if (volume >= 1e9) {
    return `${(volume / 1e9).toFixed(2)}B`;
  }
  if (volume >= 1e6) {
    return `${(volume / 1e6).toFixed(2)}M`;
  }
  if (volume >= 1e3) {
    return `${(volume / 1e3).toFixed(2)}K`;
  }
  return volume.toString();
}
