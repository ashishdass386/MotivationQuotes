import {NativeModules} from 'react-native';

interface QuoteWidgetModuleType {
  saveQuote(quoteId: string, content: string, author: string): Promise<void>;
  updateWidget(): Promise<void>;
}

const {QuoteWidgetModule} = NativeModules as {
  QuoteWidgetModule: QuoteWidgetModuleType | undefined;
};

/**
 * Save quote data to native SharedPreferences and update the home screen widget.
 * Gracefully handles the case where the native module is not available
 * (e.g., during JS-only development or if the module failed to register).
 */
export async function saveQuoteToWidget(
  quoteId: string,
  content: string,
  author: string,
): Promise<void> {
  if (!QuoteWidgetModule) {
    console.warn('[QuoteWidget] Native module not available');
    return;
  }
  try {
    await QuoteWidgetModule.saveQuote(quoteId, content, author);
    await QuoteWidgetModule.updateWidget();
  } catch (err) {
    console.warn('[QuoteWidget] Failed to update widget:', err);
  }
}

/**
 * Trigger a widget UI refresh without changing the stored quote.
 */
export async function refreshWidget(): Promise<void> {
  if (!QuoteWidgetModule) {
    return;
  }
  try {
    await QuoteWidgetModule.updateWidget();
  } catch (err) {
    console.warn('[QuoteWidget] Failed to refresh widget:', err);
  }
}
