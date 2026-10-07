import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {TemplateRenderer} from '../templates/TemplateRenderer';
import type {QuoteTemplate} from '../templates/templateTypes';
import type {Quote} from '../models/Quote';

interface LockScreenPreviewCardProps {
  template: QuoteTemplate;
  quote?: Quote | null;
  compact?: boolean;
}

export function LockScreenPreviewCard({
  template,
  quote,
  compact = false,
}: LockScreenPreviewCardProps): React.JSX.Element {
  // Background style
  const bgStyle =
    template.background.type === 'solid'
      ? {backgroundColor: template.background.value}
      : template.background.type === 'gradient'
      ? {backgroundColor: template.background.colors[0]}
      : {backgroundColor: '#09090B'};

  const isLight =
    template.background.type === 'solid' &&
    (template.background.value === '#FFFFFF' ||
      template.background.value === '#FAF8F5' ||
      template.background.value === '#FBF8F2' ||
      template.background.value === '#FAF9F6' ||
      template.background.value === '#F5F5F0' ||
      template.background.value === '#F7F4EE' ||
      template.background.value === '#EFECE6' ||
      template.background.value === '#E3E9E2');

  const systemTextColor = isLight ? '#0F172A' : '#FFFFFF';
  const systemSubColor = isLight ? '#64748B' : 'rgba(255, 255, 255, 0.7)';

  return (
    <View
      style={[
        styles.mockupPhone,
        bgStyle,
        {
          borderRadius: compact ? 16 : 24,
          padding: compact ? 10 : 18,
          height: compact ? 210 : 360,
        },
      ]}>
      {/* Top Status & Lock */}
      <View style={styles.topBar}>
        <Text
          style={[
            styles.statusTime,
            {color: systemSubColor, fontSize: compact ? 8 : 11},
          ]}>
          08:30
        </Text>
        <Text style={[styles.lockIcon, {color: systemSubColor, fontSize: compact ? 8 : 11}]}>
          🔒
        </Text>
        <Text
          style={[
            styles.statusIcons,
            {color: systemSubColor, fontSize: compact ? 7 : 10},
          ]}>
          5G ■
        </Text>
      </View>

      {/* Big Digital Clock (Lock Screen Safe Zone) */}
      <View style={[styles.clockSection, {marginVertical: compact ? 4 : 12}]}>
        <Text
          style={[
            styles.digitalClock,
            {
              color: systemTextColor,
              fontSize: compact ? 22 : 44,
              lineHeight: compact ? 26 : 50,
            },
          ]}>
          08:30
        </Text>
        <Text
          style={[
            styles.clockDate,
            {
              color: systemSubColor,
              fontSize: compact ? 7.5 : 12,
              marginTop: compact ? 1 : 2,
            },
          ]}>
          Wednesday, October 7
        </Text>
      </View>

      {/* Template Rendered in Safe Mid-Lower Zone */}
      <View
        style={[
          styles.templateWrapper,
          {
            flex: 1,
            maxHeight: compact ? 115 : 200,
          },
        ]}>
        <TemplateRenderer
          template={template}
          quote={quote}
          compact={compact}
        />
      </View>

      {/* Bottom Lock Screen Controls */}
      <View style={styles.bottomBar}>
        <View
          style={[
            styles.bottomCircle,
            {
              backgroundColor: isLight
                ? 'rgba(0, 0, 0, 0.08)'
                : 'rgba(255, 255, 255, 0.15)',
              width: compact ? 16 : 28,
              height: compact ? 16 : 28,
              borderRadius: compact ? 8 : 14,
            },
          ]}>
          <Text style={{fontSize: compact ? 7 : 12}}>🔦</Text>
        </View>
        <View
          style={[
            styles.homeIndicator,
            {
              backgroundColor: isLight
                ? 'rgba(0, 0, 0, 0.2)'
                : 'rgba(255, 255, 255, 0.3)',
              width: compact ? 36 : 64,
              height: compact ? 2 : 3,
            },
          ]}
        />
        <View
          style={[
            styles.bottomCircle,
            {
              backgroundColor: isLight
                ? 'rgba(0, 0, 0, 0.08)'
                : 'rgba(255, 255, 255, 0.15)',
              width: compact ? 16 : 28,
              height: compact ? 16 : 28,
              borderRadius: compact ? 8 : 14,
            },
          ]}>
          <Text style={{fontSize: compact ? 7 : 12}}>📷</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mockupPhone: {
    width: '100%',
    overflow: 'hidden',
    justifyContent: 'space-between',
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusTime: {
    fontWeight: '600',
  },
  lockIcon: {},
  statusIcons: {
    fontWeight: '600',
  },
  clockSection: {
    alignItems: 'center',
  },
  digitalClock: {
    fontWeight: '200',
    letterSpacing: -0.5,
  },
  clockDate: {
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  templateWrapper: {
    width: '100%',
    justifyContent: 'center',
    marginVertical: 4,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  bottomCircle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeIndicator: {
    borderRadius: 2,
  },
});
