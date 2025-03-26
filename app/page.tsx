"use client";

import { MarketOverview } from "@/components/market-overview";
import { SignalsList } from "@/components/signals-list";
import { Chart } from "@/components/chart";
import { MarketSentiment } from "@/components/market-sentiment";
import { useState } from "react";

const SYMBOLS = ["EURUSD=X", "XAUUSD=X", "BTC-USD"];
const AVAILABLE_INDICATORS = [
  "RSI",
  "MACD",
  "EMA",
  "OrderBlock",
  "LiquidityPool",
  "SMC",
  "FVG",
  "CompositeDivergence",
  "TradingSystem",
  "MTFSignal",
  "AdaptiveTrend",
  "VolumeProfile",
  "SuperTrend",
  "OrderFlow",
  "PriceAction",
  "TrendStrength",
  "Dashboard",
  "PivotPoints",
];

export default function DashboardPage() {
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState("XAUUSD=X");

  const toggleIndicator = (indicator: string) => {
    setSelectedIndicators((prev) =>
      prev.includes(indicator)
        ? prev.filter((i) => i !== indicator)
        : [...prev, indicator]
    );
  };

  return (
    <div className="min-h-screen bg-[#1a1b2e] w-full text-white">
      <div className="container mx-auto px-4 py-6 max-w-[1400px]">
        {/* Header */}
        <div className="bg-[#2a2c42] rounded-lg p-4 md:p-6 mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight mb-2">
            Trading Dashboard
          </h1>
          <p className="text-base sm:text-lg text-gray-400">
            Real-time market data and trading signals
          </p>
        </div>

        {/* Market Overview */}
        <div className="bg-[#2a2c42] rounded-lg p-4 md:p-6 mb-6">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4">
            Market Overview
          </h2>
          <div className="w-full">
            <MarketOverview symbols={SYMBOLS} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Chart */}
            <div className="bg-[#2a2c42] rounded-lg p-4 md:p-6">
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4">
                Price Chart
              </h2>
              <div className="mb-4">
                <label htmlFor="symbol-select" className="sr-only">
                  Select Market
                </label>
                <select
                  id="symbol-select"
                  value={selectedSymbol}
                  onChange={(e) => setSelectedSymbol(e.target.value)}
                  className="bg-[#1a1b2e] text-white border border-gray-600 rounded-lg px-3 py-2 w-full md:w-auto"
                  aria-label="Select Market"
                >
                  <option value="XAUUSD=X">Gold (XAU/USD)</option>
                  <option value="EURUSD=X">EUR/USD</option>
                  <option value="BTC-USD">Bitcoin</option>
                </select>
              </div>
              <div className="w-full h-[400px] md:h-[500px]">
                <Chart
                  symbol={selectedSymbol}
                  selectedIndicators={selectedIndicators}
                />
              </div>
            </div>

            {/* Market Sentiment */}
            <div className="bg-[#2a2c42] rounded-lg p-4 md:p-6">
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4">
                Market Sentiment
              </h2>
              <div className="w-full">
                <MarketSentiment />
              </div>
            </div>
          </div>

          {/* Right Column - Signals */}
          <div className="bg-[#2a2c42] rounded-lg p-4 md:p-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4">
              Trading Signals
            </h2>
            <div className="w-full">
              <div className="max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
                <SignalsList />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Available Indicators</h2>
          <div className="flex flex-wrap gap-4 mb-4">
            {AVAILABLE_INDICATORS.map((indicator) => (
              <button
                key={indicator}
                onClick={() => toggleIndicator(indicator)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedIndicators.includes(indicator)
                    ? "bg-blue-500 text-white"
                    : "bg-[#1a1b2e] text-gray-400 hover:bg-blue-500/20"
                }`}
              >
                {indicator}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
