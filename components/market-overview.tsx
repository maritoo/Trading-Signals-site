"use client";

import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getMarketData } from "@/lib/api-service";

interface MarketData {
  current: number;
  dayHigh: number;
  dayLow: number;
  volume: number;
  changePercent: number;
}

interface MarketOverviewProps {
  symbols: string[];
}

export function MarketOverview({ symbols }: MarketOverviewProps) {
  const [marketData, setMarketData] = useState<Record<string, MarketData>>({});
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fetchMarketData = async (symbol: string) => {
    try {
      const response = await fetch(`/api/yahoo-finance?symbol=${symbol}`);
      const data = await response.json();

      if (data.status === "success") {
        setMarketData((prev) => ({
          ...prev,
          [symbol]: {
            current: data.data.price.current,
            dayHigh: data.data.price.dayHigh,
            dayLow: data.data.price.dayLow,
            volume: data.data.price.volume,
            changePercent: data.data.price.change || 0,
          },
        }));
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[symbol];
          return newErrors;
        });
      } else {
        setErrors((prev) => ({
          ...prev,
          [symbol]: data.message || "Failed to fetch data",
        }));
      }
    } catch (error) {
      console.error(`Error fetching data for ${symbol}:`, error);
      setErrors((prev) => ({
        ...prev,
        [symbol]: "Failed to fetch data",
      }));
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      await Promise.all(symbols.map((symbol) => fetchMarketData(symbol)));
      setLoading(false);
    };

    fetchAllData();
    const interval = setInterval(fetchAllData, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [symbols]);

  const formatNumber = (num: number) => {
    if (isNaN(num)) return "0.00";
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const formatVolume = (vol: number) => {
    if (!vol || isNaN(vol)) return "0";
    if (vol >= 1000000) {
      return `${(vol / 1000000).toFixed(1)}M`;
    }
    if (vol >= 1000) {
      return `${(vol / 1000).toFixed(1)}K`;
    }
    return vol.toString();
  };

  const getSymbolDisplay = (symbol: string) => {
    switch (symbol) {
      case "EURUSD=X":
        return "EUR/USD";
      case "XAUUSD=X":
        return "GOLD";
      case "BTC-USD":
        return "Bitcoin";
      case "GC=F":
        return "GOLD";
      default:
        return symbol;
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {symbols.map((symbol) => (
          <div
            key={symbol}
            className="bg-[#1a1b2e] rounded-lg p-4 animate-pulse"
          >
            <div className="h-6 w-24 bg-gray-700 rounded mb-4" />
            <div className="h-8 w-32 bg-gray-700 rounded mb-2" />
            <div className="h-4 w-20 bg-gray-700 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {symbols.map((symbol) => {
        const data = marketData[symbol];
        const error = errors[symbol];

        if (error) {
          return (
            <div
              key={symbol}
              className="bg-[#1a1b2e] rounded-lg p-4 border border-red-500/50"
            >
              <div className="flex items-center gap-2 text-red-500">
                <AlertCircle className="w-5 h-5" />
                <h3 className="text-lg font-semibold">
                  {getSymbolDisplay(symbol)}
                </h3>
              </div>
              <p className="text-sm text-red-400 mt-2">{error}</p>
            </div>
          );
        }

        if (!data) return null;

        const isPositive = data.changePercent >= 0;
        const changeColor = isPositive ? "text-green-500" : "text-red-500";
        const changeIcon = isPositive ? "↑" : "↓";

        return (
          <div
            key={symbol}
            className="bg-[#1a1b2e] rounded-lg p-4 hover:bg-[#2a2c42] transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-white">
                {getSymbolDisplay(symbol)}
              </h3>
              <span
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${changeColor}`}
              >
                {changeIcon} {Math.abs(data.changePercent || 0).toFixed(2)}%
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-3xl font-bold text-white">
                  ${formatNumber(data.current)}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-400">24h Volume</p>
                <p className="text-sm font-medium text-white">
                  {formatVolume(data.volume)}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-400">24h High</p>
                <p className="text-sm font-medium text-white">
                  ${formatNumber(data.dayHigh)}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-400">24h Low</p>
                <p className="text-sm font-medium text-white">
                  ${formatNumber(data.dayLow)}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
