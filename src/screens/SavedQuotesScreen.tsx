import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  StatusBar,
  Platform,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useFocusEffect} from '@react-navigation/native';
import {useTheme} from '../theme/ThemeContext';
import {typography} from '../theme/typography';
import {spacing} from '../theme/spacing';
import {EmptyState} from '../components/EmptyState';
import {ShareIcon, TrashIcon} from '../components/Icons';
import {
  getSavedQuotes,
  unsaveQuote,
} from '../storage/savedQuotesStorage';
import {shareQuote} from '../utils/shareUtils';
import type {Quote} from '../models/Quote';

interface SavedQuoteItemProps {
  quote: Quote;
  onDelete: (id: string) => void;
  onShare: (quote: Quote) => void;
}

const SavedQuoteItem = React.memo(function SavedQuoteItem({
  quote,
  onDelete,
  onShare,
}: SavedQuoteItemProps): React.JSX.Element {
  const {colors} = useTheme();

  const quoteFontFamily = Platform.select({
    android: 'serif',
    default: 'Georgia',
  });

  return (
    <View style={[styles.itemContainer, {borderBottomColor: colors.divider}]}>
      <Text
        style={[
          styles.quoteText,
          {
            color: colors.textPrimary,
            fontFamily: quoteFontFamily,
          },
        ]}>
        “{quote.content.trim()}”
      </Text>

      <View style={styles.footerRow}>
        <Text style={[styles.authorText, {color: colors.textSecondary}]}>
          — {quote.author?.trim() || 'Anonymous'}
        </Text>

        <View style={styles.actionRow}>
          <TouchableOpacity
            onPress={() => onShare(quote)}
            hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Share saved quote"
            style={styles.iconButton}>
            <ShareIcon size={15} color={colors.textTertiary} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onDelete(quote._id)}
            hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Delete saved quote"
            style={styles.iconButton}>
            <TrashIcon size={15} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});

export function SavedQuotesScreen({
  navigation,
}: {
  navigation: any;
}): React.JSX.Element {
  const {colors} = useTheme();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadSaved = useCallback(async () => {
    try {
      const items = await getSavedQuotes();
      setQuotes(items);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadSaved();
    }, [loadSaved]),
  );

  const handleDelete = useCallback((id: string) => {
    Alert.alert('Remove Quote', 'Remove this quote from your saved list?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          await unsaveQuote(id);
          setQuotes(prev => prev.filter(q => q._id !== id));
        },
      },
    ]);
  }, []);

  const handleShare = useCallback(async (quote: Quote) => {
    try {
      await shareQuote(quote);
    } catch {
      Alert.alert('Share failed', 'Could not open the share sheet.');
    }
  }, []);

  const keyExtractor = useCallback((item: Quote) => item._id, []);

  const renderItem = useCallback(
    ({item}: {item: Quote}) => (
      <SavedQuoteItem
        quote={item}
        onDelete={handleDelete}
        onShare={handleShare}
      />
    ),
    [handleDelete, handleShare],
  );

  return (
    <SafeAreaView
      style={[styles.safeArea, {backgroundColor: colors.background}]}
      edges={['top']}>
      <StatusBar barStyle="dark-content" />

      {/* Editorial Header */}
      <View style={[styles.header, {borderBottomColor: colors.border}]}>
        <View style={styles.headerTitleRow}>
          <Text style={[styles.title, {color: colors.textPrimary}]}>
            Saved Quotes
          </Text>
          {quotes.length > 0 && (
            <Text style={[styles.countBadge, {color: colors.textTertiary}]}>
              {quotes.length}
            </Text>
          )}
        </View>
        <Text style={[styles.subtitle, {color: colors.textSecondary}]}>
          Your curated personal collection
        </Text>
      </View>

      {quotes.length === 0 && !isLoading ? (
        <EmptyState
          title="No saved quotes"
          subtitle="Quotes you save will appear here for daily reflection."
          actionText="Explore today's quote"
          onActionPress={() => navigation.navigate('Home')}
        />
      ) : (
        <FlatList
          data={quotes}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={Platform.OS === 'android'}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing[6],
    paddingTop: spacing[4],
    paddingBottom: spacing[4],
    borderBottomWidth: 1,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing[2],
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    letterSpacing: typography.letterSpacing.tight,
  },
  countBadge: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  subtitle: {
    fontSize: typography.sizes.sm,
    marginTop: 2,
  },
  listContent: {
    paddingBottom: spacing[8],
  },
  itemContainer: {
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[5],
    borderBottomWidth: 1,
  },
  quoteText: {
    fontSize: typography.sizes.base,
    lineHeight: 23,
    letterSpacing: -0.1,
    marginBottom: spacing[3],
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing[4],
    alignItems: 'center',
  },
  iconButton: {
    padding: 2,
  },
});
