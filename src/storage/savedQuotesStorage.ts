import AsyncStorage from '@react-native-async-storage/async-storage';
import type {Quote} from '../models/Quote';

const SAVED_QUOTES_KEY = '@motiva/saved_quotes';

export async function getSavedQuotes(): Promise<Quote[]> {
  try {
    const raw = await AsyncStorage.getItem(SAVED_QUOTES_KEY);
    if (!raw) {
      return [];
    }
    return JSON.parse(raw) as Quote[];
  } catch {
    return [];
  }
}

export async function saveQuote(quote: Quote): Promise<Quote[]> {
  const existing = await getSavedQuotes();
  const alreadySaved = existing.some(q => q._id === quote._id);
  if (alreadySaved) {
    return existing;
  }
  const updated = [quote, ...existing];
  await AsyncStorage.setItem(SAVED_QUOTES_KEY, JSON.stringify(updated));
  return updated;
}

export async function unsaveQuote(quoteId: string): Promise<Quote[]> {
  const existing = await getSavedQuotes();
  const updated = existing.filter(q => q._id !== quoteId);
  await AsyncStorage.setItem(SAVED_QUOTES_KEY, JSON.stringify(updated));
  return updated;
}

export async function isQuoteSaved(quoteId: string): Promise<boolean> {
  const saved = await getSavedQuotes();
  return saved.some(q => q._id === quoteId);
}
