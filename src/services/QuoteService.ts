import {getRandomQuote} from '../api/quoteApi';
import {
  getDailyQuote,
  saveDailyQuote,
  getRecentQuoteIds,
  addRecentQuoteId,
} from '../storage/quoteStorage';
import {getTodayDateString, isToday} from '../utils/dateUtils';
import type {Quote, DailyQuoteRecord} from '../models/Quote';

let lastRequestTime = 0;
const REQUEST_COOLDOWN_MS = 600;

/**
 * Returns today's quote.
 * Checks cache first — only fetches a new quote if no valid cached quote exists for today.
 */
export async function getDailyQuoteForToday(): Promise<Quote> {
  try {
    const cached = await getDailyQuote();
    if (cached && isToday(cached.quoteDate)) {
      return cached.quote;
    }
  } catch {
    // If cache read fails, continue to fetch
  }

  return fetchAndSaveNewQuote();
}

/**
 * Generates a fresh quote from the 2,127 LukePeavey Quotable dataset,
 * ensuring no repetition from recent quotes history, and updates local storage.
 */
export async function fetchAndSaveNewQuote(): Promise<Quote> {
  const now = Date.now();
  if (now - lastRequestTime < REQUEST_COOLDOWN_MS) {
    const cached = await getDailyQuote();
    if (cached) {
      return cached.quote;
    }
  }

  lastRequestTime = now;

  try {
    const recentIds = await getRecentQuoteIds();
    const quote = await getRandomQuote(recentIds);
    await addRecentQuoteId(quote._id);

    const record: DailyQuoteRecord = {
      quote,
      quoteDate: getTodayDateString(),
      updatedAt: new Date().toISOString(),
    };
    await saveDailyQuote(record);
    return quote;
  } catch {
    // If any error occurs, fall back to a random quote from the dataset
    const fallbackQuote = await getRandomQuote();
    return fallbackQuote;
  }
}

