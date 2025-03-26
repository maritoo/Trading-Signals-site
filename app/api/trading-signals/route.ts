import { NextResponse } from "next/server";

// Mock data for trading signals
const mockSignals = [
  {
    id: "1",
    symbol: "EUR/USD",
    type: "buy",
    price: 1.0925,
    timestamp: new Date().toISOString(),
    indicators: {
      rsi: 65.5,
      macd: 0.0025,
      ema: 1.092,
      orderBlock: { level: 1.0915, type: "Demand" },
      liquidityPool: { level: 1.09, volume: 25000000 },
      smc: { pattern: "Breaker Block", strength: 8 },
      fvg: { gap: 0.0015, direction: "Bullish" },
      divergence: { type: "Regular Bullish", strength: 7 },
      mtf: { trend: "Uptrend", strength: 8 },
      volume: { profile: "Accumulation", dominance: 75 },
      supertrend: { direction: "Bullish", strength: 8 },
      orderFlow: { imbalance: 2.5, pressure: "Buying" },
      priceAction: { zone: "Demand", confidence: 85 },
      trendStrength: { value: 7.5, state: "Strong Uptrend" },
    },
  },
  {
    id: "2",
    symbol: "GBP/USD",
    type: "sell",
    price: 1.265,
    timestamp: new Date().toISOString(),
    indicators: {
      rsi: 32.8,
      macd: -0.0018,
      ema: 1.2655,
      orderBlock: { level: 1.267, type: "Supply" },
      liquidityPool: { level: 1.268, volume: 18000000 },
      smc: { pattern: "Fair Value Gap", strength: 7 },
      fvg: { gap: 0.002, direction: "Bearish" },
      divergence: { type: "Hidden Bearish", strength: 6 },
      mtf: { trend: "Downtrend", strength: 7 },
      volume: { profile: "Distribution", dominance: 65 },
      supertrend: { direction: "Bearish", strength: 7 },
      orderFlow: { imbalance: -1.8, pressure: "Selling" },
      priceAction: { zone: "Supply", confidence: 75 },
      trendStrength: { value: 6.8, state: "Strong Downtrend" },
    },
  },
  {
    id: "3",
    symbol: "XAU/USD",
    type: "buy",
    price: 2024.5,
    timestamp: new Date().toISOString(),
    indicators: {
      rsi: 58.2,
      macd: 0.85,
      ema: 2022.3,
      orderBlock: { level: 2020.0, type: "Demand" },
      liquidityPool: { level: 2015.0, volume: 45000000 },
      smc: { pattern: "Liquidity Void", strength: 9 },
      fvg: { gap: 5.5, direction: "Bullish" },
      divergence: { type: "Regular Bullish", strength: 8 },
      mtf: { trend: "Sideways-Up", strength: 6 },
      volume: { profile: "Mixed", dominance: 55 },
      supertrend: { direction: "Bullish", strength: 6 },
      orderFlow: { imbalance: 1.5, pressure: "Mixed-Buy" },
      priceAction: { zone: "Accumulation", confidence: 70 },
      trendStrength: { value: 6.2, state: "Moderate Uptrend" },
    },
  },
];

const TRADING_SYMBOLS = [
  "EURUSD=X",
  "GBPUSD=X",
  "USDJPY=X",
  "XAUUSD=X",
  "BTC-USD",
  "ETH-USD",
];

async function fetchMarketData(symbol: string) {
  try {
    // Use absolute URL with the current host
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const response = await fetch(
      `${baseUrl}/api/yahoo-finance?symbol=${symbol}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        // Add cache: 'no-store' to prevent caching
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Market data for ${symbol}:`, data); // Debug log

    if (data.status !== "success" || !data.data) {
      console.log(`Invalid data for ${symbol}:`, data);
      return null;
    }

    return data.data;
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error);
    return null;
  }
}

function calculateSignals(marketData: any, symbol: string) {
  if (
    !marketData?.price?.current ||
    !marketData?.history ||
    marketData.history.length < 26
  ) {
    console.log(`Invalid market data for ${symbol}:`, marketData);
    return null;
  }

  try {
    const currentPrice = marketData.price.current;
    const history = marketData.history;

    // Calculate RSI
    const changes = history
      .slice(1)
      .map((bar: any, i: number) => bar.close - history[i].close);
    const gains = changes.filter((change: number) => change > 0);
    const losses = changes.filter((change: number) => change < 0).map(Math.abs);

    const avgGain =
      gains.length > 0
        ? gains.reduce((a: number, b: number) => a + b, 0) / 14
        : 0;
    const avgLoss =
      losses.length > 0
        ? losses.reduce((a: number, b: number) => a + b, 0) / 14
        : 0;

    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    const rsi = 100 - 100 / (1 + rs);

    // Calculate EMAs
    const calculateEMA = (period: number) => {
      const k = 2 / (period + 1);
      return history
        .slice(-period)
        .reduce((ema: number, bar: any, i: number, arr: any[]) => {
          return i === 0 ? bar.close : bar.close * k + ema * (1 - k);
        }, 0);
    };

    const ema = calculateEMA(20);
    const ema12 = calculateEMA(12);
    const ema26 = calculateEMA(26);
    const macd = ema12 - ema26;

    // Calculate volatility using ATR
    const tr = history.slice(1).map((bar: any, i: number) => {
      const prev = history[i];
      return Math.max(
        bar.high - bar.low,
        Math.abs(bar.high - prev.close),
        Math.abs(bar.low - prev.close)
      );
    });
    const atr =
      tr.reduce((sum: number, val: number) => sum + val, 0) / tr.length;

    // Determine trend and strength
    const priceChange =
      ((currentPrice - marketData.price.previousClose) /
        marketData.price.previousClose) *
      100;
    const trend = priceChange > 0 ? "Uptrend" : "Downtrend";
    const strength = Math.min(Math.abs(priceChange) * 2, 10);

    // Generate signal
    const type = rsi > 50 && macd > 0 ? "BUY" : "SELL";
    const entry = currentPrice;
    const stopLoss = type === "BUY" ? entry - atr * 1.5 : entry + atr * 1.5;
    const takeProfit = type === "BUY" ? entry + atr * 3 : entry - atr * 3;
    const riskReward =
      Math.abs(takeProfit - entry) / Math.abs(entry - stopLoss);

    // Calculate probability based on indicators alignment
    const indicators = [
      rsi > 50 === (type === "BUY"),
      macd > 0 === (type === "BUY"),
      currentPrice > ema === (type === "BUY"),
      trend === (type === "BUY" ? "Uptrend" : "Downtrend"),
    ];
    const probability =
      (indicators.filter(Boolean).length / indicators.length) * 100;

    // Only return signal if probability is high enough and risk/reward is good
    if (probability >= 60 && riskReward >= 2) {
      return {
        id: Date.now().toString(),
        symbol: symbol.replace("=X", "").replace("-", "/"),
        type,
        price: parseFloat(currentPrice.toFixed(5)),
        entry: parseFloat(entry.toFixed(5)),
        stopLoss: parseFloat(stopLoss.toFixed(5)),
        takeProfit: parseFloat(takeProfit.toFixed(5)),
        riskReward: parseFloat(riskReward.toFixed(2)),
        probability: Math.round(probability),
        timestamp: new Date().toLocaleTimeString(),
        indicators: {
          rsi: parseFloat(rsi.toFixed(1)),
          macd: parseFloat(macd.toFixed(5)),
          ema: parseFloat(ema.toFixed(5)),
          trend: `${trend} ${priceChange > 0 ? "+" : ""}${Math.abs(
            priceChange
          ).toFixed(2)}%`,
          strength: parseFloat(strength.toFixed(1)),
        },
      };
    }

    return null;
  } catch (error) {
    console.error(`Error calculating signals for ${symbol}:`, error);
    return null;
  }
}

export async function GET() {
  try {
    console.log("Fetching signals for symbols:", TRADING_SYMBOLS); // Debug log

    // Use mock data for testing
    return NextResponse.json([
      {
        id: Date.now().toString(),
        symbol: "XAU/USD",
        type: "BUY",
        price: 2024.5,
        entry: 2024.5,
        stopLoss: 2020.0,
        takeProfit: 2035.0,
        riskReward: 2.33,
        probability: 75,
        timestamp: new Date().toLocaleTimeString(),
        indicators: {
          rsi: 58.2,
          macd: 0.85,
          ema: 2022.3,
          trend: "Uptrend +0.35%",
          strength: 7.5,
        },
      },
      {
        id: (Date.now() + 1).toString(),
        symbol: "EUR/USD",
        type: "SELL",
        price: 1.0925,
        entry: 1.0925,
        stopLoss: 1.094,
        takeProfit: 1.0895,
        riskReward: 2.0,
        probability: 65,
        timestamp: new Date().toLocaleTimeString(),
        indicators: {
          rsi: 42.5,
          macd: -0.0015,
          ema: 1.093,
          trend: "Downtrend -0.15%",
          strength: 6.5,
        },
      },
    ]);

    // Uncomment below to use real data
    /*
    const signalPromises = TRADING_SYMBOLS.map(async (symbol) => {
      const marketData = await fetchMarketData(symbol);
      if (!marketData) {
        console.log(`No market data for ${symbol}`);
        return null;
      }
      const signal = calculateSignals(marketData, symbol);
      if (!signal) {
        console.log(`Could not calculate signals for ${symbol}`);
      }
      return signal;
    });

    const signals = (await Promise.all(signalPromises)).filter(Boolean);

    if (signals.length === 0) {
      console.log("No signals were generated");
    }

    return NextResponse.json(signals);
    */
  } catch (error) {
    console.error("Error generating signals:", error);
    return NextResponse.json(
      { error: "Failed to generate signals" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const data = await req.json();

  // Handle signal feedback
  if (data.type === "feedback") {
    return NextResponse.json({
      message: "Feedback received",
      status: "success",
    });
  }

  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}
