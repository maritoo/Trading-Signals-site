"use client";

import { useState, useEffect } from "react";
import { getMarketData } from "@/lib/api-service";
import type { MarketData } from "@/types/market";

interface UseForexDataReturn {
  forexData: MarketData[];
  loading: boolean;
  error: string | null;
}

export function useForexData(): UseForexDataReturn {
  const [forexData, setForexData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    let isSubscribed = true;

    async function fetchData() {
      try {
        const data = await getMarketData();
        if (isSubscribed) {
          setForexData(data);
          setLoading(false);
        }
      } catch (err) {
        if (isSubscribed) {
          setError(
            err instanceof Error ? err.message : "Failed to fetch forex data"
          );
          setLoading(false);
        }
      }
    }

    fetchData();
    const intervalId = setInterval(fetchData, 5000); // Update every 5 seconds

    return () => {
      isSubscribed = false;
      clearInterval(intervalId);
    };
  }, [mounted]);

  return { forexData, loading, error };
}
