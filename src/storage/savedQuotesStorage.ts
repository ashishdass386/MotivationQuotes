import AsyncStorage from '@react-native-async-storage/async-storage';
import type {Quote} from '../models/Quote';

const SAVED_QUOTES_KEY = '@motiva/saved_quotes';

let memorySavedQuotes: Quote[] | null = null;
let memorySavedIds: Set<string> | null = null;

function updateMemoryCache(quotes: Quote[]) {
  memorySavedQuotes = quotes;
  memorySavedIds = new Set(quotes.map(q => q._id));
}

export async function getSavedQuotes(): Promise<Quote[]> {
  if (memorySavedQuotes) {
    return memorySavedQuotes;
  }
  try {
    const raw = await AsyncStorage.getItem(SAVED_QUOTES_KEY);
    if (!raw) {
      updateMemoryCache([]);
      return [];
    }
    const parsed = JSON.parse(raw) as Quote[];
    updateMemoryCache(parsed);
    return parsed;
  } catch {
    updateMemoryCache([]);
    return [];
  }
}

export async function saveQuote(quote: Quote): Promise<Quote[]> {
  const existing = await getSavedQuotes();
  if (memorySavedIds && memorySavedIds.has(quote._id)) {
    return existing;
  }
  const updated = [quote, ...existing];
  updateMemoryCache(updated);
  AsyncStorage.setItem(SAVED_QUOTES_KEY, JSON.stringify(updated)).catch(() => {});
  return updated;
}

export async function unsaveQuote(quoteId: string): Promise<Quote[]> {
  const existing = await getSavedQuotes();
  const updated = existing.filter(q => q._id !== quoteId);
  updateMemoryCache(updated);
  AsyncStorage.setItem(SAVED_QUOTES_KEY, JSON.stringify(updated)).catch(() => {});
  return updated;
}

export async function isQuoteSaved(quoteId: string): Promise<boolean> {
  if (memorySavedIds) {
    return memorySavedIds.has(quoteId);
  }
  await getSavedQuotes();
  const currentIds = memorySavedIds as Set<string> | null;
  return currentIds ? currentIds.has(quoteId) : false;
}
