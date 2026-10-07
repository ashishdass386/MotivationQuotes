import type {
  QuoteTemplate,
  TemplateType,
  TemplateFilter,
} from './templateTypes';
import {WIDGET_TEMPLATES} from './widgetTemplates';
import {LOCKSCREEN_TEMPLATES} from './lockScreenTemplates';

export {WIDGET_TEMPLATES, LOCKSCREEN_TEMPLATES};

export const ALL_TEMPLATES: QuoteTemplate[] = [
  ...WIDGET_TEMPLATES,
  ...LOCKSCREEN_TEMPLATES,
];

export const DEFAULT_WIDGET_TEMPLATE: QuoteTemplate =
  WIDGET_TEMPLATES.find(t => t.id === 'widget_midnight') ||
  WIDGET_TEMPLATES[0];

export const DEFAULT_LOCKSCREEN_TEMPLATE: QuoteTemplate =
  LOCKSCREEN_TEMPLATES.find(t => t.id === 'lock_minimal') ||
  LOCKSCREEN_TEMPLATES[0];

export function getTemplateById(id: string): QuoteTemplate | undefined {
  return ALL_TEMPLATES.find(t => t.id === id);
}

export function getTemplatesByType(type: TemplateType): QuoteTemplate[] {
  return type === 'widget' ? WIDGET_TEMPLATES : LOCKSCREEN_TEMPLATES;
}

export function searchAndFilterTemplates({
  type,
  category = 'All',
  searchQuery = '',
  filter = 'All',
  favorites = [],
}: {
  type: TemplateType;
  category?: string;
  searchQuery?: string;
  filter?: TemplateFilter;
  favorites?: string[];
}): QuoteTemplate[] {
  let list = getTemplatesByType(type);

  // 1. Category filter
  if (category && category !== 'All') {
    list = list.filter(
      t => t.category.toLowerCase() === category.toLowerCase(),
    );
  }

  // 2. Search query filter
  const query = searchQuery.trim().toLowerCase();
  if (query.length > 0) {
    list = list.filter(
      t =>
        t.name.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query) ||
        (t.tagline && t.tagline.toLowerCase().includes(query)) ||
        t.layout.toLowerCase().includes(query) ||
        t.typography.fontFamily.toLowerCase().includes(query),
    );
  }

  // 3. Filter tab (All, Free, Premium, Favorites)
  if (filter === 'Free') {
    list = list.filter(t => !t.isPremium);
  } else if (filter === 'Premium') {
    list = list.filter(t => t.isPremium);
  } else if (filter === 'Favorites') {
    const favSet = new Set(favorites);
    list = list.filter(t => favSet.has(t.id));
  }

  return list;
}
