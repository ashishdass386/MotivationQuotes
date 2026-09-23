import type {Quote} from '../models/Quote';
import rawQuotes from '../data/quotes.json';

const ALL_QUOTES: Quote[] = rawQuotes as Quote[];

/**
 * Returns a random quote from the 2,127 LukePeavey Quotable dataset.
 * Optionally excludes recently shown quote IDs to prevent repetition.
 */
export async function getRandomQuote(excludeIds: string[] = []): Promise<Quote> {
  const excludeSet = new Set(excludeIds);
  let available = ALL_QUOTES.filter(q => !excludeSet.has(q._id));

  // If all quotes in the pool have been shown recently, fall back to the entire pool
  if (available.length === 0) {
    available = ALL_QUOTES;
  }

  const randomIndex = Math.floor(Math.random() * available.length);
  return available[randomIndex];
}

/**
 * Returns quotes filtered by tag (e.g., 'Inspirational', 'Success', 'Wisdom').
 */
export async function getQuotesByTag(tag: string): Promise<Quote[]> {
  const lower = tag.toLowerCase();
  return ALL_QUOTES.filter(
    q => q.tags && q.tags.some(t => t.toLowerCase().includes(lower)),
  );
}

/**
 * Searches quotes by author name or quote text.
 */
export async function searchQuotes(query: string): Promise<Quote[]> {
  const lower = query.toLowerCase();
  return ALL_QUOTES.filter(
    q =>
      q.author.toLowerCase().includes(lower) ||
      q.content.toLowerCase().includes(lower),
  );
}

/**
 * Total number of available quotes in the dataset.
 */
export function getTotalQuotesCount(): number {
  return ALL_QUOTES.length;
}

