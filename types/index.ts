export interface MarketData {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  high24h: number;
  low24h: number;
}

export interface NewsItem {
  title: string;
  description: string;
  publishedAt: string;
  sentiment: "positive" | "negative" | "neutral";
  source: string;
  url: string;
}
