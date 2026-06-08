import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useEffect } from 'react';
import { Share, StyleSheet, Text, View } from 'react-native';

import { AppFonts } from '@/assets/fonts';
import { EnterpriseFeedbackBanner } from '@/design-system/components';
import { reactNativeColorScheme } from '@/design-system/tokens/colors';
import type { PayrollStackParamList } from '@/navigation/route-types';
import { fontSize, spacing } from '@/utils/scale';

import {
  formatPayrollAmount,
  InlineInfoGrid,
  PayrollAmountSummary,
  PayrollDetailSection,
  PayrollEmptyState,
  PayrollImpactList,
  PayrollQuickAction,
  PayrollScreenFrame,
  PayrollSkeletonLoader,
  PayrollStatutoryGrid,
  PayrollStatusBadge,
  SalaryBreakdownSection,
} from '../components';
import { usePayrollScreenModel } from '../hooks/usePayrollScreenModel';

type PayrollDetailScreenProps = NativeStackScreenProps<PayrollStackParamList, 'PayrollDetail'>;

const formatDate = (value: string): string => {
  if (!value) {
    return 'Not scheduled';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export const PayrollDetailScreen = ({ navigation, route }: PayrollDetailScreenProps) => {
  const {
    detailErrorMessage,
    detailStatus,
    isInitialLoading,
    loadPayrollCycle,
    refresh,
    resolveCycle,
    selectedCycle,
    snapshot,
  } = usePayrollScreenModel();
  const requestedCycleId = route.params?.cycleId;
  const cycle = requestedCycleId
    ? selectedCycle ?? resolveCycle(requestedCycleId)
    : snapshot.currentCycle;
  const isLoading = (requestedCycleId ? detailStatus === 'loading' : isInitialLoading) && !cycle;

  useEffect(() => {
    if (requestedCycleId) {
      loadPayrollCycle(requestedCycleId);
    }
  }, [loadPayrollCycle, requestedCycleId]);

  const exportPayroll = useCallback(async () => {
    if (!cycle) {
      return;
    }

    await Share.share({
      message: `${cycle.monthLabel} payroll summary: net salary ${formatPayrollAmount(
        cycle.netSalary,
      )}, gross ${formatPayrollAmount(cycle.grossSalary)}, deductions ${formatPayrollAmount(
        cycle.totalDeductions,
      )}.`,
      title: `${cycle.monthLabel} payroll summary`,
    });
  }, [cycle]);

  return (
    <PayrollScreenFrame
      isDetail
      navigation={navigation}
      onRefresh={refresh}
      returnToDashboard={route.params?.returnToDashboard}
      routeLabel="Payroll cycle"
      title={cycle?.monthLabel ?? 'Payroll detail'}
    >
      {isLoading ? (
        <PayrollSkeletonLoader />
      ) : detailErrorMessage ? (
        <EnterpriseFeedbackBanner message={detailErrorMessage} tone="error" />
      ) : cycle ? (
        <>
          <View style={styles.detailHero}>
            <View style={styles.heroHeader}>
              <View style={styles.heroCopy}>
                <Text style={styles.heroEyebrow}>Net salary</Text>
                <Text numberOfLines={1} adjustsFontSizeToFit style={styles.heroAmount}>
                  {formatPayrollAmount(cycle.netSalary)}
                </Text>
                <Text style={styles.heroMeta}>
                  {formatDate(cycle.periodStart)} to {formatDate(cycle.periodEnd)}
                </Text>
              </View>
              <PayrollStatusBadge label={cycle.statusLabel} status={cycle.status} />
            </View>
            <PayrollAmountSummary
              grossSalary={cycle.grossSalary}
              netSalary={cycle.netSalary}
              totalDeductions={cycle.totalDeductions}
            />
          </View>

          <View style={styles.actionRow}>
            <PayrollQuickAction icon="share-2" label="Share summary" onPress={exportPayroll} />
            <PayrollQuickAction icon="file-text" label="Payslip detail" onPress={exportPayroll} />
          </View>

          <SalaryBreakdownSection
            items={cycle.earnings}
            subtotal={cycle.grossSalary}
            title="Earnings breakdown"
            type="earnings"
          />
          <SalaryBreakdownSection
            items={cycle.deductions}
            subtotal={cycle.totalDeductions}
            title="Deductions breakdown"
            type="deductions"
          />

          <PayrollDetailSection icon="activity" title="Attendance-linked salary impact">
            <PayrollImpactList items={cycle.attendanceImpact} />
          </PayrollDetailSection>

          <PayrollDetailSection icon="calendar" title="Leave impact">
            <PayrollImpactList items={cycle.leaveImpact} />
          </PayrollDetailSection>

          <PayrollDetailSection icon="shield" title="Tax and statutory details">
            <PayrollStatutoryGrid details={cycle.statutoryDetails} />
          </PayrollDetailSection>

          <PayrollDetailSection icon="credit-card" title="Payment information">
            <InlineInfoGrid
              items={[
                { label: 'Method', value: cycle.paymentInfo.method },
                { label: 'Bank', value: cycle.paymentInfo.bankName },
                { label: 'Account', value: cycle.paymentInfo.bankAccount },
                { label: 'Reference', value: cycle.paymentInfo.reference },
                { label: 'Payment date', value: formatDate(cycle.paymentDate) },
                { label: 'Payslip', value: cycle.payslipStatus === 'generated' ? 'Generated' : 'Not available' },
              ]}
              style={styles.detailGrid}
            />
          </PayrollDetailSection>
        </>
      ) : (
        <PayrollEmptyState
          message="This payroll cycle could not be found. Pull down to refresh payroll history."
          title="Payroll cycle unavailable"
        />
      )}
    </PayrollScreenFrame>
  );
};

const styles = StyleSheet.create({
  actionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing(9),
  },
  detailGrid: {
    padding: spacing(14),
    paddingTop: spacing(8),
  },
  detailHero: {
    backgroundColor: reactNativeColorScheme.ultiHuman.surface.glassPanel,
    borderColor: reactNativeColorScheme.ultiHuman.surface.aquaBorderMuted,
    borderRadius: spacing(8),
    borderWidth: 1,
    gap: spacing(16),
    padding: spacing(16),
    shadowColor: reactNativeColorScheme.ultiHuman.surface.cardShadow,
    shadowOffset: { height: spacing(8), width: 0 },
    shadowOpacity: 0.18,
    shadowRadius: spacing(16),
  },
  heroAmount: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(30),
    lineHeight: spacing(38),
  },
  heroCopy: {
    flex: 1,
    gap: spacing(3),
    minWidth: 0,
  },
  heroEyebrow: {
    color: reactNativeColorScheme.ultiHuman.module.accentPressed,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(11),
    lineHeight: spacing(15),
    textTransform: 'uppercase',
  },
  heroHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing(12),
  },
  heroMeta: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansMedium,
    fontSize: fontSize(12),
    lineHeight: spacing(16),
  },
});
