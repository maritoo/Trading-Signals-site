import { NextResponse } from "next/server";
import axios from "axios";

const API_KEY = process.env.NEXT_PUBLIC_FOREX_API_KEY;
const API_URL = process.env.API_URL;

interface ForexData {
  symbol: string;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbols = searchParams.get("symbols")?.split(",") || [];

  if (symbols.length === 0) {
    return NextResponse.json({ error: "No symbols provided" }, { status: 400 });
  }

  try {
    const forexData: ForexData[] = await Promise.all(
      symbols.map(async (symbol) => {
        try {
          // Get current price
          const priceResponse = await axios.get(`${API_URL}/price`, {
            params: {
              symbol,
              apikey: API_KEY,
            },
          });

          // Get 24h data
          const dailyResponse = await axios.get(`${API_URL}/daily`, {
            params: {
              symbol,
              apikey: API_KEY,
            },
          });

          const price = parseFloat(priceResponse.data.price) || 0;
          const dailyData = dailyResponse.data.values?.[0] || {};
          const prevClose = parseFloat(dailyData.close) || price;

          return {
            symbol,
            price,
            change24h: ((price - prevClose) / prevClose) * 100,
            high24h: parseFloat(dailyData.high) || price,
            low24h: parseFloat(dailyData.low) || price,
            volume24h: parseFloat(dailyData.volume) || 0,
          };
        } catch (error) {
          console.error(`Error fetching data for ${symbol}:`, error);
          return {
            symbol,
            price: 0,
            change24h: 0,
            high24h: 0,
            low24h: 0,
            volume24h: 0,
          };
        }
      })
    );

    return NextResponse.json(forexData);
  } catch (error) {
    console.error("Error fetching forex data:", error);
    return NextResponse.json(
      { error: "Failed to fetch forex data" },
      { status: 500 }
    );
  }
}
