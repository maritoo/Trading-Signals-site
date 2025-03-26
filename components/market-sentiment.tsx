"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Newspaper,
  Loader2,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getMarketNews } from "@/lib/api-service";
import type { NewsItem } from "@/types/news";

interface NewsState {
  loading: boolean;
  error: string | null;
  data: NewsItem[];
}

interface MarketSentiment {
  symbol: string;
  sentiment: "bullish" | "bearish" | "neutral";
  strength: number;
  signals: {
    technical: number;
    fundamental: number;
    news: number;
  };
}

export function MarketSentiment() {
  const [newsState, setNewsState] = useState<NewsState>({
    loading: true,
    error: null,
    data: [],
  });
  const [sentiments, setSentiments] = useState<MarketSentiment[]>([
    {
      symbol: "EUR/USD",
      sentiment: "bullish",
      strength: 75,
      signals: {
        technical: 80,
        fundamental: 70,
        news: 75,
      },
    },
    {
      symbol: "GOLD",
      sentiment: "neutral",
      strength: 50,
      signals: {
        technical: 45,
        fundamental: 55,
        news: 50,
      },
    },
    {
      symbol: "Bitcoin",
      sentiment: "bearish",
      strength: 30,
      signals: {
        technical: 25,
        fundamental: 35,
        news: 30,
      },
    },
  ]);

  useEffect(() => {
    let mounted = true;

    async function fetchNews() {
      if (!mounted) return;

      try {
        setNewsState((state) => ({ ...state, loading: true, error: null }));
        const articles = await getMarketNews();

        if (!mounted) return;

        const sentiments = articles.map((article) => article.sentiment);
        const positiveCount = sentiments.filter((s) => s === "positive").length;
        const negativeCount = sentiments.filter((s) => s === "negative").length;

        setSentiments((prevSentiments) =>
          prevSentiments.map((sentiment) => ({
            ...sentiment,
            sentiment:
              positiveCount > negativeCount
                ? "bullish"
                : negativeCount > positiveCount
                ? "bearish"
                : "neutral",
          }))
        );

        setNewsState({
          loading: false,
          error: null,
          data: articles.map((article) => ({
            ...article,
            id: crypto.randomUUID(),
          })),
        });
      } catch (error) {
        if (!mounted) return;
        setNewsState({
          loading: false,
          error: "Failed to fetch market news",
          data: [],
        });
      }
    }

    fetchNews();
    const intervalId = setInterval(fetchNews, 300000); // Update every 5 minutes

    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, []);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "bullish":
        return "text-green-500";
      case "bearish":
        return "text-red-500";
      default:
        return "text-yellow-500";
    }
  };

  const getStrengthColor = (strength: number) => {
    if (strength >= 70) return "bg-green-500";
    if (strength <= 30) return "bg-red-500";
    return "bg-yellow-500";
  };

  const getStrengthClass = (strength: number) => {
    if (strength >= 70) return "strength-bar-fill-high";
    if (strength <= 30) return "strength-bar-fill-low";
    return "strength-bar-fill-medium";
  };

  const getSentimentClass = (sentiment: string) => {
    return `sentiment-value sentiment-value-${sentiment}`;
  };

  const getStrengthWidthClass = (strength: number) => {
    // Round to nearest 5
    const roundedStrength = Math.round(strength / 5) * 5;
    return `strength-width-${roundedStrength}`;
  };

  if (newsState.loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <Loader2 className="loading-spinner" />
          <p className="loading-text">Loading market sentiment...</p>
        </div>
      </div>
    );
  }

  if (newsState.error) {
    return (
      <Alert variant="destructive" className="error-alert">
        <AlertDescription className="error-message">
          {newsState.error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {sentiments.map((item) => (
        <div key={item.symbol} className="sentiment-card">
          <div className="sentiment-header">
            <h3 className="sentiment-title">{item.symbol}</h3>
            <span className={getSentimentClass(item.sentiment)}>
              {item.sentiment}
            </span>
          </div>

          <div className="sentiment-content">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-400">Overall Strength</span>
                <span className="text-sm text-white">{item.strength}%</span>
              </div>
              <div className="strength-bar">
                <div
                  className={`strength-bar-fill ${getStrengthClass(
                    item.strength
                  )} ${getStrengthWidthClass(item.strength)}`}
                />
              </div>
            </div>

            <div className="sentiment-signals">
              {Object.entries(item.signals).map(([type, value]) => (
                <div key={`${item.symbol}-${type}`} className="signal-item">
                  <div className="signal-label">{type}</div>
                  <div className="signal-value">{value}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
