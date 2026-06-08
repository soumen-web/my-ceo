import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { AppFonts } from '@/assets/fonts';
import { EnterpriseFeedbackBanner } from '@/design-system/components';
import { reactNativeColorScheme } from '@/design-system/tokens/colors';
import type { AttendanceStackParamList } from '@/navigation/route-types';
import { fontSize, radius, spacing } from '@/utils/scale';

import {
  AttendanceMetricStrip,
  AttendanceScreenFrame,
  AttendanceSkeleton,
  InsightList,
  WeeklyTrendPreview,
  WorkModeInsights,
} from '../components';
import { useAttendanceScreenModel } from '../hooks/useAttendanceScreenModel';

const moduleColors = reactNativeColorScheme.ultiHuman.module;

type AttendanceMonthlyAnalyticsScreenProps = NativeStackScreenProps<
  AttendanceStackParamList,
  'AttendanceAnalytics'
>;

export const AttendanceMonthlyAnalyticsScreen = ({
  navigation,
}: AttendanceMonthlyAnalyticsScreenProps) => {
  const {
    errorMessage,
    isInitialLoading,
    isRefreshing,
    refresh,
    snapshot,
    workHoursLabel,
  } = useAttendanceScreenModel();
  const month = snapshot.month;

  return (
    <AttendanceScreenFrame
      isDetail
      navigation={navigation}
      onRefresh={refresh}
      refreshing={isRefreshing}
      routeLabel="Attendance"
      title="Monthly Analytics"
    >
      {isInitialLoading ? (
        <AttendanceSkeleton />
      ) : (
        <>
          {errorMessage ? <EnterpriseFeedbackBanner message={errorMessage} tone="error" /> : null}
          <LinearGradient
            colors={moduleColors.heroGradient}
            end={{ x: 1, y: 1 }}
            start={{ x: 0, y: 0 }}
            style={styles.analyticsHero}
          >
            <Text style={styles.monthLabel}>{month.monthLabel}</Text>
            <View style={styles.heroMetricRow}>
              <View>
                <Text style={styles.heroValue}>{Math.round(month.attendanceRate)}%</Text>
                <Text style={styles.heroCaption}>Attendance rate</Text>
              </View>
              <View style={styles.readinessBadge}>
                <Text style={styles.readinessValue}>{Math.round(month.readinessScore)}%</Text>
                <Text style={styles.readinessLabel}>Readiness</Text>
              </View>
            </View>
          </LinearGradient>

          <View style={styles.monthGrid}>
            <MonthStat label="Present" value={`${month.presentDays}d`} />
            <MonthStat label="Leave" value={`${month.leaveDays}d`} />
            <MonthStat label="Absent" value={`${month.absentDays}d`} />
            <MonthStat label="Work hours" value={workHoursLabel} />
            <MonthStat label="Late" value={`${month.lateArrivals}x`} />
            <MonthStat label="Early" value={`${month.earlyDepartures}x`} />
          </View>

          <AttendanceMetricStrip metrics={snapshot.metrics} />
          <WeeklyTrendPreview data={snapshot.trends} />
          <WorkModeInsights data={snapshot.workModes} />
          <InsightList insights={snapshot.insights} />
        </>
      )}
    </AttendanceScreenFrame>
  );
};

const MonthStat = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.monthStat}>
    <Text style={styles.monthStatValue}>{value}</Text>
    <Text style={styles.monthStatLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  analyticsHero: {
    backgroundColor: moduleColors.heroOverlay,
    borderColor: moduleColors.borderStrong,
    borderRadius: radius(8),
    borderWidth: 1,
    gap: spacing(18),
    padding: spacing(18),
    shadowColor: moduleColors.shadow,
    shadowOffset: { height: spacing(14), width: 0 },
    shadowOpacity: 0.22,
    shadowRadius: spacing(22),
  },
  heroCaption: {
    color: moduleColors.softText,
    fontFamily: AppFonts.googleSansMedium,
    fontSize: fontSize(12),
    lineHeight: spacing(17),
  },
  heroMetricRow: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heroValue: {
    color: moduleColors.heroText,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(42),
    lineHeight: spacing(48),
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing(9),
  },
  monthLabel: {
    color: moduleColors.accentPressed,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(13),
    lineHeight: spacing(18),
    textTransform: 'uppercase',
  },
  monthStat: {
    backgroundColor: reactNativeColorScheme.ultiHuman.surface.glassPanel,
    borderColor: reactNativeColorScheme.ultiHuman.surface.aquaBorderMuted,
    borderRadius: radius(8),
    borderWidth: 1,
    flex: 1,
    gap: spacing(2),
    minWidth: spacing(102),
    padding: spacing(13),
  },
  monthStatLabel: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansMedium,
    fontSize: fontSize(11),
    lineHeight: spacing(15),
  },
  monthStatValue: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(20),
    lineHeight: spacing(26),
  },
  readinessBadge: {
    alignItems: 'center',
    backgroundColor: moduleColors.accentSoft,
    borderColor: moduleColors.border,
    borderRadius: radius(8),
    borderWidth: 1,
    minWidth: spacing(88),
    padding: spacing(10),
  },
  readinessLabel: {
    color: moduleColors.softText,
    fontFamily: AppFonts.googleSansMedium,
    fontSize: fontSize(10),
    lineHeight: spacing(14),
  },
  readinessValue: {
    color: moduleColors.heroText,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(21),
    lineHeight: spacing(26),
  },
});
