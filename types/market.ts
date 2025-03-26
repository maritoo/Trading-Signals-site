export interface MarketPrice {
  current: number;
  previousClose: number;
  dayHigh: number;
  dayLow: number;
  volume: number;
  change: number;
}

export interface MarketSymbol {
  raw: string;
  mapped: string;
  display: string;
}

export interface MarketHistory {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketResponse {
  status: "success" | "error";
  data?: {
    symbol: MarketSymbol;
    price: MarketPrice;
    history: MarketHistory[];
  };
  message?: string;
}

export interface MarketData {
  current: number;
  dayHigh: number;
  dayLow: number;
  volume: number;
  changePercent: number;
}

export interface WebSocketMessage {
  data?: {
    s: string; // symbol
    p: string; // price
    P: string; // price change percentage
  };
}
