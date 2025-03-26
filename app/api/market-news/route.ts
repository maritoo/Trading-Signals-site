import { NextResponse } from "next/server";
import axios from "axios";

const NEWS_RSS_URL =
  "https://feeds.finance.yahoo.com/rss/2.0/headline?s=EURUSD=X,XAUUSD=X,BTCUSD=X,GBPUSD=X,USDJPY=X&region=US&lang=en-US";

export async function GET() {
  try {
    const response = await axios.get(NEWS_RSS_URL);
    const xmlData = response.data;

    // Parse RSS feed
    const articles =
      xmlData.match(/<item>[\s\S]*?<\/item>/g)?.map((item: string) => {
        const title = item.match(/<title>(.*?)<\/title>/)?.[1] || "";
        const description =
          item.match(/<description>(.*?)<\/description>/)?.[1] || "";
        const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || "";
        const link = item.match(/<link>(.*?)<\/link>/)?.[1] || "";

        // Simple sentiment analysis
        const text = (title + " " + description).toLowerCase();
        const positiveWords = [
          "up",
          "rise",
          "gain",
          "bull",
          "positive",
          "growth",
          "surge",
          "rally",
          "recover",
        ];
        const negativeWords = [
          "down",
          "fall",
          "drop",
          "bear",
          "negative",
          "decline",
          "crash",
          "plunge",
          "loss",
        ];

        const positiveCount = positiveWords.filter((word) =>
          text.includes(word)
        ).length;
        const negativeCount = negativeWords.filter((word) =>
          text.includes(word)
        ).length;

        let sentiment = "neutral";
        if (positiveCount > negativeCount) sentiment = "positive";
        if (negativeCount > positiveCount) sentiment = "negative";

        return {
          title: title.replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1"),
          description: description.replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1"),
          publishedAt: new Date(pubDate).toISOString(),
          sentiment,
          source: "Yahoo Finance",
          url: link,
        };
      }) || [];

    if (!articles || articles.length === 0) {
      console.warn("No articles found in the RSS feed");
      return NextResponse.json([]);
    }

    return NextResponse.json(articles.slice(0, 10));
  } catch (error: any) {
    console.error(
      "Error fetching news:",
      error.response?.data || error.message
    );
    return NextResponse.json(
      {
        error: "Failed to fetch market news",
        details: error.response?.data || error.message,
      },
      { status: 500 }
    );
  }
}
