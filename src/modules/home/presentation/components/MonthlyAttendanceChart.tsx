import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppFonts } from '@/assets/fonts';
import { reactNativeColorScheme } from '@/design-system/tokens/colors';
import { fontSize, radius, spacing } from '@/utils/scale';

interface AttendanceMonth {
  absent: number;
  leave: number;
  month: string;
  present: number;
}

interface MonthlyAttendanceChartProps {
  data: AttendanceMonth[];
}

const chartColors = {
  absent: '#f4a62a',
  leave: '#5f8ef7',
  present: reactNativeColorScheme.ultiHuman.accent,
} as const;

const getSafeCount = (value: number) => Math.max(0, value);

const getAttendanceTotal = (item: AttendanceMonth) =>
  getSafeCount(item.present) +
  getSafeCount(item.absent) +
  getSafeCount(item.leave);

const getPercentage = (value: number, total: number) =>
  total > 0 ? Math.round((value / total) * 100) : 0;

export const MonthlyAttendanceChart = ({ data }: MonthlyAttendanceChartProps) => {
  const totals = data.reduce(
    (accumulator, item) => ({
      absent: accumulator.absent + getSafeCount(item.absent),
      leave: accumulator.leave + getSafeCount(item.leave),
      present: accumulator.present + getSafeCount(item.present),
    }),
    { absent: 0, leave: 0, present: 0 },
  );
  const recordedDays = totals.present + totals.absent + totals.leave;
  const attendanceRate = getPercentage(totals.present, recordedDays);
  const maxMonthTotal = Math.max(1, ...data.map(getAttendanceTotal));
  const averagePresent = data.length > 0 ? Math.round(totals.present / data.length) : 0;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.kicker}>Attendance overview</Text>
          <Text style={styles.title}>Monthly Attendance</Text>
          <Text style={styles.subtitle}>A quick read on presence, leaves, and missed days.</Text>
        </View>
        <View style={styles.rateBadge}>
          <Text style={styles.rateValue}>{attendanceRate}%</Text>
          <Text style={styles.rateLabel}>Present</Text>
        </View>
      </View>

      <View style={styles.progressPanel}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Overall completion</Text>
          <Text style={styles.progressValue}>
            {totals.present}/{recordedDays || 0} days
          </Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${attendanceRate}%` }]} />
        </View>
      </View>

      <View style={styles.metricsGrid}>
        <View style={[styles.metricCard, styles.presentMetric]}>
          <Text style={styles.metricValue}>{totals.present}</Text>
          <Text style={styles.metricLabel}>Present</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>{averagePresent}</Text>
          <Text style={styles.metricLabel}>Avg / month</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>{totals.absent + totals.leave}</Text>
          <Text style={styles.metricLabel}>Away days</Text>
        </View>
      </View>

      <View style={styles.chartPanel}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>Monthly split</Text>
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: chartColors.present }]} />
              <Text style={styles.legendLabel}>Present</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: chartColors.absent }]} />
              <Text style={styles.legendLabel}>Absent</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: chartColors.leave }]} />
              <Text style={styles.legendLabel}>Leave</Text>
            </View>
          </View>
        </View>

        {data.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No attendance data</Text>
            <Text style={styles.emptyText}>Monthly totals will appear here once available.</Text>
          </View>
        ) : (
          <ScrollView
            horizontal
            bounces
            contentContainerStyle={styles.chartContent}
            showsHorizontalScrollIndicator={false}
          >
            {data.map((item) => {
              const monthTotal = getAttendanceTotal(item);
              const presentDays = getSafeCount(item.present);
              const absentDays = getSafeCount(item.absent);
              const leaveDays = getSafeCount(item.leave);
              const monthRate = getPercentage(presentDays, monthTotal);
              const barHeight = spacing(54 + (monthTotal / maxMonthTotal) * 94);

              return (
                <View
                  accessibilityLabel={`${item.month}: ${presentDays} present, ${absentDays} absent, ${leaveDays} leave, ${monthRate}% attendance`}
                  accessible
                  key={item.month}
                  style={styles.monthColumn}
                >
                  <Text style={styles.monthPercent}>{monthRate}%</Text>
                  <View style={styles.barTrack}>
                    <View style={[styles.stackedBar, { height: barHeight }]}>
                      {absentDays > 0 ? (
                        <View
                          style={[
                            styles.barSegment,
                            styles.absentSegment,
                            { flex: absentDays },
                          ]}
                        />
                      ) : null}
                      {leaveDays > 0 ? (
                        <View
                          style={[
                            styles.barSegment,
                            styles.leaveSegment,
                            { flex: leaveDays },
                          ]}
                        />
                      ) : null}
                      {presentDays > 0 ? (
                        <View
                          style={[
                            styles.barSegment,
                            styles.presentSegment,
                            { flex: presentDays },
                          ]}
                        />
                      ) : null}
                    </View>
                  </View>
                  <View style={styles.monthFooter}>
                    <Text numberOfLines={1} style={styles.monthLabel}>
                      {item.month}
                    </Text>
                    <Text style={styles.monthTotal}>{monthTotal}d</Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  absentSegment: {
    backgroundColor: chartColors.absent,
  },
  barSegment: {
    minHeight: StyleSheet.hairlineWidth,
    width: '100%',
  },
  barTrack: {
    alignItems: 'center',
    backgroundColor: 'rgba(59, 145, 234, 0.09)',
    borderColor: reactNativeColorScheme.ultiHuman.surface.aquaBorderMuted,
    borderRadius: radius(8),
    borderWidth: 1,
    height: spacing(160),
    justifyContent: 'flex-end',
    padding: spacing(5),
    width: spacing(40),
  },
  card: {
    backgroundColor: reactNativeColorScheme.ultiHuman.surface.glassPanel,
    borderColor: reactNativeColorScheme.ultiHuman.surface.aquaBorderMuted,
    borderRadius: radius(8),
    borderWidth: 1,
    gap: spacing(14),
    overflow: 'hidden',
    padding: spacing(14),
    shadowColor: reactNativeColorScheme.ultiHuman.surface.cardShadow,
    shadowOffset: { height: spacing(10), width: 0 },
    shadowOpacity: 0.16,
    shadowRadius: spacing(18),
  },
  chartHeader: {
    gap: spacing(10),
  },
  chartContent: {
    gap: spacing(12),
    paddingHorizontal: spacing(2),
    paddingTop: spacing(2),
  },
  chartPanel: {
    backgroundColor: reactNativeColorScheme.ultiHuman.surface.raised,
    borderColor: reactNativeColorScheme.ultiHuman.surface.aquaBorderMuted,
    borderRadius: radius(8),
    borderWidth: 1,
    gap: spacing(5),
    padding: spacing(12),
  },
  chartTitle: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(14),
    lineHeight: spacing(19),
  },
  emptyState: {
    alignItems: 'center',
    backgroundColor: 'rgba(59, 145, 234, 0.08)',
    borderRadius: radius(8),
    gap: spacing(4),
    minHeight: spacing(156),
    justifyContent: 'center',
    padding: spacing(16),
  },
  emptyText: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansRegular,
    fontSize: fontSize(12),
    lineHeight: spacing(17),
    textAlign: 'center',
  },
  emptyTitle: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(14),
    lineHeight: spacing(20),
    textAlign: 'center',
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing(12),
    justifyContent: 'space-between',
  },
  headerCopy: {
    flex: 1,
    gap: spacing(4),
    minWidth: 0,
  },
  kicker: {
    color: reactNativeColorScheme.ultiHuman.accentPressed,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(11),
    letterSpacing: 0,
    lineHeight: spacing(15),
    textTransform: 'uppercase',
  },
  leaveSegment: {
    backgroundColor: chartColors.leave,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing(10),
  },
  legendDot: {
    borderRadius: radius(4),
    height: spacing(8),
    width: spacing(8),
  },
  legendItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing(5),
  },
  legendLabel: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansRegular,
    fontSize: fontSize(11),
    lineHeight: spacing(15),
  },
  metricCard: {
    backgroundColor: reactNativeColorScheme.ultiHuman.surface.glassAction,
    borderColor: reactNativeColorScheme.ultiHuman.surface.aquaBorderMuted,
    borderRadius: radius(8),
    borderWidth: 1,
    flex: 1,
    gap: spacing(2),
    minHeight: spacing(68),
    minWidth: spacing(92),
    paddingHorizontal: spacing(10),
    paddingVertical: spacing(10),
  },
  metricLabel: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansSemiBold,
    fontSize: fontSize(11),
    lineHeight: spacing(15),
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing(8),
  },
  metricValue: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(21),
    lineHeight: spacing(27),
  },
  monthFooter: {
    alignItems: 'center',
    gap: spacing(1),
  },
  monthColumn: {
    alignItems: 'center',
    gap: spacing(7),
    width: spacing(52),
  },
  monthLabel: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansSemiBold,
    fontSize: fontSize(12),
    lineHeight: spacing(16),
    maxWidth: spacing(50),
  },
  monthPercent: {
    color: reactNativeColorScheme.ultiHuman.accentPressed,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(11),
    lineHeight: spacing(15),
  },
  monthTotal: {
    color: reactNativeColorScheme.text.muted,
    fontFamily: AppFonts.googleSansRegular,
    fontSize: fontSize(10),
    lineHeight: spacing(14),
  },
  presentMetric: {
    backgroundColor: 'rgba(59, 145, 234, 0.14)',
  },
  presentSegment: {
    backgroundColor: chartColors.present,
  },
  progressFill: {
    backgroundColor: reactNativeColorScheme.ultiHuman.accent,
    borderRadius: radius(8),
    height: '100%',
  },
  progressHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansSemiBold,
    fontSize: fontSize(12),
    lineHeight: spacing(17),
  },
  progressPanel: {
    backgroundColor: 'rgba(255, 255, 255, 0.78)',
    borderColor: reactNativeColorScheme.ultiHuman.surface.aquaBorderMuted,
    borderRadius: radius(8),
    borderWidth: 1,
    gap: spacing(9),
    padding: spacing(12),
  },
  progressTrack: {
    backgroundColor: 'rgba(59, 145, 234, 0.13)',
    borderRadius: radius(8),
    height: spacing(10),
    overflow: 'hidden',
    width: '100%',
  },
  progressValue: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(12),
    lineHeight: spacing(17),
  },
  rateBadge: {
    alignItems: 'center',
    backgroundColor: 'rgba(59, 145, 234, 0.13)',
    borderColor: reactNativeColorScheme.ultiHuman.surface.aquaBorderSoft,
    borderRadius: radius(8),
    borderWidth: 1,
    minWidth: spacing(72),
    paddingHorizontal: spacing(10),
    paddingVertical: spacing(9),
  },
  rateLabel: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansSemiBold,
    fontSize: fontSize(10),
    lineHeight: spacing(14),
  },
  rateValue: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(20),
    lineHeight: spacing(25),
  },
  stackedBar: {
    borderRadius: radius(8),
    overflow: 'hidden',
    width: spacing(28),
  },
  subtitle: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansRegular,
    fontSize: fontSize(12),
    lineHeight: spacing(17),
  },
  title: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(19),
    lineHeight: spacing(25),
  },
});
