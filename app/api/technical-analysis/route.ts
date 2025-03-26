import { NextResponse } from "next/server";
import axios from "axios";

const API_KEY = process.env.NEXT_PUBLIC_FOREX_API_KEY;
const API_URL = process.env.API_URL;

function formatNumber(
  value: number | null | undefined,
  decimals: number = 2
): string {
  if (value === null || value === undefined) return "0.00";
  return value.toFixed(decimals);
}

interface TechnicalIndicators {
  rsi?: number;
  macd?: {
    macd: number;
    signal: number;
    histogram: number;
  };
  sma?: number[];
  ema?: number[];
  support_resistance?: {
    support: number[];
    resistance: number[];
  };
}

interface TechnicalAnalysis {
  symbol: string;
  interval: string;
  indicators: TechnicalIndicators;
  signals: {
    type: "BUY" | "SELL" | "NEUTRAL";
    confidence: number;
    entry: number;
    stopLoss: number;
    takeProfit: number;
    reason: string[];
  };
}

async function fetchTechnicalData(
  symbol: string,
  interval: string,
  indicators: string[]
): Promise<TechnicalAnalysis> {
  const technicalData: TechnicalIndicators = {};

  // Fetch data for each selected indicator
  const promises = indicators.map(async (indicator) => {
    try {
      switch (indicator) {
        case "rsi":
          const rsiResponse = await axios.get(`${API_URL}/rsi`, {
            params: {
              symbol,
              interval,
              time_period: 14,
              apikey: API_KEY,
            },
          });
          technicalData.rsi = parseFloat(rsiResponse.data.values[0].rsi) || 0;
          break;

        case "macd":
          try {
            const macdResponse = await axios.get(`${API_URL}/macd`, {
              params: {
                symbol,
                interval,
                fast_period: 12,
                slow_period: 26,
                signal_period: 9,
                apikey: API_KEY,
              },
            });
            const macdData = macdResponse.data.values?.[0] || {};
            technicalData.macd = {
              macd: parseFloat(macdData.macd) || 0,
              signal: parseFloat(macdData.signal) || 0,
              histogram: parseFloat(macdData.histogram) || 0,
            };
          } catch (error) {
            console.error("Error fetching MACD:", error);
            technicalData.macd = {
              macd: 0,
              signal: 0,
              histogram: 0,
            };
          }
          break;

        case "ma":
          const [smaResponse, emaResponse] = await Promise.all([
            axios.get(`${API_URL}/sma`, {
              params: {
                symbol,
                interval,
                time_period: 20,
                apikey: API_KEY,
              },
            }),
            axios.get(`${API_URL}/ema`, {
              params: {
                symbol,
                interval,
                time_period: 20,
                apikey: API_KEY,
              },
            }),
          ]);
          technicalData.sma = smaResponse.data.values
            .slice(0, 5)
            .map((v: any) => parseFloat(v.sma) || 0);
          technicalData.ema = emaResponse.data.values
            .slice(0, 5)
            .map((v: any) => parseFloat(v.ema) || 0);
          break;
      }
    } catch (error) {
      console.error(`Error fetching ${indicator} data:`, error);
    }
  });

  await Promise.all(promises);

  // Get current price
  const priceResponse = await axios.get(`${API_URL}/price`, {
    params: {
      symbol,
      apikey: API_KEY,
    },
  });
  const currentPrice = parseFloat(priceResponse.data.price) || 0;

  // Generate trading signals based on indicators
  const signals = generateSignals(currentPrice, technicalData);

  return {
    symbol,
    interval,
    indicators: technicalData,
    signals,
  };
}

function generateSignals(
  currentPrice: number,
  indicators: TechnicalIndicators
) {
  const signals = {
    type: "NEUTRAL" as "BUY" | "SELL" | "NEUTRAL",
    confidence: 0,
    entry: currentPrice,
    stopLoss: currentPrice,
    takeProfit: currentPrice,
    reason: [] as string[],
  };

  let buySignals = 0;
  let sellSignals = 0;
  let totalSignals = 0;

  // RSI Analysis
  if (indicators.rsi !== undefined) {
    totalSignals++;
    if (indicators.rsi < 30) {
      buySignals++;
      signals.reason.push("RSI indicates oversold conditions");
    } else if (indicators.rsi > 70) {
      sellSignals++;
      signals.reason.push("RSI indicates overbought conditions");
    }
  }

  // MACD Analysis
  if (indicators.macd) {
    totalSignals++;
    if (
      indicators.macd.histogram > 0 &&
      indicators.macd.macd > indicators.macd.signal
    ) {
      buySignals++;
      signals.reason.push("MACD shows bullish momentum");
    } else if (
      indicators.macd.histogram < 0 &&
      indicators.macd.macd < indicators.macd.signal
    ) {
      sellSignals++;
      signals.reason.push("MACD shows bearish momentum");
    }
  }

  // Moving Averages Analysis
  if (
    indicators.sma &&
    indicators.ema &&
    indicators.sma.length > 0 &&
    indicators.ema.length > 0
  ) {
    totalSignals++;
    const sma = indicators.sma[0];
    const ema = indicators.ema[0];

    if (currentPrice > sma && currentPrice > ema) {
      buySignals++;
      signals.reason.push("Price above both SMA and EMA");
    } else if (currentPrice < sma && currentPrice < ema) {
      sellSignals++;
      signals.reason.push("Price below both SMA and EMA");
    }
  }

  // Calculate signal type and confidence
  if (totalSignals > 0) {
    const buyConfidence = (buySignals / totalSignals) * 100;
    const sellConfidence = (sellSignals / totalSignals) * 100;

    if (buyConfidence > sellConfidence && buyConfidence >= 50) {
      signals.type = "BUY";
      signals.confidence = buyConfidence;
      signals.stopLoss = currentPrice * 0.99; // 1% stop loss
      signals.takeProfit = currentPrice * 1.03; // 3% take profit
    } else if (sellConfidence > buyConfidence && sellConfidence >= 50) {
      signals.type = "SELL";
      signals.confidence = sellConfidence;
      signals.stopLoss = currentPrice * 1.01; // 1% stop loss
      signals.takeProfit = currentPrice * 0.97; // 3% take profit
    }
  }

  return signals;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol");
  const interval = searchParams.get("interval") || "1h";
  const indicators = searchParams.get("indicators")?.split(",") || [
    "rsi",
    "macd",
    "ma",
  ];

  if (!symbol) {
    return NextResponse.json({ error: "Symbol is required" }, { status: 400 });
  }

  try {
    const analysis = await fetchTechnicalData(symbol, interval, indicators);
    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Error in technical analysis:", error);
    return NextResponse.json(
      { error: "Failed to fetch technical analysis" },
      { status: 500 }
    );
  }
}
