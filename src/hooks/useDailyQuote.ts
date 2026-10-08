import {useState, useCallback, useEffect, useRef} from 'react';
import {
  getDailyQuoteForToday,
  fetchAndSaveNewQuote,
} from '../services/QuoteService';
import {
  isQuoteSaved,
  saveQuote as saveQuoteToStorage,
  unsaveQuote,
} from '../storage/savedQuotesStorage';
import {saveQuoteToWidget} from '../native/QuoteWidget';
import type {Quote} from '../models/Quote';

type LoadState = 'idle' | 'loading' | 'refreshing' | 'error';

interface UseDailyQuoteResult {
  quote: Quote | null;
  loadState: LoadState;
  isSaved: boolean;
  errorMessage: string | null;
  loadDailyQuote: () => Promise<void>;
  refreshQuote: () => Promise<void>;
  toggleSave: () => Promise<void>;
}

export function useDailyQuote(): UseDailyQuoteResult {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loadState, setLoadState] = useState<LoadState>('idle');
  const [isSaved, setIsSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isRefreshing = useRef(false);
  const isLoadingRef = useRef(false);

  const checkSavedStatus = useCallback(async (q: Quote) => {
    try {
      const saved = await isQuoteSaved(q._id);
      setIsSaved(saved);
    } catch {
      setIsSaved(false);
    }
  }, []);

  const loadDailyQuote = useCallback(async () => {
    if (isLoadingRef.current) {
      return;
    }
    isLoadingRef.current = true;
    setLoadState('loading');
    setErrorMessage(null);
    try {
      const q = await getDailyQuoteForToday();
      setQuote(q);
      await checkSavedStatus(q);
      // Update native widget asynchronously without blocking UI thread
      saveQuoteToWidget(q._id, q.content, q.author).catch(() => {});
    } catch (err) {
      setErrorMessage('Unable to load quote. Please try again.');
      setLoadState('error');
      isLoadingRef.current = false;
      return;
    }
    setLoadState('idle');
    isLoadingRef.current = false;
  }, [checkSavedStatus]);

  const refreshQuote = useCallback(async () => {
    if (isRefreshing.current) {
      return;
    }
    isRefreshing.current = true;
    setLoadState('refreshing');
    setErrorMessage(null);
    try {
      const q = await fetchAndSaveNewQuote();
      setQuote(q);
      await checkSavedStatus(q);
      saveQuoteToWidget(q._id, q.content, q.author).catch(() => {});
    } catch (err) {
      setErrorMessage('Could not fetch a new quote. Check your connection.');
    } finally {
      setLoadState('idle');
      isRefreshing.current = false;
    }
  }, [checkSavedStatus]);

  const toggleSave = useCallback(async () => {
    if (!quote) {
      return;
    }
    try {
      if (isSaved) {
        await unsaveQuote(quote._id);
        setIsSaved(false);
      } else {
        await saveQuoteToStorage(quote);
        setIsSaved(true);
      }
    } catch {
      // silently ignore save errors
    }
  }, [quote, isSaved]);

  // Load on mount
  useEffect(() => {
    loadDailyQuote();
  }, [loadDailyQuote]);

  return {
    quote,
    loadState,
    isSaved,
    errorMessage,
    loadDailyQuote,
    refreshQuote,
    toggleSave,
  };
}
