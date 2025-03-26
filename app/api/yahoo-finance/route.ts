import { NextResponse } from "next/server";

interface YahooFinanceResponse {
  chart: {
    result: Array<{
      meta: {
        regularMarketPrice: number;
        chartPreviousClose: number;
      };
      timestamp: number[];
      indicators: {
        quote: Array<{
          open: number[];
          high: number[];
          low: number[];
          close: number[];
          volume: number[];
        }>;
      };
    }>;
    error: any;
  };
}

interface BarData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

const BASE_URL = "https://query1.finance.yahoo.com/v8/finance/chart";

const SYMBOL_MAP: { [key: string]: string } = {
  "EURUSD=X": "EURUSD=X",
  "XAUUSD=X": "GC=F", // Gold Futures
  XAUUSD: "GC=F", // Gold Futures without =X
  "BTC-USD": "BTC-USD",
  GOLD: "GC=F",
  "XAU/USD": "GC=F",
};

const DISPLAY_NAMES: { [key: string]: string } = {
  "GC=F": "XAU/USD",
  "EURUSD=X": "EUR/USD",
  "GBPUSD=X": "GBP/USD",
  "USDJPY=X": "USD/JPY",
};

async function fetchYahooData(symbol: string) {
  try {
    const mappedSymbol = SYMBOL_MAP[symbol] || symbol;
    const now = Math.floor(Date.now() / 1000);
    const oneDayAgo = now - 24 * 60 * 60;

    const url = `${BASE_URL}/${mappedSymbol}?period1=${oneDayAgo}&period2=${now}&interval=1m&includePrePost=true`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.chart?.result?.[0]) {
      throw new Error("Invalid data structure received from Yahoo Finance");
    }

    return { data, mappedSymbol };
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error);
    throw error;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get("symbol");

    if (!symbol) {
      return NextResponse.json(
        { status: "error", message: "Symbol is required" },
        { status: 400 }
      );
    }

    const { data, mappedSymbol } = await fetchYahooData(symbol);
    const result = data.chart.result[0];
    const quotes = result.indicators.quote[0];
    const currentPrice = result.meta.regularMarketPrice;
    const previousClose = result.meta.chartPreviousClose;

    // Create properly formatted history array
    const history = result.timestamp
      .map((time: number, i: number) => ({
        time: time,
        open: quotes.open[i] || currentPrice,
        high: quotes.high[i] || currentPrice,
        low: quotes.low[i] || currentPrice,
        close: quotes.close[i] || currentPrice,
        volume: quotes.volume[i] || 0,
      }))
      .filter(
        (bar: BarData) =>
          bar.open !== null &&
          bar.high !== null &&
          bar.low !== null &&
          bar.close !== null
      );

    // Calculate day high and low
    const dayHigh = Math.max(...history.map((bar: BarData) => bar.high));
    const dayLow = Math.min(...history.map((bar: BarData) => bar.low));
    const volume = history.reduce(
      (sum: number, bar: BarData) => sum + bar.volume,
      0
    );

    return NextResponse.json({
      status: "success",
      data: {
        symbol: {
          raw: symbol,
          mapped: mappedSymbol,
          display: DISPLAY_NAMES[mappedSymbol] || symbol,
        },
        price: {
          current: currentPrice,
          previousClose: previousClose,
          dayHigh: dayHigh,
          dayLow: dayLow,
          volume: volume,
          change: ((currentPrice - previousClose) / previousClose) * 100,
        },
        history: history,
      },
    });
  } catch (error) {
    console.error("Yahoo Finance API error:", error);
    return NextResponse.json(
      {
        status: "error",
        message:
          error instanceof Error ? error.message : "Failed to fetch data",
      },
      { status: 500 }
    );
  }
}
