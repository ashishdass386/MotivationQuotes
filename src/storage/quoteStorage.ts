import AsyncStorage from '@react-native-async-storage/async-storage';
import type {DailyQuoteRecord} from '../models/Quote';

const DAILY_QUOTE_KEY = '@motiva/daily_quote';

let memoryQuoteRecord: DailyQuoteRecord | null = null;

export async function saveDailyQuote(record: DailyQuoteRecord): Promise<void> {
  memoryQuoteRecord = record;
  await AsyncStorage.setItem(DAILY_QUOTE_KEY, JSON.stringify(record));
}

export async function getDailyQuote(): Promise<DailyQuoteRecord | null> {
  if (memoryQuoteRecord) {
    return memoryQuoteRecord;
  }
  try {
    const raw = await AsyncStorage.getItem(DAILY_QUOTE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as DailyQuoteRecord;
    memoryQuoteRecord = parsed;
    return parsed;
  } catch {
    return null;
  }
}

export async function clearDailyQuote(): Promise<void> {
  memoryQuoteRecord = null;
  await AsyncStorage.removeItem(DAILY_QUOTE_KEY);
}

const RECENT_QUOTE_IDS_KEY = '@motiva/recent_quote_ids';
const MAX_RECENT_HISTORY = 100;

export async function getRecentQuoteIds(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(RECENT_QUOTE_IDS_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export async function addRecentQuoteId(id: string): Promise<void> {
  try {
    const ids = await getRecentQuoteIds();
    const updated = [id, ...ids.filter(item => item !== id)].slice(
      0,
      MAX_RECENT_HISTORY,
    );
    await AsyncStorage.setItem(RECENT_QUOTE_IDS_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage write error
  }
}

