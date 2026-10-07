import React from 'react';
import {View, StyleSheet} from 'react-native';
import {TemplateRenderer} from '../templates/TemplateRenderer';
import type {QuoteTemplate} from '../templates/templateTypes';
import type {Quote} from '../models/Quote';

interface WidgetPreviewCardProps {
  template: QuoteTemplate;
  quote?: Quote | null;
  compact?: boolean;
}

export function WidgetPreviewCard({
  template,
  quote,
  compact = false,
}: WidgetPreviewCardProps): React.JSX.Element {
  return (
    <View
      style={[
        styles.container,
        {
          height: compact ? 128 : 170,
        },
      ]}>
      <TemplateRenderer
        template={template}
        quote={quote}
        compact={compact}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
