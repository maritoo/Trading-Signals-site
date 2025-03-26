"use client";

import { useState, useEffect } from "react";
import axios from "axios";

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

interface UseTechnicalAnalysisProps {
  symbol: string;
  interval: string;
  selectedIndicators: string[];
  enabled?: boolean;
}

export function useTechnicalAnalysis({
  symbol,
  interval,
  selectedIndicators,
  enabled = true,
}: UseTechnicalAnalysisProps) {
  const [analysis, setAnalysis] = useState<TechnicalAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    async function fetchAnalysis() {
      if (!enabled || !symbol || selectedIndicators.length === 0) return;

      setLoading(true);
      setError(null);

      try {
        const response = await axios.get("/api/technical-analysis", {
          params: {
            symbol,
            interval,
            indicators: selectedIndicators.join(","),
          },
        });

        if (mounted) {
          setAnalysis(response.data);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error ? err.message : "Failed to fetch analysis"
          );
          setLoading(false);
        }
      }
    }

    fetchAnalysis();

    // Refresh analysis every minute
    timeoutId = setInterval(fetchAnalysis, 60000);

    return () => {
      mounted = false;
      clearInterval(timeoutId);
    };
  }, [symbol, interval, selectedIndicators, enabled]);

  return { analysis, loading, error };
}
