import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';

import { AppFonts } from '@/assets/fonts';
import { reactNativeColorScheme } from '@/design-system/tokens/colors';
import type { LeaveStackParamList } from '@/navigation/route-types';
import { fontSize, radius, spacing } from '@/utils/scale';

import {
  LeaveAnalyticsPreview,
  LeaveInsightsPanel,
  LeaveScreenFrame,
} from '../components';
import { useLeaveScreenModel } from '../hooks/useLeaveScreenModel';

type LeaveAnalyticsScreenProps = NativeStackScreenProps<
  LeaveStackParamList,
  'LeaveAnalytics'
>;
const moduleColors = reactNativeColorScheme.ultiHuman.module;

export const LeaveAnalyticsScreen = ({ navigation }: LeaveAnalyticsScreenProps) => {
  const { isRefreshing, refresh, snapshot } = useLeaveScreenModel();
  const { analytics } = snapshot;

  return (
    <LeaveScreenFrame
      isDetail
      navigation={navigation}
      onRefresh={refresh}
      refreshing={isRefreshing}
      title="Leave analytics"
    >
      <View style={styles.summaryGrid}>
        <AnalyticsTile label="Approval rate" value={`${analytics.approvalRate}%`} />
        <AnalyticsTile label="Avg approval" value={`${analytics.averageApprovalHours}h`} />
        <AnalyticsTile label="Balance risk" value={`${analytics.balanceRisk}%`} />
        <AnalyticsTile label="Protected days" value={`${analytics.streakProtectedDays}`} />
      </View>
      <LeaveAnalyticsPreview
        approvalRate={analytics.approvalRate}
        monthlyUsage={analytics.monthlyUsage}
      />
      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Leave distribution</Text>
        {analytics.distribution.map((item) => (
          <View key={item.type} style={styles.distributionRow}>
            <Text style={styles.distributionLabel}>{item.label}</Text>
            <View style={styles.distributionTrack}>
              <View style={[styles.distributionFill, { width: `${Math.min(100, item.value * 8)}%` }]} />
            </View>
            <Text style={styles.distributionValue}>{item.value}</Text>
          </View>
        ))}
      </View>
      <LeaveInsightsPanel insights={snapshot.insights} />
    </LeaveScreenFrame>
  );
};

const AnalyticsTile = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.tile}>
    <Text style={styles.tileLabel}>{label}</Text>
    <Text style={styles.tileValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  distributionFill: {
    backgroundColor: moduleColors.accent,
    borderRadius: radius(4),
    height: '100%',
  },
  distributionLabel: {
    color: reactNativeColorScheme.ultiHuman.text,
    flex: 0.9,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(12),
    lineHeight: spacing(16),
  },
  distributionRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing(9),
    minHeight: spacing(34),
  },
  distributionTrack: {
    backgroundColor: moduleColors.accentWash,
    borderRadius: radius(4),
    flex: 1,
    height: spacing(8),
    overflow: 'hidden',
  },
  distributionValue: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(11),
    lineHeight: spacing(15),
    width: spacing(30),
  },
  panel: {
    backgroundColor: reactNativeColorScheme.ultiHuman.surface.glassPanel,
    borderColor: reactNativeColorScheme.ultiHuman.surface.aquaBorderMuted,
    borderRadius: radius(8),
    borderWidth: 1,
    gap: spacing(10),
    padding: spacing(13),
  },
  panelTitle: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(15),
    lineHeight: spacing(20),
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing(9),
  },
  tile: {
    backgroundColor: reactNativeColorScheme.ultiHuman.surface.glassPanel,
    borderColor: reactNativeColorScheme.ultiHuman.surface.aquaBorderMuted,
    borderRadius: radius(8),
    borderWidth: 1,
    gap: spacing(4),
    padding: spacing(13),
    width: '48%',
  },
  tileLabel: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansRegular,
    fontSize: fontSize(11),
    lineHeight: spacing(15),
  },
  tileValue: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(22),
    lineHeight: spacing(28),
  },
});
