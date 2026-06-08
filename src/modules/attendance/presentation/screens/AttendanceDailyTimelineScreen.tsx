import { useEffect } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { AppFonts } from '@/assets/fonts';
import { EnterpriseFeedbackBanner } from '@/design-system/components';
import { reactNativeColorScheme } from '@/design-system/tokens/colors';
import type { AttendanceStackParamList } from '@/navigation/route-types';
import { fontSize, radius, spacing } from '@/utils/scale';

import {
  AttendanceScreenFrame,
  AttendanceSkeleton,
  TimelineItem,
} from '../components';
import {
  minutesToDuration,
  useAttendanceScreenModel,
} from '../hooks/useAttendanceScreenModel';

const moduleColors = reactNativeColorScheme.ultiHuman.module;

type AttendanceDailyTimelineScreenProps = NativeStackScreenProps<
  AttendanceStackParamList,
  'AttendanceDailyTimeline'
>;

export const AttendanceDailyTimelineScreen = ({
  navigation,
  route,
}: AttendanceDailyTimelineScreenProps) => {
  const {
    dayDetail,
    dayErrorMessage,
    dayStatus,
    isRefreshing,
    loadDay,
    refresh,
  } = useAttendanceScreenModel();
  const date = route.params?.date;

  useEffect(() => {
    loadDay(date);
  }, [date, loadDay]);

  return (
    <AttendanceScreenFrame
      isDetail
      navigation={navigation}
      onRefresh={() => {
        refresh();
        loadDay(date);
      }}
      refreshing={isRefreshing || dayStatus === 'loading'}
      returnToDashboard={route.params?.returnToDashboard}
      routeLabel="Attendance"
      title="Daily Timeline"
    >
      {dayStatus === 'loading' && !dayDetail ? (
        <AttendanceSkeleton />
      ) : dayErrorMessage ? (
        <EnterpriseFeedbackBanner message={dayErrorMessage} tone="error" />
      ) : dayDetail ? (
        <>
          <LinearGradient
            colors={moduleColors.heroGradient}
            end={{ x: 1, y: 1 }}
            start={{ x: 0, y: 0 }}
            style={styles.dayHero}
          >
            <Text style={styles.dayLabel}>{dayDetail.dateLabel}</Text>
            <Text style={styles.dayStatus}>{dayDetail.statusLabel}</Text>
            <Text style={styles.dayMeta}>
              {dayDetail.shiftLabel} - {dayDetail.location}
            </Text>
          </LinearGradient>

          <View style={styles.summaryGrid}>
            <DayStat label="Total" value={minutesToDuration(dayDetail.totalMinutes)} />
            <DayStat label="Break" value={minutesToDuration(dayDetail.breakMinutes)} />
            <DayStat label="Late" value={`${dayDetail.lateByMinutes}m`} />
            <DayStat label="Early" value={`${dayDetail.earlyByMinutes}m`} />
          </View>

          <View style={styles.timelinePanel}>
            {dayDetail.punches.length ? (
              dayDetail.punches.map((item, index) => (
                <TimelineItem
                  isLast={index === dayDetail.punches.length - 1}
                  item={item}
                  key={item.id}
                />
              ))
            ) : (
              <EnterpriseFeedbackBanner
                message="No punch timeline was recorded for this day."
                tone="empty"
              />
            )}
          </View>
        </>
      ) : (
        <EnterpriseFeedbackBanner message="No attendance detail is available." tone="empty" />
      )}
    </AttendanceScreenFrame>
  );
};

const DayStat = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.dayStat}>
    <Text style={styles.dayStatValue}>{value}</Text>
    <Text style={styles.dayStatLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  dayHero: {
    backgroundColor: moduleColors.heroOverlay,
    borderColor: moduleColors.borderStrong,
    borderRadius: radius(8),
    borderWidth: 1,
    gap: spacing(4),
    padding: spacing(18),
    shadowColor: moduleColors.shadow,
    shadowOffset: { height: spacing(10), width: 0 },
    shadowOpacity: 0.11,
    shadowRadius: spacing(16),
  },
  dayLabel: {
    color: moduleColors.accentPressed,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(12),
    lineHeight: spacing(17),
    textTransform: 'uppercase',
  },
  dayMeta: {
    color: moduleColors.softText,
    fontFamily: AppFonts.googleSansMedium,
    fontSize: fontSize(13),
    lineHeight: spacing(18),
  },
  dayStat: {
    backgroundColor: reactNativeColorScheme.ultiHuman.surface.glassPanel,
    borderColor: reactNativeColorScheme.ultiHuman.surface.aquaBorderMuted,
    borderRadius: radius(8),
    borderWidth: 1,
    flex: 1,
    gap: spacing(2),
    minWidth: spacing(112),
    padding: spacing(13),
  },
  dayStatLabel: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansMedium,
    fontSize: fontSize(11),
    lineHeight: spacing(15),
  },
  dayStatValue: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(18),
    lineHeight: spacing(23),
  },
  dayStatus: {
    color: moduleColors.heroText,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(26),
    lineHeight: spacing(32),
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing(9),
  },
  timelinePanel: {
    backgroundColor: reactNativeColorScheme.ultiHuman.surface.glassPanel,
    borderColor: reactNativeColorScheme.ultiHuman.surface.aquaBorderMuted,
    borderRadius: radius(8),
    borderWidth: 1,
    padding: spacing(14),
  },
});
