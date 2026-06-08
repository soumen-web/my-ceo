import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppFonts } from '@/assets/fonts';
import { EnterpriseFeedbackBanner } from '@/design-system/components';
import { reactNativeColorScheme } from '@/design-system/tokens/colors';
import type { AttendanceStackParamList } from '@/navigation/route-types';
import { ROUTES } from '@/navigation/route-types';
import { fontSize, radius, spacing } from '@/utils/scale';

import {
  AttendanceHeroCard,
  AttendanceMetricStrip,
  AttendanceScreenFrame,
  AttendanceSkeleton,
  WeeklyTrendPreview,
  WorkModeInsights,
} from '../components';
import { useAttendanceScreenModel } from '../hooks/useAttendanceScreenModel';

const moduleColors = reactNativeColorScheme.ultiHuman.module;

type AttendanceDetailScreenProps = NativeStackScreenProps<
  AttendanceStackParamList,
  'AttendanceDetail'
>;

export const AttendanceDetailScreen = ({ navigation }: AttendanceDetailScreenProps) => {
  const {
    attendanceRateLabel,
    errorMessage,
    isInitialLoading,
    isRefreshing,
    punchActionLabel,
    punchActionType,
    punchStatus,
    readinessLabel,
    recordPunch,
    refresh,
    snapshot,
    varianceLabel,
    workDurationLabel,
  } = useAttendanceScreenModel();

  return (
    <AttendanceScreenFrame
      isDetail
      navigation={navigation}
      onRefresh={refresh}
      refreshing={isRefreshing}
      routeLabel="Attendance"
      title="Daily Status"
    >
      {isInitialLoading ? (
        <AttendanceSkeleton />
      ) : (
        <>
          {errorMessage ? <EnterpriseFeedbackBanner message={errorMessage} tone="error" /> : null}
          <AttendanceHeroCard
            attendanceRateLabel={attendanceRateLabel}
            isPunching={punchStatus === 'loading'}
            onPunchPress={() => recordPunch({ type: punchActionType })}
            punchActionLabel={punchActionLabel}
            readinessLabel={readinessLabel}
            today={snapshot.today}
            varianceLabel={varianceLabel}
            workDurationLabel={workDurationLabel}
          />
          <View style={styles.summaryPanel}>
            <DetailStat icon="log-in" label="First in" value={snapshot.today.firstInTime} />
            <DetailStat icon="log-out" label="Last out" value={snapshot.today.lastOutTime} />
            <DetailStat icon="calendar" label="Status" value={snapshot.today.statusLabel} />
            <DetailStat icon="map-pin" label="Mode" value={snapshot.today.workMode.toUpperCase()} />
          </View>
          <AttendanceMetricStrip metrics={snapshot.metrics} />
          <WeeklyTrendPreview data={snapshot.trends} />
          <WorkModeInsights data={snapshot.workModes} />
          <Pressable
            accessibilityRole="button"
            onPress={() => navigation.navigate(ROUTES.attendanceDailyTimeline, {})}
            style={({ pressed }) => [styles.timelineButton, pressed && styles.pressed]}
          >
            <Text style={styles.timelineText}>Open daily timeline</Text>
            <Feather color={moduleColors.icon} name="arrow-right" size={spacing(18)} />
          </Pressable>
        </>
      )}
    </AttendanceScreenFrame>
  );
};

const DetailStat = ({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string;
}) => (
  <View style={styles.detailStat}>
    <Feather color={moduleColors.icon} name={icon} size={spacing(16)} />
    <Text style={styles.detailLabel}>{label}</Text>
    <Text numberOfLines={1} style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  detailLabel: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansMedium,
    fontSize: fontSize(11),
    lineHeight: spacing(15),
  },
  detailStat: {
    backgroundColor: reactNativeColorScheme.ultiHuman.surface.glassPanel,
    borderColor: reactNativeColorScheme.ultiHuman.surface.aquaBorderMuted,
    borderRadius: radius(8),
    borderWidth: 1,
    flex: 1,
    gap: spacing(4),
    minWidth: spacing(132),
    padding: spacing(13),
  },
  detailValue: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(16),
    lineHeight: spacing(21),
  },
  pressed: {
    transform: [{ scale: 0.985 }],
  },
  summaryPanel: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing(9),
  },
  timelineButton: {
    alignItems: 'center',
    backgroundColor: moduleColors.accentSoft,
    borderColor: reactNativeColorScheme.ultiHuman.surface.aquaBorderSoft,
    borderRadius: radius(8),
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: spacing(54),
    paddingHorizontal: spacing(14),
  },
  timelineText: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(14),
    lineHeight: spacing(19),
  },
});
