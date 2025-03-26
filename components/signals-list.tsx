"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { AlertCircle, TrendingUp, TrendingDown, Loader2 } from "lucide-react";

interface Signal {
  id: string;
  symbol: string;
  type: "BUY" | "SELL";
  price: number;
  entry: number;
  stopLoss: number;
  takeProfit: number;
  riskReward: number;
  probability: number;
  timestamp: string;
  indicators: {
    rsi: number;
    macd: number;
    ema: number;
    trend: string;
    strength: number;
  };
}

export function SignalsList() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastCheck, setLastCheck] = useState<string>(
    new Date().toLocaleTimeString()
  );

  const fetchSignals = async () => {
    try {
      const response = await fetch("/api/trading-signals");
      const data = await response.json();

      if (Array.isArray(data)) {
        setSignals(data);
        setError(null);
      } else {
        setError("Invalid response format");
      }
    } catch (error) {
      console.error("Error fetching signals:", error);
      setError("Failed to fetch trading signals");
    } finally {
      setLoading(false);
      setLastCheck(new Date().toLocaleTimeString());
    }
  };

  useEffect(() => {
    fetchSignals();
    const interval = setInterval(fetchSignals, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
        <div className="flex items-center gap-2 text-red-500">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (signals.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-400 mb-2">
          No trading signals available at the moment.
        </p>
        <p className="text-sm text-gray-500">Last check: {lastCheck}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {signals.map((signal) => (
        <Card key={signal.id} className="bg-[#1a1b2e] p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">{signal.symbol}</h3>
              <p className="text-sm text-gray-400">{signal.timestamp}</p>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                signal.type === "BUY"
                  ? "bg-green-500/20 text-green-500"
                  : "bg-red-500/20 text-red-500"
              }`}
            >
              {signal.type}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Entry Price</p>
              <p className="text-lg font-semibold text-white">
                ${signal.entry.toFixed(4)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Current Price</p>
              <p className="text-lg font-semibold text-white">
                ${signal.price.toFixed(4)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Stop Loss</p>
              <p className="text-lg font-semibold text-red-500">
                ${signal.stopLoss.toFixed(4)}
              </p>
              <p className="text-xs text-gray-500">
                Risk:{" "}
                {(
                  (Math.abs(signal.entry - signal.stopLoss) / signal.entry) *
                  100
                ).toFixed(2)}
                %
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Take Profit</p>
              <p className="text-lg font-semibold text-green-500">
                ${signal.takeProfit.toFixed(4)}
              </p>
              <p className="text-xs text-gray-500">
                Reward:{" "}
                {(
                  (Math.abs(signal.takeProfit - signal.entry) / signal.entry) *
                  100
                ).toFixed(2)}
                %
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Risk/Reward</p>
              <p className="text-base font-medium text-white">
                {signal.riskReward.toFixed(1)}:1
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Probability</p>
              <p className="text-base font-medium text-white">
                {signal.probability}%
              </p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-800">
            <h4 className="text-sm font-medium text-gray-400 mb-2">
              Technical Indicators
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">RSI</p>
                <p className="text-base font-medium text-white">
                  {signal.indicators.rsi.toFixed(1)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">MACD</p>
                <p className="text-base font-medium text-white">
                  {signal.indicators.macd.toFixed(4)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">EMA</p>
                <p className="text-base font-medium text-white">
                  {signal.indicators.ema.toFixed(4)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Trend</p>
                <p className="text-base font-medium text-white">
                  {signal.indicators.trend}
                </p>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
