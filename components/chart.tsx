import { useEffect, useRef } from "react";

let tvScriptLoadingPromise: Promise<void>;

interface ChartProps {
  symbol?: string;
  theme?: string;
  selectedIndicators?: string[];
}

const SYMBOL_MAP: { [key: string]: string } = {
  "EURUSD=X": "FX:EURUSD",
  "XAUUSD=X": "OANDA:XAUUSD",
  GOLD: "OANDA:XAUUSD",
  "BTC-USD": "BINANCE:BTCUSDT",
  "GC=F": "OANDA:XAUUSD",
};

export function Chart({
  symbol = "XAUUSD=X",
  theme = "dark",
  selectedIndicators = [],
}: ChartProps) {
  const onLoadScriptRef = useRef<(() => void) | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onLoadScriptRef.current = createWidget;

    if (!tvScriptLoadingPromise) {
      tvScriptLoadingPromise = new Promise((resolve) => {
        const script = document.createElement("script");
        script.id = "tradingview-widget-loading-script";
        script.src = "https://s3.tradingview.com/tv.js";
        script.type = "text/javascript";
        script.onload = resolve;
        document.head.appendChild(script);
      });
    }

    tvScriptLoadingPromise.then(
      () => onLoadScriptRef.current && onLoadScriptRef.current()
    );

    return () => {
      onLoadScriptRef.current = null;
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [symbol, selectedIndicators]);

  function createWidget() {
    if (
      document.getElementById("tradingview-widget") &&
      "TradingView" in window
    ) {
      const tradingViewSymbol = SYMBOL_MAP[symbol] || symbol;

      const studies = selectedIndicators.map((indicator) => ({
        id: indicator,
        version: "1",
      }));

      new (window as any).TradingView.widget({
        autosize: true,
        symbol: tradingViewSymbol,
        interval: "1",
        timezone: "exchange",
        theme: theme,
        style: "1",
        locale: "en",
        toolbar_bg: "#1a1b2e",
        enable_publishing: false,
        hide_side_toolbar: false,
        allow_symbol_change: true,
        studies,
        container_id: "tradingview-widget",
        library_path: "/charting_library/",
        disabled_features: ["use_localstorage_for_settings"],
        enabled_features: ["study_templates"],
        charts_storage_url: "https://saveload.tradingview.com",
        client_id: "tradingview.com",
        user_id: "public_user",
        fullscreen: false,
        height: "100%",
        width: "100%",
      });
    }
  }

  return (
    <div className="relative w-full h-full min-h-[400px]">
      <div
        id="tradingview-widget"
        ref={containerRef}
        className="w-full h-full"
      />
    </div>
  );
}
