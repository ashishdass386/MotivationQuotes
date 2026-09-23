import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useFocusEffect} from '@react-navigation/native';
import {useTheme} from '../theme/ThemeContext';
import {typography} from '../theme/typography';
import {spacing, borderRadius, shadow} from '../theme/spacing';
import {EmptyState} from '../components/EmptyState';
import {
  getSavedQuotes,
  unsaveQuote,
} from '../storage/savedQuotesStorage';
import {shareQuote} from '../utils/shareUtils';
import type {Quote} from '../models/Quote';

function SavedQuoteItem({
  quote,
  onDelete,
  onShare,
}: {
  quote: Quote;
  onDelete: (id: string) => void;
  onShare: (quote: Quote) => void;
}): React.JSX.Element {
  const {colors} = useTheme();
  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.cardBackground,
      borderRadius: borderRadius.xl,
      padding: spacing[5],
      marginHorizontal: spacing[4],
      marginBottom: spacing[3],
      borderWidth: 1,
      borderColor: colors.cardBorder,
      ...shadow.base,
    },
    content: {
      fontSize: typography.sizes.base,
      color: colors.textPrimary,
      fontStyle: 'italic',
      lineHeight: typography.sizes.base * typography.lineHeights.relaxed,
      marginBottom: spacing[3],
    },
    author: {
      fontSize: typography.sizes.sm,
      color: colors.primary,
      fontWeight: typography.weights.semibold,
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: spacing[3],
      borderTopWidth: 1,
      borderTopColor: colors.divider,
      paddingTop: spacing[3],
      gap: spacing[2],
    },
    actionBtn: {
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[2],
      borderRadius: borderRadius.full,
      borderWidth: 1,
    },
    shareBtn: {
      borderColor: colors.primary + '60',
      backgroundColor: colors.primary + '10',
    },
    deleteBtn: {
      borderColor: colors.error + '60',
      backgroundColor: colors.error + '10',
    },
    shareBtnText: {
      fontSize: typography.sizes.sm,
      fontWeight: typography.weights.semibold,
      color: colors.primary,
    },
    deleteBtnText: {
      fontSize: typography.sizes.sm,
      fontWeight: typography.weights.semibold,
      color: colors.error,
    },
    tagRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing[1],
      marginBottom: spacing[2],
    },
    tag: {
      backgroundColor: colors.primary + '18',
      borderRadius: borderRadius.full,
      paddingHorizontal: spacing[2],
      paddingVertical: 2,
    },
    tagText: {
      fontSize: typography.sizes.xs,
      color: colors.primary,
      fontWeight: typography.weights.semibold,
      textTransform: 'uppercase',
      letterSpacing: typography.letterSpacing.wide,
    },
  });

  return (
    <View style={styles.card}>
      {quote.tags && quote.tags.length > 0 && (
        <View style={styles.tagRow}>
          {quote.tags.slice(0, 2).map(t => (
            <View key={t} style={styles.tag}>
              <Text style={styles.tagText}>{t}</Text>
            </View>
          ))}
        </View>
      )}
      <Text style={styles.content} numberOfLines={6}>
        "{quote.content}"
      </Text>
      <Text style={styles.author}>— {quote.author}</Text>
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.shareBtn]}
          onPress={() => onShare(quote)}
          accessible
          accessibilityRole="button"
          accessibilityLabel={`Share quote by ${quote.author}`}>
          <Text style={styles.shareBtnText}>↗ Share</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, styles.deleteBtn]}
          onPress={() => onDelete(quote._id)}
          accessible
          accessibilityRole="button"
          accessibilityLabel={`Delete quote by ${quote.author}`}>
          <Text style={styles.deleteBtnText}>✕ Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export function SavedQuotesScreen(): React.JSX.Element {
  const {colors, isDark} = useTheme();
  const [quotes, setQuotes] = useState<Quote[]>([]);

  const load = useCallback(async () => {
    try {
      const saved = await getSavedQuotes();
      setQuotes(saved);
    } catch {
      setQuotes([]);
    }
  }, []);

  // Reload whenever screen comes into focus
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const handleDelete = useCallback(
    (id: string) => {
      Alert.alert(
        'Remove Quote',
        'Remove this quote from your saved collection?',
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Remove',
            style: 'destructive',
            onPress: async () => {
              const updated = await unsaveQuote(id);
              setQuotes(updated);
            },
          },
        ],
      );
    },
    [],
  );

  const handleShare = useCallback(async (quote: Quote) => {
    try {
      await shareQuote(quote);
    } catch {
      Alert.alert('Share failed', 'Could not open the share sheet.');
    }
  }, []);

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: spacing[6],
      paddingTop: spacing[6],
      paddingBottom: spacing[5],
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },
    title: {
      fontSize: typography.sizes['2xl'],
      fontWeight: typography.weights.bold,
      color: colors.textPrimary,
      letterSpacing: typography.letterSpacing.tight,
    },
    subtitle: {
      fontSize: typography.sizes.sm,
      color: colors.textTertiary,
      marginTop: spacing[1],
      fontWeight: typography.weights.medium,
    },
    listContent: {
      paddingTop: spacing[4],
      paddingBottom: spacing[10],
    },
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
      />
      <View style={styles.header}>
        <Text style={styles.title}>Saved Quotes</Text>
        {quotes.length > 0 && (
          <Text style={styles.subtitle}>
            {quotes.length} quote{quotes.length !== 1 ? 's' : ''} saved
          </Text>
        )}
      </View>
      <FlatList
        data={quotes}
        keyExtractor={item => item._id}
        renderItem={({item}) => (
          <SavedQuoteItem
            quote={item}
            onDelete={handleDelete}
            onShare={handleShare}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            emoji="🌟"
            title="No saved quotes yet"
            subtitle="Save quotes that inspire you and they'll appear here."
          />
        }
        contentContainerStyle={[
          styles.listContent,
          quotes.length === 0 && {flex: 1},
        ]}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
