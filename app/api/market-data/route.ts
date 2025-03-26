import { NextResponse } from "next/server";
import axios from "axios";

const TRADINGVIEW_API_URL = "https://scanner.tradingview.com/forex/scan";

export async function GET() {
  try {
    const symbols = ["EURUSD", "XAUUSD", "BTCUSD", "GBPUSD", "USDJPY"];
    const columns = ["close", "change", "volume", "high", "low"];

    const response = await axios.post(TRADINGVIEW_API_URL, {
      symbols: {
        tickers: symbols.map((symbol) => `FX:${symbol}`),
        query: { types: [] },
      },
      columns,
    });

    const data = response.data.data.map((item: any, index: number) => {
      const symbol = symbols[index];
      return {
        symbol: symbol.slice(0, 3) + "/" + symbol.slice(3),
        price: item.d[0] || 0,
        change: item.d[1] || 0,
        volume: item.d[2] || 0,
        high: item.d[3] || 0,
        low: item.d[4] || 0,
        lastUpdated: new Date().toISOString(),
      };
    });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error(
      "Error fetching market data:",
      error.response?.data || error.message
    );
    return NextResponse.json(
      {
        error: "Failed to fetch market data",
        details: error.response?.data || error.message,
      },
      { status: 500 }
    );
  }
}
