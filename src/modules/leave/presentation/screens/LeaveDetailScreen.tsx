import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { EnterpriseFeedbackBanner } from '@/design-system/components';
import { reactNativeColorScheme } from '@/design-system/tokens/colors';
import { leaveTypeLabel } from '@/modules/leave/domain/entities/Leave';
import type { LeaveStackParamList } from '@/navigation/route-types';
import { fontSize, radius, spacing } from '@/utils/scale';
import { AppFonts } from '@/assets/fonts';

import {
  formatLeaveDateLong,
  LeaveScreenFrame,
  LeaveSkeleton,
  LeaveTimeline,
} from '../components';
import { useLeaveScreenModel } from '../hooks/useLeaveScreenModel';

type LeaveDetailScreenProps = NativeStackScreenProps<LeaveStackParamList, 'LeaveDetail'>;
const moduleColors = reactNativeColorScheme.ultiHuman.module;

export const LeaveDetailScreen = ({ navigation, route }: LeaveDetailScreenProps) => {
  const {
    detailErrorMessage,
    detailStatus,
    loadLeaveDetail,
    selectedLeave,
  } = useLeaveScreenModel();

  useEffect(() => {
    loadLeaveDetail(route.params.leaveId);
  }, [loadLeaveDetail, route.params.leaveId]);

  return (
    <LeaveScreenFrame isDetail navigation={navigation} title="Leave detail">
      {detailStatus === 'loading' ? <LeaveSkeleton /> : null}
      {detailErrorMessage ? (
        <EnterpriseFeedbackBanner message={detailErrorMessage} tone="error" />
      ) : null}
      {selectedLeave ? (
        <>
          <LinearGradient
            colors={moduleColors.heroGradient}
            end={{ x: 1, y: 1 }}
            start={{ x: 0, y: 0 }}
            style={styles.detailHero}
          >
            <Text style={styles.detailKicker}>{selectedLeave.statusLabel}</Text>
            <Text style={styles.detailTitle}>{leaveTypeLabel[selectedLeave.type]}</Text>
            <Text style={styles.detailMeta}>
              {formatLeaveDateLong(selectedLeave.startDate)} - {formatLeaveDateLong(selectedLeave.endDate)}
            </Text>
            <View style={styles.detailStats}>
              <MiniStat label="Days" value={`${selectedLeave.days}`} />
              <MiniStat label="Approver" value={selectedLeave.approverName} />
              <MiniStat label="Submitted" value={selectedLeave.submittedAt} />
            </View>
          </LinearGradient>
          <View style={styles.reasonPanel}>
            <Text style={styles.reasonLabel}>Reason</Text>
            <Text style={styles.reasonText}>{selectedLeave.reason}</Text>
          </View>
          <LeaveTimeline request={selectedLeave} />
        </>
      ) : null}
    </LeaveScreenFrame>
  );
};

const MiniStat = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.miniStat}>
    <Text style={styles.miniLabel}>{label}</Text>
    <Text numberOfLines={1} style={styles.miniValue}>
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  detailHero: {
    backgroundColor: moduleColors.heroOverlay,
    borderColor: moduleColors.borderStrong,
    borderRadius: radius(8),
    borderWidth: 1,
    gap: spacing(10),
    padding: spacing(16),
    shadowColor: moduleColors.shadow,
    shadowOffset: { height: spacing(10), width: 0 },
    shadowOpacity: 0.11,
    shadowRadius: spacing(16),
  },
  detailKicker: {
    color: moduleColors.accentPressed,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(11),
    lineHeight: spacing(15),
    textTransform: 'uppercase',
  },
  detailMeta: {
    color: moduleColors.softText,
    fontFamily: AppFonts.googleSansRegular,
    fontSize: fontSize(13),
    lineHeight: spacing(18),
  },
  detailStats: {
    flexDirection: 'row',
    gap: spacing(8),
  },
  detailTitle: {
    color: moduleColors.heroText,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(22),
    lineHeight: spacing(28),
  },
  miniLabel: {
    color: moduleColors.softText,
    fontFamily: AppFonts.googleSansRegular,
    fontSize: fontSize(10),
    lineHeight: spacing(13),
  },
  miniStat: {
    backgroundColor: moduleColors.heroMetric,
    borderColor: moduleColors.border,
    borderRadius: radius(8),
    borderWidth: 1,
    flex: 1,
    gap: spacing(2),
    padding: spacing(9),
  },
  miniValue: {
    color: moduleColors.heroText,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(12),
    lineHeight: spacing(16),
  },
  reasonLabel: {
    color: moduleColors.accentPressed,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(11),
    lineHeight: spacing(15),
    textTransform: 'uppercase',
  },
  reasonPanel: {
    backgroundColor: reactNativeColorScheme.ultiHuman.surface.glassPanel,
    borderColor: reactNativeColorScheme.ultiHuman.surface.aquaBorderMuted,
    borderRadius: radius(8),
    borderWidth: 1,
    gap: spacing(5),
    padding: spacing(13),
  },
  reasonText: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansRegular,
    fontSize: fontSize(13),
    lineHeight: spacing(19),
  },
});
