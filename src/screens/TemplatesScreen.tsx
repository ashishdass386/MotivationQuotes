import React, {useState, useEffect, useMemo, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Platform,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '../theme/ThemeContext';
import {typography} from '../theme/typography';
import {spacing, borderRadius} from '../theme/spacing';
import {TemplateCard} from '../components/TemplateCard';
import {SearchIcon, CloseIcon} from '../components/Icons';
import {
  WIDGET_CATEGORIES,
  LOCKSCREEN_CATEGORIES,
  type TemplateType,
  type TemplateFilter,
  type QuoteTemplate,
} from '../templates/templateTypes';
import {
  searchAndFilterTemplates,
  DEFAULT_WIDGET_TEMPLATE,
  DEFAULT_LOCKSCREEN_TEMPLATE,
} from '../templates/templateRegistry';
import {
  getSelectedWidgetTemplateId,
  getSelectedLockScreenTemplateId,
  getFavoriteTemplateIds,
  toggleFavoriteTemplate,
} from '../storage/templateStorage';
import {useDailyQuote} from '../hooks/useDailyQuote';

export function TemplatesScreen({
  navigation,
}: {
  navigation: any;
}): React.JSX.Element {
  const {colors} = useTheme();
  const {quote} = useDailyQuote();

  const [activeType, setActiveType] = useState<TemplateType>('widget');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [filterMode, setFilterMode] = useState<TemplateFilter>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [activeWidgetId, setActiveWidgetId] = useState<string>(
    DEFAULT_WIDGET_TEMPLATE.id,
  );
  const [activeLockScreenId, setActiveLockScreenId] = useState<string>(
    DEFAULT_LOCKSCREEN_TEMPLATE.id,
  );
  const [favorites, setFavorites] = useState<string[]>([]);

  const loadState = useCallback(async () => {
    try {
      const widgetId = await getSelectedWidgetTemplateId();
      const lockId = await getSelectedLockScreenTemplateId();
      const favList = await getFavoriteTemplateIds();
      setActiveWidgetId(widgetId);
      setActiveLockScreenId(lockId);
      setFavorites(favList);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    loadState();
    const unsubscribe = navigation.addListener('focus', () => {
      loadState();
    });
    return unsubscribe;
  }, [navigation, loadState]);

  const handleTypeChange = useCallback((type: TemplateType) => {
    setActiveType(type);
    setSelectedCategory('All');
  }, []);

  const handleToggleFavorite = useCallback(async (id: string) => {
    await toggleFavoriteTemplate(id);
    const updated = await getFavoriteTemplateIds();
    setFavorites(updated);
  }, []);

  const handleCardPress = useCallback(
    (id: string) => {
      navigation.navigate('TemplatePreview', {
        templateId: id,
      });
    },
    [navigation],
  );

  const categories = useMemo(
    () => (activeType === 'widget' ? WIDGET_CATEGORIES : LOCKSCREEN_CATEGORIES),
    [activeType],
  );

  const favoritesSet = useMemo(() => new Set(favorites), [favorites]);

  const filteredTemplates = useMemo(() => {
    return searchAndFilterTemplates({
      type: activeType,
      category: selectedCategory,
      searchQuery,
      filter: filterMode,
      favorites,
    });
  }, [activeType, selectedCategory, searchQuery, filterMode, favorites]);

  const renderHeader = useCallback(() => {
    return (
      <View>
        {/* Mode Selector: Widgets vs Lock Screen */}
        <View style={styles.typeSelectorWrapper}>
          <View
            style={[
              styles.typeSelectorTrack,
              {backgroundColor: colors.surface, borderColor: colors.border},
            ]}>
            <TouchableOpacity
              style={[
                styles.typeTab,
                activeType === 'widget' && [
                  styles.activeTypeTab,
                  {backgroundColor: colors.primary},
                ],
              ]}
              onPress={() => handleTypeChange('widget')}
              activeOpacity={0.8}
              accessible
              accessibilityRole="tab"
              accessibilityState={{selected: activeType === 'widget'}}>
              <Text
                style={[
                  styles.typeTabText,
                  {
                    color:
                      activeType === 'widget'
                        ? '#FFFFFF'
                        : colors.textSecondary,
                    fontWeight: activeType === 'widget' ? '600' : '400',
                  },
                ]}>
                Widgets
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeTab,
                activeType === 'lockscreen' && [
                  styles.activeTypeTab,
                  {backgroundColor: colors.primary},
                ],
              ]}
              onPress={() => handleTypeChange('lockscreen')}
              activeOpacity={0.8}
              accessible
              accessibilityRole="tab"
              accessibilityState={{selected: activeType === 'lockscreen'}}>
              <Text
                style={[
                  styles.typeTabText,
                  {
                    color:
                      activeType === 'lockscreen'
                        ? '#FFFFFF'
                        : colors.textSecondary,
                    fontWeight: activeType === 'lockscreen' ? '600' : '400',
                  },
                ]}>
                Lock Screen
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Minimal Search Bar */}
        <View style={styles.searchWrapper}>
          <View
            style={[
              styles.searchBar,
              {backgroundColor: colors.surface, borderColor: colors.border},
            ]}>
            <SearchIcon size={16} color={colors.textTertiary} />
            <TextInput
              style={[styles.searchInput, {color: colors.textPrimary}]}
              placeholder={`Search ${
                activeType === 'widget' ? 'widgets' : 'lock screens'
              }…`}
              placeholderTextColor={colors.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
                <CloseIcon size={14} color={colors.textTertiary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Filter Pills (All / Free / Premium / Favorites) */}
        <View style={styles.filterPillsRow}>
          {(['All', 'Free', 'Premium', 'Favorites'] as TemplateFilter[]).map(
            pill => {
              const isSelected = filterMode === pill;
              return (
                <TouchableOpacity
                  key={pill}
                  onPress={() => setFilterMode(pill)}
                  activeOpacity={0.7}
                  style={[
                    styles.filterPill,
                    {
                      borderColor: isSelected ? colors.primary : colors.border,
                      backgroundColor: isSelected ? colors.primary : colors.surface,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.filterPillText,
                      {
                        color: isSelected ? '#FFFFFF' : colors.textSecondary,
                        fontWeight: isSelected ? '600' : '400',
                      },
                    ]}>
                    {pill}
                  </Text>
                </TouchableOpacity>
              );
            },
          )}
        </View>

        {/* Horizontal Category Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryChipsScroll}>
          {categories.map(cat => {
            const isCatActive = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                activeOpacity={0.7}
                style={[
                  styles.categoryChip,
                  {
                    borderBottomColor: isCatActive ? colors.primary : 'transparent',
                  },
                ]}>
                <Text
                  style={[
                    styles.categoryChipText,
                    {
                      color: isCatActive ? colors.textPrimary : colors.textTertiary,
                      fontWeight: isCatActive ? '600' : '400',
                    },
                  ]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Collection Grid Count Header */}
        <View style={styles.gridHeader}>
          <Text style={[styles.gridTitle, {color: colors.textPrimary}]}>
            {selectedCategory === 'All' ? 'All Templates' : selectedCategory}
          </Text>
          <Text style={[styles.gridCount, {color: colors.textTertiary}]}>
            {filteredTemplates.length} styles
          </Text>
        </View>
      </View>
    );
  }, [
    colors,
    activeType,
    searchQuery,
    filterMode,
    categories,
    selectedCategory,
    filteredTemplates.length,
    handleTypeChange,
  ]);

  const renderEmpty = useCallback(() => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyTitle, {color: colors.textPrimary}]}>
          No templates found
        </Text>
        <Text style={[styles.emptySubtitle, {color: colors.textSecondary}]}>
          Try searching with another keyword.
        </Text>
      </View>
    );
  }, [colors]);

  const renderTemplateItem = useCallback(
    ({item}: {item: QuoteTemplate}) => {
      const isActive =
        item.type === 'widget'
          ? activeWidgetId === item.id
          : activeLockScreenId === item.id;
      const isFavorite = favoritesSet.has(item.id);

      return (
        <View style={styles.gridColumn}>
          <TemplateCard
            template={item}
            quote={quote}
            isActive={isActive}
            isFavorite={isFavorite}
            onPress={() => handleCardPress(item.id)}
            onToggleFavorite={() => handleToggleFavorite(item.id)}
          />
        </View>
      );
    },
    [
      activeWidgetId,
      activeLockScreenId,
      favoritesSet,
      quote,
      handleCardPress,
      handleToggleFavorite,
    ],
  );

  const keyExtractor = useCallback((item: QuoteTemplate) => item.id, []);

  return (
    <SafeAreaView
      style={[styles.safeArea, {backgroundColor: colors.background}]}
      edges={['top']}>
      <StatusBar barStyle="dark-content" />

      {/* Screen Header */}
      <View style={[styles.header, {borderBottomColor: colors.border}]}>
        <Text style={[styles.headerTitle, {color: colors.textPrimary}]}>
          Templates
        </Text>
        <Text style={[styles.headerSubtitle, {color: colors.textSecondary}]}>
          Find a style that feels like you
        </Text>
      </View>

      {/* Virtualized 120 FPS 2-Column Grid */}
      <FlatList
        data={filteredTemplates}
        keyExtractor={keyExtractor}
        renderItem={renderTemplateItem}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={5}
        removeClippedSubviews={Platform.OS === 'android'}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing[12],
  },
  header: {
    paddingHorizontal: spacing[6],
    paddingTop: spacing[4],
    paddingBottom: spacing[4],
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    letterSpacing: typography.letterSpacing.tight,
  },
  headerSubtitle: {
    fontSize: typography.sizes.sm,
    marginTop: 2,
  },
  typeSelectorWrapper: {
    paddingHorizontal: spacing[6],
    marginTop: spacing[4],
  },
  typeSelectorTrack: {
    flexDirection: 'row',
    height: 40,
    borderRadius: borderRadius.base,
    borderWidth: 1,
    padding: 3,
  },
  typeTab: {
    flex: 1,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTypeTab: {},
  typeTabText: {
    fontSize: typography.sizes.xs,
    letterSpacing: typography.letterSpacing.wide,
  },
  searchWrapper: {
    paddingHorizontal: spacing[6],
    marginTop: spacing[3],
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderRadius: borderRadius.base,
    borderWidth: 1,
    paddingHorizontal: spacing[3],
    gap: spacing[2],
  },
  searchInput: {
    flex: 1,
    fontSize: typography.sizes.sm,
    paddingVertical: 0,
  },
  filterPillsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing[6],
    marginTop: spacing[3],
    gap: spacing[2],
  },
  filterPill: {
    paddingHorizontal: spacing[3],
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
  },
  filterPillText: {
    fontSize: 11,
    letterSpacing: 0.3,
  },
  categoryChipsScroll: {
    paddingHorizontal: spacing[6],
    marginTop: spacing[3],
    gap: spacing[5],
    paddingBottom: 2,
  },
  categoryChip: {
    paddingVertical: spacing[2],
    borderBottomWidth: 2,
  },
  categoryChipText: {
    fontSize: typography.sizes.xs,
    letterSpacing: typography.letterSpacing.wide,
  },
  gridHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[6],
    marginTop: spacing[5],
    marginBottom: spacing[2],
  },
  gridTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    letterSpacing: typography.letterSpacing.wide,
    textTransform: 'uppercase',
  },
  gridCount: {
    fontSize: typography.sizes.xs,
  },
  columnWrapper: {
    paddingHorizontal: spacing[4],
    justifyContent: 'space-between',
  },
  gridColumn: {
    width: '48.5%',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[12],
    paddingHorizontal: spacing[6],
  },
  emptyTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
  },
  emptySubtitle: {
    fontSize: typography.sizes.sm,
    marginTop: 4,
  },
});
