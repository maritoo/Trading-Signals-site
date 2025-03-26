export interface NewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  sentiment: "positive" | "negative" | "neutral";
}

export interface NewsResponse {
  status: "success" | "error";
  data: {
    articles: NewsItem[];
  };
  error?: string;
}
