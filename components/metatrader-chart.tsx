"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    TradingView: any;
  }
}

interface MetaTraderChartProps {
  selectedIndicators: string[];
}

const TRADING_SYMBOLS = [
  { value: "EURUSD", label: "EUR/USD", type: "Forex" },
  { value: "GBPUSD", label: "GBP/USD", type: "Forex" },
  { value: "USDJPY", label: "USD/JPY", type: "Forex" },
  { value: "XAUUSD", label: "Gold", type: "Metals" },
  { value: "XAGUSD", label: "Silver", type: "Metals" },
  { value: "USOIL", label: "Crude Oil", type: "Commodities" },
  { value: "BTCUSD", label: "Bitcoin", type: "Crypto" },
  { value: "ETHUSD", label: "Ethereum", type: "Crypto" },
];

export function MetaTraderChart({
  selectedIndicators = [],
}: MetaTraderChartProps) {
  const container = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);
  const [symbol, setSymbol] = useState(TRADING_SYMBOLS[0].value);
  const [signalData, setSignalData] = useState({
    price: 0,
    entry: 0,
    stopLoss: 0,
    takeProfit: 0,
    direction: "BUY",
    timestamp: "",
  });

  const handleSymbolChange = (newSymbol: string) => {
    setSymbol(newSymbol);
  };

  const convertToTradingViewSymbol = (yahooSymbol: string) => {
    // Remove =X suffix and convert to TradingView format
    return yahooSymbol.replace("=X", "");
  };

  const fetchYahooData = async () => {
    try {
      // Use the Yahoo Finance format for API call
      const yahooSymbol = symbol + "=X";
      const response = await fetch(`/api/yahoo-finance?symbol=${yahooSymbol}`);
      const data = await response.json();
      if (data.status === "success" && Array.isArray(data.data.history)) {
        return data.data.history.map((bar: any) => ({
          time: bar.time * 1000, // Convert to milliseconds
          open: parseFloat(bar.open),
          high: parseFloat(bar.high),
          low: parseFloat(bar.low),
          close: parseFloat(bar.close),
          volume: parseInt(bar.volume),
        }));
      }
      return [];
    } catch (error) {
      console.error("Error fetching Yahoo Finance data:", error);
      return [];
    }
  };

  useEffect(() => {
    let scriptElement: HTMLScriptElement | null = null;
    let cleanupInterval: NodeJS.Timeout | null = null;

    const initializeWidget = () => {
      if (!window.TradingView || !container.current?.id) return;

      const studies = selectedIndicators
        .map((indicator) => {
          switch (indicator) {
            case "RSI":
              return ["RSI@tv-basicstudies", false, false, [14]];
            case "MACD":
              return ["MACD@tv-basicstudies", false, false, [12, 26, 9]];
            case "EMA":
              return [
                "Moving Average Exponential@tv-basicstudies",
                false,
                false,
                [20],
              ];
            case "OrderBlock":
              return ["Volume Profile@tv-volumebyprice", false, false];
            case "LiquidityPool":
              return ["Volume@tv-basicstudies", false, false];
            case "SMC":
              return [
                "Market Facilitation Index@tv-basicstudies",
                false,
                false,
              ];
            case "FVG":
              return ["Price Gaps@tv-basicstudies", false, false];
            case "CompositeDivergence":
              return ["Stochastic RSI@tv-basicstudies", false, false];
            case "TradingSystem":
              return ["Supertrend@tv-basicstudies", false, false];
            case "MTFSignal":
              return ["Moving Average Cross@tv-basicstudies", false, false];
            case "AdaptiveTrend":
              return ["ADX@tv-basicstudies", false, false, [14]];
            case "VolumeProfile":
              return ["Volume Profile@tv-volumebyprice", false, false];
            case "SuperTrend":
              return ["Supertrend@tv-basicstudies", false, false];
            case "OrderFlow":
              return ["Volume@tv-basicstudies", false, false];
            case "PriceAction":
              return ["Price Oscillator@tv-basicstudies", false, false];
            case "TrendStrength":
              return ["ADX@tv-basicstudies", false, false, [14]];
            case "Dashboard":
              return ["Technical Ratings@tv-basicstudies", false, false];
            case "PivotPoints":
              return ["Pivot Points Standard@tv-basicstudies", false, false];
            default:
              return null;
          }
        })
        .filter(Boolean);

      const feed = {
        onReady: (callback: any) => {
          callback({
            supported_resolutions: ["1", "5", "15", "30", "60", "D", "W", "M"],
            exchanges: [{ value: "", name: "All Exchanges", desc: "" }],
            symbols_types: [{ name: "forex", value: "forex" }],
          });
        },
        resolveSymbol: (
          symbolName: string,
          onSymbolResolvedCallback: any,
          onResolveErrorCallback: any
        ) => {
          onSymbolResolvedCallback({
            name: symbolName,
            full_name: symbolName,
            description: symbolName,
            type: "forex",
            session: "24x7",
            timezone: "UTC",
            ticker: symbolName,
            minmov: 1,
            pricescale: 100000,
            has_intraday: true,
            has_daily: true,
            has_weekly_and_monthly: true,
            supported_resolutions: ["1", "5", "15", "30", "60", "D", "W", "M"],
            volume_precision: 0,
            data_status: "streaming",
          });
        },
        getBars: async (
          symbolInfo: any,
          resolution: any,
          periodParams: any,
          onHistoryCallback: any,
          onErrorCallback: any
        ) => {
          try {
            const data = await fetchYahooData();
            if (data.length === 0) {
              onHistoryCallback([], { noData: true });
              return;
            }
            onHistoryCallback(data, { noData: false });
          } catch (error) {
            onErrorCallback(error);
          }
        },
        subscribeBars: (
          symbolInfo: any,
          resolution: any,
          onRealtimeCallback: any,
          subscriberUID: any,
          onResetCacheNeededCallback: any
        ) => {
          cleanupInterval = setInterval(async () => {
            const data = await fetchYahooData();
            if (data.length > 0) {
              const lastBar = data[data.length - 1];
              onRealtimeCallback(lastBar);

              // Calculate signal data
              const currentPrice = lastBar.close;
              const direction = lastBar.close > lastBar.open ? "BUY" : "SELL";
              const volatility = Math.abs(lastBar.high - lastBar.low);

              setSignalData({
                price: currentPrice,
                entry: currentPrice,
                stopLoss:
                  direction === "BUY"
                    ? currentPrice - volatility * 1.5
                    : currentPrice + volatility * 1.5,
                takeProfit:
                  direction === "BUY"
                    ? currentPrice + volatility * 2.5
                    : currentPrice - volatility * 2.5,
                direction: direction,
                timestamp: new Date(lastBar.time).toLocaleTimeString(),
              });
            }
          }, 1000);
        },
        unsubscribeBars: (subscriberUID: any) => {
          if (cleanupInterval) {
            clearInterval(cleanupInterval);
          }
        },
      };

      widgetRef.current = new window.TradingView.widget({
        container_id: container.current.id,
        autosize: true,
        symbol: "FX:" + symbol,
        interval: "1",
        timezone: "UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        toolbar_bg: "#1a1b2e",
        enable_publishing: false,
        hide_side_toolbar: false,
        allow_symbol_change: true,
        save_image: false,
        hideideas: true,
        studies: studies,
        studies_overrides: {
          "volume.volume.color.0": "rgba(0, 255, 0, 0.3)",
          "volume.volume.color.1": "rgba(255, 0, 0, 0.3)",
        },
        overrides: {
          "mainSeriesProperties.style": 1,
          "mainSeriesProperties.visible": true,
          "paneProperties.background": "#1a1b2e",
          "paneProperties.vertGridProperties.color": "#242538",
          "paneProperties.horzGridProperties.color": "#242538",
          "symbolWatermarkProperties.transparency": 90,
          "scalesProperties.textColor": "#AAA",
          "mainSeriesProperties.candleStyle.upColor": "#26a69a",
          "mainSeriesProperties.candleStyle.downColor": "#ef5350",
          "mainSeriesProperties.candleStyle.wickUpColor": "#26a69a",
          "mainSeriesProperties.candleStyle.wickDownColor": "#ef5350",
        },
        loading_screen: { backgroundColor: "#1a1b2e" },
        datafeed: feed,
        library_path: "https://s3.tradingview.com/tv.js",
      });
    };

    scriptElement = document.createElement("script");
    scriptElement.src = "https://s3.tradingview.com/tv.js";
    scriptElement.async = true;
    scriptElement.onload = initializeWidget;
    document.head.appendChild(scriptElement);

    return () => {
      if (cleanupInterval) {
        clearInterval(cleanupInterval);
      }

      if (container.current) {
        container.current.innerHTML = "";
      }

      if (scriptElement && document.head.contains(scriptElement)) {
        document.head.removeChild(scriptElement);
      }

      const scripts = document.querySelectorAll(
        'script[src*="tradingview.com"]'
      );
      scripts.forEach((s) => {
        if (document.head.contains(s)) {
          document.head.removeChild(s);
        }
      });
    };
  }, [selectedIndicators, symbol]);

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center space-x-4 p-4 bg-[#1a1b2e] rounded-lg">
        <select
          value={symbol}
          onChange={(e) => handleSymbolChange(e.target.value)}
          className="bg-[#2a2c42] text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Select trading symbol"
        >
          {TRADING_SYMBOLS.map((sym) => (
            <option key={sym.value} value={sym.value}>
              {sym.label} ({sym.type})
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1 min-h-0">
        <div
          id="tv_chart_container"
          ref={container}
          className="w-full h-full rounded-lg overflow-hidden"
        />
      </div>
      <div className="p-4 bg-[#1a1b2e] rounded-lg">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Signal Details
            </h3>
            <div className="space-y-2">
              <p className="text-gray-300">
                Current Price:{" "}
                <span className="text-white">
                  ${signalData.price.toFixed(5)}
                </span>
              </p>
              <p className="text-gray-300">
                Direction:{" "}
                <span
                  className={
                    signalData.direction === "BUY"
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  {signalData.direction}
                </span>
              </p>
              <p className="text-gray-300">
                Entry Point:{" "}
                <span className="text-white">
                  ${signalData.entry.toFixed(5)}
                </span>
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Risk Management
            </h3>
            <div className="space-y-2">
              <p className="text-gray-300">
                Stop Loss:{" "}
                <span className="text-red-500">
                  ${signalData.stopLoss.toFixed(5)}
                </span>
              </p>
              <p className="text-gray-300">
                Take Profit:{" "}
                <span className="text-green-500">
                  ${signalData.takeProfit.toFixed(5)}
                </span>
              </p>
              <p className="text-gray-300">
                Time: <span className="text-white">{signalData.timestamp}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
