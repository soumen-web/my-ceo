import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { AppFonts } from '@/assets/fonts';
import { PremiumAnimatedView } from '@/design-system/components';
import { reactNativeColorScheme } from '@/design-system/tokens/colors';
import { fontSize, radius, spacing } from '@/utils/scale';

import {
  MyOrganizationInfoRow,
  type MyOrganizationInfoRowModel,
} from './MyOrganizationInfoRow';

type MyOrganizationDetailStatus = 'failed' | 'idle' | 'loading' | 'ready';

interface MyOrganizationFeedbackCardProps {
  message: string;
  tone?: 'error' | 'muted';
}

interface MyOrganizationLoadingCardProps {
  message: string;
}

interface MyOrganizationDetailCardProps {
  emptyMessage?: string;
  errorMessage: string | null;
  heroIcon?: keyof typeof Feather.glyphMap;
  heroKicker?: string;
  loadingMessage: string;
  rows: MyOrganizationInfoRowModel[];
  status: MyOrganizationDetailStatus;
  subtitle: string;
  title: string;
}

const moduleColors = reactNativeColorScheme.ultiHuman.module;

const MyOrganizationLoadingCard = ({ message }: MyOrganizationLoadingCardProps) => (
  <PremiumAnimatedView distance={5} style={styles.feedbackCard}>
    <ActivityIndicator color={reactNativeColorScheme.ultiHuman.accent} size="small" />
    <Text style={styles.feedbackText}>{message}</Text>
  </PremiumAnimatedView>
);

const MyOrganizationFeedbackCard = ({
  message,
  tone = 'muted',
}: MyOrganizationFeedbackCardProps) => {
  const isError = tone === 'error';

  return (
    <PremiumAnimatedView distance={5} style={styles.feedbackCard}>
      <View style={[styles.feedbackIconWrap, isError ? styles.feedbackIconError : undefined]}>
        <Feather
          color={
            isError
              ? reactNativeColorScheme.status.danger.foreground
              : reactNativeColorScheme.ultiHuman.accent
          }
          name={isError ? 'alert-circle' : 'inbox'}
          size={17}
        />
      </View>
      <Text style={[styles.feedbackText, isError ? styles.feedbackErrorText : undefined]}>
        {message}
      </Text>
    </PremiumAnimatedView>
  );
};

export const MyOrganizationDetailCard = ({
  emptyMessage = 'No organization details available yet.',
  errorMessage,
  heroIcon = 'compass',
  heroKicker,
  loadingMessage,
  rows,
  status,
  subtitle,
  title,
}: MyOrganizationDetailCardProps) => {
  const hasRows = rows.length > 0;
  const isLoading = status === 'loading';
  const primaryValue = rows[0]?.value || title;
  const secondaryValue = rows.find((row) => row.value !== primaryValue)?.value ?? subtitle;

  return (
    <PremiumAnimatedView distance={6} style={styles.card}>
      <LinearGradient
        colors={moduleColors.heroGradient}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={styles.cardHeader}
      >
        <View style={styles.headerIcon}>
          <Feather color={moduleColors.icon} name={heroIcon} size={spacing(18)} />
        </View>
        <View style={styles.headerCopy}>
          <Text style={styles.cardEyebrow}>{heroKicker ?? title}</Text>
          <Text numberOfLines={1} style={styles.cardTitle}>{primaryValue}</Text>
          <Text numberOfLines={2} style={styles.cardSubtitle}>{secondaryValue}</Text>
        </View>
        <View style={styles.headerMetric}>
          <Text style={styles.headerMetricValue}>{rows.length}</Text>
          <Text style={styles.headerMetricLabel}>signals</Text>
        </View>
      </LinearGradient>

      {isLoading && !hasRows ? (
        <MyOrganizationLoadingCard message={loadingMessage} />
      ) : hasRows ? (
        <>
          {isLoading ? (
            <View style={styles.refreshingRow}>
              <ActivityIndicator color={reactNativeColorScheme.ultiHuman.accent} size="small" />
              <Text style={styles.feedbackText}>{loadingMessage}</Text>
            </View>
          ) : null}
          <View style={styles.infoList}>
            {rows.map((row, index) => (
              <MyOrganizationInfoRow
                isLast={index === rows.length - 1}
                index={index}
                key={`${row.label}-${index}`}
                row={row}
              />
            ))}
            {rows.length % 2 === 1 ? <View pointerEvents="none" style={styles.infoGridSpacer} /> : null}
          </View>
          {errorMessage ? <MyOrganizationFeedbackCard message={errorMessage} tone="error" /> : null}
        </>
      ) : errorMessage ? (
        <MyOrganizationFeedbackCard message={errorMessage} tone="error" />
      ) : (
        <MyOrganizationFeedbackCard message={emptyMessage} />
      )}
    </PremiumAnimatedView>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: reactNativeColorScheme.ultiHuman.surface.glassPanel,
    borderColor: moduleColors.borderStrong,
    borderRadius: radius(8),
    borderWidth: 1,
    gap: spacing(12),
    overflow: 'hidden',
    padding: spacing(12),
    shadowColor: moduleColors.shadow,
    shadowOffset: { height: spacing(10), width: 0 },
    shadowOpacity: 0.18,
    shadowRadius: spacing(18),
  },
  cardEyebrow: {
    color: moduleColors.accentPressed,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(10),
    lineHeight: spacing(14),
    textTransform: 'uppercase',
  },
  cardHeader: {
    alignItems: 'flex-start',
    borderColor: moduleColors.border,
    borderRadius: radius(8),
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing(12),
    padding: spacing(14),
  },
  cardSubtitle: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansMedium,
    fontSize: fontSize(12),
    lineHeight: spacing(17),
  },
  cardTitle: {
    color: moduleColors.ink,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(18),
    lineHeight: spacing(24),
  },
  feedbackCard: {
    alignItems: 'center',
    backgroundColor: reactNativeColorScheme.ultiHuman.surface.glassFaint,
    borderColor: moduleColors.border,
    borderRadius: radius(8),
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing(12),
    minHeight: spacing(68),
    paddingHorizontal: spacing(14),
    paddingVertical: spacing(13),
  },
  feedbackErrorText: {
    color: reactNativeColorScheme.status.danger.foreground,
  },
  feedbackIconError: {
    backgroundColor: reactNativeColorScheme.status.danger.background,
    borderColor: reactNativeColorScheme.status.danger.border,
  },
  feedbackIconWrap: {
    alignItems: 'center',
    backgroundColor: moduleColors.iconSurface,
    borderColor: moduleColors.border,
    borderRadius: radius(8),
    borderWidth: 1,
    height: spacing(38),
    justifyContent: 'center',
    width: spacing(38),
  },
  feedbackText: {
    color: reactNativeColorScheme.text.secondary,
    flex: 1,
    fontFamily: AppFonts.googleSansMedium,
    fontSize: fontSize(13),
    lineHeight: spacing(18),
  },
  headerCopy: {
    flex: 1,
    gap: spacing(3),
    minWidth: 0,
  },
  headerIcon: {
    alignItems: 'center',
    backgroundColor: moduleColors.iconSurface,
    borderColor: moduleColors.border,
    borderRadius: radius(8),
    borderWidth: 1,
    height: spacing(42),
    justifyContent: 'center',
    width: spacing(42),
  },
  headerMetric: {
    alignItems: 'center',
    backgroundColor: moduleColors.heroOverlay,
    borderColor: moduleColors.border,
    borderRadius: radius(8),
    borderWidth: 1,
    minWidth: spacing(54),
    paddingHorizontal: spacing(8),
    paddingVertical: spacing(7),
  },
  headerMetricLabel: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansMedium,
    fontSize: fontSize(10),
    lineHeight: spacing(13),
  },
  headerMetricValue: {
    color: moduleColors.ink,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(16),
    lineHeight: spacing(20),
  },
  infoList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoGridSpacer: {
    marginBottom: spacing(8),
    minHeight: spacing(1),
    width: '48%',
  },
  refreshingRow: {
    alignItems: 'center',
    backgroundColor: moduleColors.heroOverlay,
    borderColor: moduleColors.border,
    borderRadius: radius(8),
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing(10),
    minHeight: spacing(48),
    paddingHorizontal: spacing(16),
  },
});
