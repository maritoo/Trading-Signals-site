"use client";

import { useState } from "react";
import { MetaTraderChart } from "@/components/metatrader-chart";
import { SignalsList } from "@/components/signals-list";
import { Checkbox } from "@/components/ui/checkbox";

const INDICATORS = [
  { id: "RSI", label: "RSI" },
  { id: "MACD", label: "MACD" },
  { id: "EMA", label: "EMA" },
  { id: "OrderBlock", label: "Order Block Finder" },
  { id: "LiquidityPool", label: "Liquidity Pool Tracker" },
  { id: "SMC", label: "Smart Money Concepts" },
  { id: "FVG", label: "Fair Value Gap" },
  { id: "CompositeDivergence", label: "Composite Divergence" },
  { id: "TradingSystem", label: "All-in-One Trading System" },
  { id: "MTFSignal", label: "Multi-Time Frame Signals" },
  { id: "AdaptiveTrend", label: "Adaptive Trend & Momentum" },
  { id: "VolumeProfile", label: "Volume Profile" },
  { id: "SuperTrend", label: "SuperTrend Combo" },
  { id: "OrderFlow", label: "Market Structure & Order Flow" },
  { id: "PriceAction", label: "Price Action Zones" },
  { id: "TrendStrength", label: "Trend Strength" },
  { id: "Dashboard", label: "Multi-Indicator Dashboard" },
  { id: "PivotPoints", label: "Custom Pivot Points" },
];

export default function TradingSignalsPage() {
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>([]);

  const handleIndicatorChange = (indicatorId: string) => {
    setSelectedIndicators((prev) => {
      if (prev.includes(indicatorId)) {
        return prev.filter((id) => id !== indicatorId);
      }
      return [...prev, indicatorId];
    });
  };

  return (
    <div className="min-h-screen bg-[#1a1b2e] w-full text-white">
      <div className="container mx-auto px-4 py-6 max-w-[1400px] h-screen">
        <div className="trading-signals-box">
          <div className="trading-signals-header">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight mb-2">
              Trading Signals
            </h1>
            <p className="text-base sm:text-lg text-gray-400">
              Real-time trading signals with technical indicators
            </p>
          </div>

          <div className="trading-signals-content">
            <div className="trading-signals-grid">
              <div className="flex flex-col min-h-0">
                <div className="bg-[#2a2c42] rounded-lg p-4 md:p-6 flex-1">
                  <div className="mb-4">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4">
                      Price Chart
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {INDICATORS.map((indicator) => (
                        <div
                          key={indicator.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={indicator.id}
                            checked={selectedIndicators.includes(indicator.id)}
                            onCheckedChange={() =>
                              handleIndicatorChange(indicator.id)
                            }
                          />
                          <label
                            htmlFor={indicator.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {indicator.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="h-[600px]">
                    <MetaTraderChart selectedIndicators={selectedIndicators} />
                  </div>
                </div>
              </div>

              <div className="bg-[#2a2c42] rounded-lg p-4 md:p-6 overflow-y-auto">
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4">
                  Active Signals
                </h2>
                <div className="w-full">
                  <SignalsList />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
