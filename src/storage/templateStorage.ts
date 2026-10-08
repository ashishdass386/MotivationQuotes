import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  setWidgetTemplate as setNativeWidgetTemplate,
  getWidgetTemplate as getNativeWidgetTemplate,
  setLockScreenTemplate as setNativeLockScreenTemplate,
} from '../native/QuoteWidget';

const KEY_WIDGET_TEMPLATE = '@motiva/selected_widget_template_id';
const KEY_LOCKSCREEN_TEMPLATE = '@motiva/selected_lockscreen_template_id';
const KEY_FAVORITE_TEMPLATES = '@motiva/favorite_template_ids';

export const DEFAULT_WIDGET_ID = 'widget_midnight';
export const DEFAULT_LOCKSCREEN_ID = 'lock_minimal';

let memoryWidgetId: string | null = null;
let memoryLockId: string | null = null;
let memoryFavorites: string[] | null = null;

/**
 * Get active widget template ID.
 */
export async function getSelectedWidgetTemplateId(): Promise<string> {
  if (memoryWidgetId) {
    return memoryWidgetId;
  }
  try {
    const saved = await AsyncStorage.getItem(KEY_WIDGET_TEMPLATE);
    if (saved) {
      memoryWidgetId = saved;
      return saved;
    }
    const nativeVal = await getNativeWidgetTemplate();
    const result = nativeVal || DEFAULT_WIDGET_ID;
    memoryWidgetId = result;
    return result;
  } catch {
    return DEFAULT_WIDGET_ID;
  }
}

/**
 * Sets the active widget template and updates the native Android widget immediately.
 */
export async function setSelectedWidgetTemplateId(id: string): Promise<void> {
  memoryWidgetId = id;
  try {
    await AsyncStorage.setItem(KEY_WIDGET_TEMPLATE, id);
    await setNativeWidgetTemplate(id);
  } catch (err) {
    console.warn('[templateStorage] Failed to save widget template:', err);
  }
}

/**
 * Get active lock screen template ID.
 */
export async function getSelectedLockScreenTemplateId(): Promise<string> {
  if (memoryLockId) {
    return memoryLockId;
  }
  try {
    const saved = await AsyncStorage.getItem(KEY_LOCKSCREEN_TEMPLATE);
    const result = saved || DEFAULT_LOCKSCREEN_ID;
    memoryLockId = result;
    return result;
  } catch {
    return DEFAULT_LOCKSCREEN_ID;
  }
}

/**
 * Sets active lock screen template and syncs with native storage for notifications.
 */
export async function setSelectedLockScreenTemplateId(id: string): Promise<void> {
  memoryLockId = id;
  try {
    await AsyncStorage.setItem(KEY_LOCKSCREEN_TEMPLATE, id);
    await setNativeLockScreenTemplate(id);
  } catch (err) {
    console.warn('[templateStorage] Failed to save lockscreen template:', err);
  }
}

/**
 * Get favorited template IDs.
 */
export async function getFavoriteTemplateIds(): Promise<string[]> {
  if (memoryFavorites) {
    return memoryFavorites;
  }
  try {
    const raw = await AsyncStorage.getItem(KEY_FAVORITE_TEMPLATES);
    const list = raw ? (JSON.parse(raw) as string[]) : [];
    memoryFavorites = list;
    return list;
  } catch {
    memoryFavorites = [];
    return [];
  }
}

/**
 * Toggle favorite state for a template.
 */
export async function toggleFavoriteTemplate(id: string): Promise<boolean> {
  try {
    const favs = await getFavoriteTemplateIds();
    const isFav = favs.includes(id);
    const updated = isFav ? favs.filter(item => item !== id) : [...favs, id];
    memoryFavorites = updated;
    AsyncStorage.setItem(KEY_FAVORITE_TEMPLATES, JSON.stringify(updated)).catch(() => {});
    return !isFav;
  } catch {
    return false;
  }
}

/**
 * Check if a template is favorited.
 */
export async function isTemplateFavorite(id: string): Promise<boolean> {
  if (memoryFavorites) {
    return memoryFavorites.includes(id);
  }
  const favs = await getFavoriteTemplateIds();
  return favs.includes(id);
}

/**
 * Reset widget and lockscreen templates to defaults.
 */
export async function resetTemplatesToDefault(): Promise<void> {
  await setSelectedWidgetTemplateId(DEFAULT_WIDGET_ID);
  await setSelectedLockScreenTemplateId(DEFAULT_LOCKSCREEN_ID);
}
