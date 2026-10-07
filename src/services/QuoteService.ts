import {getRandomQuote} from '../api/quoteApi';
import {
  getDailyQuote,
  saveDailyQuote,
  getRecentQuoteIds,
  addRecentQuoteId,
} from '../storage/quoteStorage';
import {getTodayDateString, isToday} from '../utils/dateUtils';
import {getTodaysNotificationQuote} from '../native/DailyNotification';
import type {Quote, DailyQuoteRecord} from '../models/Quote';

let lastRequestTime = 0;
const REQUEST_COOLDOWN_MS = 600;

/**
 * Returns today's quote.
 * Checks cache first — only fetches a new quote if no valid cached quote exists for today.
 * Also checks if the 8:30 AM local notification delivered today's quote.
 */
export async function getDailyQuoteForToday(): Promise<Quote> {
  try {
    const cached = await getDailyQuote();
    if (cached && isToday(cached.quoteDate)) {
      return cached.quote;
    }
  } catch {
    // If cache read fails, continue
  }

  // Check if today's quote was already chosen and delivered by morning notification
  try {
    const notifQuote = await getTodaysNotificationQuote();
    if (notifQuote && notifQuote.content) {
      const quote: Quote = {
        _id: notifQuote.id || `daily-${notifQuote.date}`,
        content: notifQuote.content,
        author: notifQuote.author || 'Motiqo',
        tags: ['Inspirational'],
        length: notifQuote.content.length,
        dateAdded: notifQuote.date,
        dateModified: notifQuote.date,
      };
      const record: DailyQuoteRecord = {
        quote,
        quoteDate: getTodayDateString(),
        updatedAt: new Date().toISOString(),
      };
      await saveDailyQuote(record);
      return quote;
    }
  } catch {
    // Continue to standard fetch
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

