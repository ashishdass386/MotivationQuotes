import {Share} from 'react-native';
import type {Quote} from '../models/Quote';

export async function shareQuote(quote: Quote): Promise<void> {
  const message = `"${quote.content}"\n\n— ${quote.author}\n\nShared from Motiva`;
  await Share.share({
    message,
    title: 'Daily Motivation',
  });
}
