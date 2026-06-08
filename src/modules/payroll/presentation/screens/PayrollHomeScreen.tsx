import { Feather } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback } from 'react';
import { Share, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { AppFonts } from '@/assets/fonts';
import { EnterpriseFeedbackBanner } from '@/design-system/components';
import type { PayrollCycle, PayslipSummary } from '@/modules/payroll/domain/entities/Payroll';
import type { PayrollStackParamList } from '@/navigation/route-types';
import { ROUTES } from '@/navigation/route-types';
import { fontSize, spacing } from '@/utils/scale';
import { reactNativeColorScheme } from '@/design-system/tokens/colors';

import {
  formatPayrollAmount,
  PayslipCard,
  PayrollEmptyState,
  PayrollHistoryTimeline,
  PayrollOverviewCard,
  PayrollQuickAction,
  PayrollScreenFrame,
  PayrollSkeletonLoader,
  SalaryBreakdownSection,
} from '../components';
import { usePayrollScreenModel } from '../hooks/usePayrollScreenModel';

type PayrollHomeScreenProps = NativeStackScreenProps<PayrollStackParamList, 'PayrollHome'>;

export const PayrollHomeScreen = ({ navigation }: PayrollHomeScreenProps) => {
  const { width } = useWindowDimensions();
  const {
    errorMessage,
    isInitialLoading,
    isRefreshing,
    paidCycles,
    payrollDelta,
    refresh,
    snapshot,
  } = usePayrollScreenModel();
  const currentCycle = snapshot.currentCycle;
  const payslipCardWidth = Math.min(width - spacing(48), spacing(292));

  const openCycle = useCallback(
    (cycle: PayrollCycle) => {
      navigation.navigate(ROUTES.payrollDetail, { cycleId: cycle.id });
    },
    [navigation],
  );

  const viewPayslip = useCallback(
    (payslip: PayslipSummary) => {
      navigation.navigate(ROUTES.payrollDetail, { cycleId: payslip.cycleId });
    },
    [navigation],
  );

  const sharePayslip = useCallback(async (payslip: PayslipSummary) => {
    await Share.share({
      message: `${payslip.monthLabel} payslip: net salary ${formatPayrollAmount(
        payslip.netSalary,
      )}, status ${payslip.statusLabel}.`,
      title: `${payslip.monthLabel} payslip`,
    });
  }, []);

  const downloadPayslip = useCallback(async (payslip: PayslipSummary) => {
    await Share.share({
      message: `${payslip.monthLabel} payslip export is ready for secure sharing from MyCEO.`,
      title: `${payslip.monthLabel} payslip export`,
    });
  }, []);

  return (
    <PayrollScreenFrame
      navigation={navigation}
      onRefresh={refresh}
      refreshing={isRefreshing}
      title="Payroll"
    >
      {isInitialLoading ? (
        <PayrollSkeletonLoader />
      ) : errorMessage ? (
        <EnterpriseFeedbackBanner message={errorMessage} tone="error" />
      ) : currentCycle ? (
        <>
          <PayrollOverviewCard cycle={currentCycle} payrollDelta={payrollDelta} />

          <ScrollView
            horizontal
            contentContainerStyle={styles.actionDock}
            showsHorizontalScrollIndicator={false}
          >
            <PayrollQuickAction
              icon="file-text"
              label="Current payslip"
              onPress={() => openCycle(currentCycle)}
            />
            <PayrollQuickAction
              icon="clock"
              label="History"
              onPress={() => openCycle(snapshot.history[0] ?? currentCycle)}
            />
            <PayrollQuickAction
              icon="shield"
              label={`${paidCycles} paid cycles`}
              onPress={() => openCycle(currentCycle)}
            />
          </ScrollView>

          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderCopy}>
              <Text style={styles.sectionEyebrow}>Salary breakup</Text>
              <Text style={styles.sectionTitle}>Earnings and deductions</Text>
            </View>
            <Feather
              color={reactNativeColorScheme.ultiHuman.module.icon}
              name="pie-chart"
              size={spacing(19)}
            />
          </View>

          <SalaryBreakdownSection
            items={currentCycle.earnings}
            subtotal={currentCycle.grossSalary}
            title="Earnings"
            type="earnings"
          />
          <SalaryBreakdownSection
            initiallyExpanded={false}
            items={currentCycle.deductions}
            subtotal={currentCycle.totalDeductions}
            title="Deductions"
            type="deductions"
          />

          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderCopy}>
              <Text style={styles.sectionEyebrow}>Payslips</Text>
              <Text style={styles.sectionTitle}>Month-wise statements</Text>
            </View>
          </View>
          <ScrollView
            horizontal
            contentContainerStyle={styles.payslipRail}
            showsHorizontalScrollIndicator={false}
          >
            {snapshot.payslips.map((payslip) => (
              <View key={payslip.id} style={[styles.payslipItem, { width: payslipCardWidth }]}>
                <PayslipCard
                  onDownload={downloadPayslip}
                  onShare={sharePayslip}
                  onView={viewPayslip}
                  payslip={payslip}
                />
              </View>
            ))}
          </ScrollView>

          <PayrollHistoryTimeline cycles={snapshot.history} onPressCycle={openCycle} />
        </>
      ) : (
        <PayrollEmptyState />
      )}
    </PayrollScreenFrame>
  );
};

const styles = StyleSheet.create({
  actionDock: {
    flexDirection: 'row',
    gap: spacing(9),
    paddingRight: spacing(8),
  },
  payslipItem: {
    maxWidth: spacing(292),
  },
  payslipRail: {
    gap: spacing(10),
    paddingRight: spacing(8),
  },
  sectionEyebrow: {
    color: reactNativeColorScheme.ultiHuman.module.accentPressed,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(10),
    lineHeight: spacing(14),
    textTransform: 'uppercase',
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing(12),
  },
  sectionHeaderCopy: {
    flex: 1,
    gap: spacing(2),
    minWidth: 0,
  },
  sectionTitle: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(16),
    lineHeight: spacing(22),
  },
});
