export interface ForexData {
  symbol: string;
  price: number;
  timestamp: string;
}

export interface TradingSignal {
  id: string;
  symbol: string;
  type: "BUY" | "SELL";
  entry: number;
  currentPrice?: number;
  confidence: number;
}
