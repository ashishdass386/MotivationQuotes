import type {Quote} from '../models/Quote';
import rawQuotes from '../data/quotes.json';

const ALL_QUOTES: Quote[] = rawQuotes as Quote[];
const TOTAL_COUNT = ALL_QUOTES.length;

/**
 * Returns a random quote from the 2,127 LukePeavey Quotable dataset.
 * Optimized for 0-allocation random sampling.
 */
export async function getRandomQuote(excludeIds: string[] = []): Promise<Quote> {
  if (TOTAL_COUNT === 0) {
    throw new Error('Quote database is empty');
  }

  if (!excludeIds || excludeIds.length === 0) {
    const randomIndex = Math.floor(Math.random() * TOTAL_COUNT);
    return ALL_QUOTES[randomIndex];
  }

  const excludeSet = new Set(excludeIds);

  // Fast O(1) probe sampling: avoid allocating large filtered arrays
  // Since excludeIds is small (<50) and dataset has 2,127 quotes, probability of collision is < 2.5%
  for (let attempt = 0; attempt < 25; attempt++) {
    const randomIndex = Math.floor(Math.random() * TOTAL_COUNT);
    const candidate = ALL_QUOTES[randomIndex];
    if (!excludeSet.has(candidate._id)) {
      return candidate;
    }
  }

  // Fallback in the rare case all attempts hit excluded quotes or large exclusion list
  const available = ALL_QUOTES.filter(q => !excludeSet.has(q._id));
  if (available.length === 0) {
    const randomIndex = Math.floor(Math.random() * TOTAL_COUNT);
    return ALL_QUOTES[randomIndex];
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
  return TOTAL_COUNT;
}
