import {NativeModules} from 'react-native';

interface QuoteWidgetModuleType {
  saveQuote(quoteId: string, content: string, author: string): Promise<void>;
  updateWidget(): Promise<void>;
  setWidgetTemplate(templateId: string): Promise<boolean>;
  getWidgetTemplate(): Promise<string>;
  setLockScreenTemplate(templateId: string): Promise<boolean>;
  getLockScreenTemplate(): Promise<string>;
  pinWidget(): Promise<boolean>;
  getInstalledWidgetsCount(): Promise<number>;
}

const {QuoteWidgetModule} = NativeModules as {
  QuoteWidgetModule: QuoteWidgetModuleType | undefined;
};

/**
 * Save quote data to native SharedPreferences and update the home screen widget.
 */
export async function saveQuoteToWidget(
  quoteId: string,
  content: string,
  author: string,
): Promise<void> {
  if (!QuoteWidgetModule) {
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

/**
 * Set the selected widget template and immediately re-render all native home screen widgets.
 */
export async function setWidgetTemplate(templateId: string): Promise<boolean> {
  if (!QuoteWidgetModule) {
    return false;
  }
  try {
    return await QuoteWidgetModule.setWidgetTemplate(templateId);
  } catch (err) {
    console.warn('[QuoteWidget] Failed to set widget template:', err);
    return false;
  }
}

/**
 * Get the currently active widget template ID from native storage.
 */
export async function getWidgetTemplate(): Promise<string> {
  if (!QuoteWidgetModule) {
    return 'widget_midnight';
  }
  try {
    return await QuoteWidgetModule.getWidgetTemplate();
  } catch {
    return 'widget_midnight';
  }
}

/**
 * Set the selected lock screen template in native storage.
 */
export async function setLockScreenTemplate(templateId: string): Promise<boolean> {
  if (!QuoteWidgetModule) {
    return false;
  }
  try {
    return await QuoteWidgetModule.setLockScreenTemplate(templateId);
  } catch (err) {
    console.warn('[QuoteWidget] Failed to set lock screen template:', err);
    return false;
  }
}

/**
 * Get the currently active lock screen template ID from native storage.
 */
export async function getLockScreenTemplate(): Promise<string> {
  if (!QuoteWidgetModule) {
    return 'lock_minimal';
  }
  try {
    return await QuoteWidgetModule.getLockScreenTemplate();
  } catch {
    return 'lock_minimal';
  }
}

/**
 * Request system prompt to pin the Motiva widget to the user's home screen.
 */
export async function pinWidgetToHomeScreen(): Promise<boolean> {
  if (!QuoteWidgetModule) {
    return false;
  }
  try {
    return await QuoteWidgetModule.pinWidget();
  } catch (err) {
    console.warn('[QuoteWidget] Failed to pin widget:', err);
    return false;
  }
}

/**
 * Check how many Motiva widgets are currently placed on the device launcher.
 */
export async function getInstalledWidgetsCount(): Promise<number> {
  if (!QuoteWidgetModule) {
    return 0;
  }
  try {
    return await QuoteWidgetModule.getInstalledWidgetsCount();
  } catch {
    return 0;
  }
}
