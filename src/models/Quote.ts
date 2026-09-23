export interface Quote {
  _id: string;
  content: string;
  author: string;
  tags?: string[];
  length?: number;
  dateAdded?: string;
  dateModified?: string;
}

export interface DailyQuoteRecord {
  quote: Quote;
  quoteDate: string; // YYYY-MM-DD
  updatedAt: string; // ISO timestamp
}
