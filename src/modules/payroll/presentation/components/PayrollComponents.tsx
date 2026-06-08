import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { memo, useState } from 'react';
import {
  LayoutAnimation,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { AppFonts } from '@/assets/fonts';
import { EnterpriseFeedbackBanner, PremiumSkeleton } from '@/design-system/components';
import { reactNativeColorScheme } from '@/design-system/tokens/colors';
import type {
  PayrollAmountItem,
  PayrollCycle,
  PayrollImpactItem,
  PayrollStatutoryDetail,
  PayrollStatus,
  PayslipStatus,
  PayslipSummary,
} from '@/modules/payroll/domain/entities/Payroll';
import { fontSize, radius, spacing } from '@/utils/scale';

const moduleColors = reactNativeColorScheme.ultiHuman.module;
const surface = reactNativeColorScheme.ultiHuman.surface;

export const formatPayrollAmount = (amount: number): string =>
  new Intl.NumberFormat('en-IN', {
    currency: 'INR',
    maximumFractionDigits: 0,
    style: 'currency',
  }).format(amount);

const formatPayrollDate = (value: string): string => {
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

const statusTone = (status: PayrollStatus | PayslipStatus) => {
  if (status === 'paid' || status === 'generated') {
    return reactNativeColorScheme.status.success;
  }

  if (status === 'failed' || status === 'not-available') {
    return reactNativeColorScheme.status.danger;
  }

  if (status === 'on-hold' || status === 'pending' || status === 'generating') {
    return reactNativeColorScheme.status.warning;
  }

  return reactNativeColorScheme.status.info;
};

export const PayrollStatusBadge = ({
  label,
  status,
}: {
  label: string;
  status: PayrollStatus | PayslipStatus;
}) => {
  const tone = statusTone(status);

  return (
    <View style={[styles.statusBadge, { backgroundColor: tone.background, borderColor: tone.border }]}>
      <View style={[styles.statusDot, { backgroundColor: tone.strong }]} />
      <Text style={[styles.statusText, { color: tone.foreground }]}>{label}</Text>
    </View>
  );
};

export const PayrollAmountSummary = ({
  grossSalary,
  netSalary,
  totalDeductions,
}: {
  grossSalary: number;
  netSalary: number;
  totalDeductions: number;
}) => (
  <View style={styles.amountSummary}>
    <View style={styles.amountTile}>
      <Text style={styles.amountTileLabel}>Gross salary</Text>
      <Text numberOfLines={1} adjustsFontSizeToFit style={styles.amountTileValue}>
        {formatPayrollAmount(grossSalary)}
      </Text>
    </View>
    <View style={styles.amountTile}>
      <Text style={styles.amountTileLabel}>Deductions</Text>
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        style={[styles.amountTileValue, styles.negativeValue]}
      >
        -{formatPayrollAmount(totalDeductions)}
      </Text>
    </View>
    <View style={[styles.amountTile, styles.netAmountTile]}>
      <Text style={styles.amountTileLabel}>Net payable</Text>
      <Text numberOfLines={1} adjustsFontSizeToFit style={styles.netAmountTileValue}>
        {formatPayrollAmount(netSalary)}
      </Text>
    </View>
  </View>
);

export const PayrollOverviewCard = ({
  cycle,
  payrollDelta,
}: {
  cycle: PayrollCycle;
  payrollDelta: number;
}) => (
  <LinearGradient
    colors={moduleColors.heroGradient}
    end={{ x: 1, y: 1 }}
    start={{ x: 0, y: 0 }}
    style={styles.overviewCard}
  >
    <View style={styles.overviewHeader}>
      <View style={styles.overviewIconFrame}>
        <Feather color={moduleColors.icon} name="credit-card" size={spacing(21)} />
      </View>
      <View style={styles.overviewHeaderCopy}>
        <Text style={styles.overviewEyebrow}>Current payroll cycle</Text>
        <Text style={styles.overviewTitle}>{cycle.monthLabel}</Text>
      </View>
      <PayrollStatusBadge label={cycle.statusLabel} status={cycle.status} />
    </View>

    <View style={styles.netPayBlock}>
      <Text style={styles.netPayLabel}>Net payable amount</Text>
      <Text numberOfLines={1} adjustsFontSizeToFit style={styles.netPayValue}>
        {formatPayrollAmount(cycle.netSalary)}
      </Text>
      <Text style={styles.netPayMeta}>
        {payrollDelta >= 0 ? '+' : ''}
        {payrollDelta}% vs previous cycle
      </Text>
    </View>

    <PayrollAmountSummary
      grossSalary={cycle.grossSalary}
      netSalary={cycle.netSalary}
      totalDeductions={cycle.totalDeductions}
    />

    <View style={styles.metadataGrid}>
      <MetadataTile label="Payment date" value={formatPayrollDate(cycle.paymentDate)} />
      <MetadataTile label="Payroll ID" value={cycle.employee.payrollId} />
      <MetadataTile label="Cost center" value={cycle.employee.costCenter} />
      <MetadataTile label="Pay grade" value={cycle.employee.payGrade} />
    </View>
  </LinearGradient>
);

const MetadataTile = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.metadataTile}>
    <Text style={styles.metadataLabel}>{label}</Text>
    <Text numberOfLines={1} style={styles.metadataValue}>{value}</Text>
  </View>
);

const AmountRows = ({ items, tone }: { items: PayrollAmountItem[]; tone: 'negative' | 'positive' }) => (
  <View style={styles.breakdownRows}>
    {items.map((item) => (
      <View key={item.id} style={styles.breakdownRow}>
        <View style={styles.breakdownCopy}>
          <Text style={styles.breakdownLabel}>{item.label}</Text>
          {item.note ? <Text style={styles.breakdownNote}>{item.note}</Text> : null}
        </View>
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          style={[
            styles.breakdownAmount,
            tone === 'positive' ? styles.positiveValue : styles.negativeValue,
          ]}
        >
          {tone === 'negative' && item.amount > 0 ? '-' : ''}
          {formatPayrollAmount(item.amount)}
        </Text>
      </View>
    ))}
  </View>
);

export const EarningsList = ({ items }: { items: PayrollAmountItem[] }) => (
  <AmountRows items={items} tone="positive" />
);

export const DeductionsList = ({ items }: { items: PayrollAmountItem[] }) => (
  <AmountRows items={items} tone="negative" />
);

export const SalaryBreakdownSection = ({
  initiallyExpanded = true,
  items,
  subtotal,
  title,
  type,
}: {
  initiallyExpanded?: boolean;
  items: PayrollAmountItem[];
  subtotal: number;
  title: string;
  type: 'deductions' | 'earnings';
}) => {
  const [expanded, setExpanded] = useState(initiallyExpanded);
  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((value) => !value);
  };
  const isEarnings = type === 'earnings';

  return (
    <View style={styles.sectionCard}>
      <Pressable
        accessibilityRole="button"
        onPress={toggle}
        style={({ pressed }) => [styles.sectionHeader, pressed ? styles.pressed : undefined]}
      >
        <View style={[styles.sectionIcon, isEarnings ? styles.positiveSurface : styles.negativeSurface]}>
          <Feather
            color={isEarnings ? reactNativeColorScheme.status.success.strong : reactNativeColorScheme.status.danger.strong}
            name={isEarnings ? 'trending-up' : 'trending-down'}
            size={spacing(18)}
          />
        </View>
        <View style={styles.sectionTitleWrap}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <Text style={styles.sectionSubtitle}>
            {items.length} payroll lines
          </Text>
        </View>
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          style={[styles.sectionSubtotal, isEarnings ? styles.positiveValue : styles.negativeValue]}
        >
          {isEarnings ? '' : '-'}
          {formatPayrollAmount(subtotal)}
        </Text>
        <Feather
          color={reactNativeColorScheme.text.secondary}
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={spacing(18)}
        />
      </Pressable>
      {expanded ? (
        isEarnings ? <EarningsList items={items} /> : <DeductionsList items={items} />
      ) : null}
    </View>
  );
};

export const PayslipCard = memo(({
  onDownload,
  onShare,
  onView,
  payslip,
}: {
  onDownload: (payslip: PayslipSummary) => void;
  onShare: (payslip: PayslipSummary) => void;
  onView: (payslip: PayslipSummary) => void;
  payslip: PayslipSummary;
}) => {
  const isAvailable = payslip.payslipStatus === 'generated';

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onView(payslip)}
      style={({ pressed }) => [styles.payslipCard, pressed ? styles.pressed : undefined]}
    >
      <View style={styles.payslipHeader}>
        <View style={styles.payslipIcon}>
          <Feather color={moduleColors.icon} name="file-text" size={spacing(19)} />
        </View>
        <View style={styles.payslipCopy}>
          <Text style={styles.payslipTitle}>{payslip.monthLabel}</Text>
          <Text style={styles.payslipSubtitle}>
            Paid {formatPayrollDate(payslip.paymentDate)}
          </Text>
        </View>
        <PayrollStatusBadge
          label={isAvailable ? 'Generated' : 'Unavailable'}
          status={payslip.payslipStatus}
        />
      </View>
      <View style={styles.payslipFooter}>
        <Text numberOfLines={1} adjustsFontSizeToFit style={styles.payslipAmount}>
          {formatPayrollAmount(payslip.netSalary)}
        </Text>
        <View style={styles.payslipActions}>
          <ActionIcon disabled={!isAvailable} icon="download" onPress={() => onDownload(payslip)} />
          <ActionIcon disabled={!isAvailable} icon="share-2" onPress={() => onShare(payslip)} />
          <ActionIcon icon="eye" onPress={() => onView(payslip)} />
        </View>
      </View>
    </Pressable>
  );
});

PayslipCard.displayName = 'PayslipCard';

const ActionIcon = ({
  disabled = false,
  icon,
  onPress,
}: {
  disabled?: boolean;
  icon: keyof typeof Feather.glyphMap;
  onPress: () => void;
}) => (
  <Pressable
    accessibilityRole="button"
    disabled={disabled}
    onPress={onPress}
    style={({ pressed }) => [
      styles.actionIcon,
      disabled ? styles.actionIconDisabled : undefined,
      pressed ? styles.pressed : undefined,
    ]}
  >
    <Feather
      color={disabled ? reactNativeColorScheme.text.disabled : moduleColors.icon}
      name={icon}
      size={spacing(16)}
    />
  </Pressable>
);

export const PayrollHistoryTimeline = ({
  cycles,
  onPressCycle,
}: {
  cycles: PayrollCycle[];
  onPressCycle: (cycle: PayrollCycle) => void;
}) => (
  <View style={styles.timelineCard}>
    <View style={styles.timelineHeader}>
      <Text style={styles.cardTitle}>Payroll history</Text>
      <Text style={styles.cardMeta}>{cycles.length} cycles</Text>
    </View>
    <View style={styles.timelineList}>
      {cycles.map((cycle, index) => (
        <Pressable
          accessibilityRole="button"
          key={cycle.id}
          onPress={() => onPressCycle(cycle)}
          style={({ pressed }) => [
            styles.timelineRow,
            pressed ? styles.pressed : undefined,
          ]}
        >
          <View style={styles.timelineRail}>
            <View style={styles.timelineDot} />
            {index < cycles.length - 1 ? <View style={styles.timelineLine} /> : null}
          </View>
          <View style={styles.timelineBody}>
            <View style={styles.timelineTop}>
              <View style={styles.timelineCopy}>
                <Text style={styles.timelineTitle}>{cycle.monthLabel}</Text>
                <Text style={styles.timelineSubtitle}>
                  {formatPayrollDate(cycle.paymentDate)}
                </Text>
              </View>
              <Text numberOfLines={1} adjustsFontSizeToFit style={styles.timelineAmount}>
                {formatPayrollAmount(cycle.netSalary)}
              </Text>
            </View>
            <View style={styles.timelineMeta}>
              <PayrollStatusBadge label={cycle.statusLabel} status={cycle.status} />
              <PayrollStatusBadge
                label={cycle.payslipStatus === 'generated' ? 'Payslip ready' : 'No payslip'}
                status={cycle.payslipStatus}
              />
            </View>
          </View>
        </Pressable>
      ))}
    </View>
  </View>
);

export const PayrollDetailSection = ({
  children,
  icon = 'shield',
  title,
}: {
  children: ReactNode;
  icon?: keyof typeof Feather.glyphMap;
  title: string;
}) => (
  <View style={styles.sectionCard}>
    <View style={styles.detailHeader}>
      <View style={styles.sectionIcon}>
        <Feather color={moduleColors.icon} name={icon} size={spacing(18)} />
      </View>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
    {children}
  </View>
);

export const PayrollImpactList = ({
  items,
}: {
  items: PayrollImpactItem[];
}) => (
  <View style={styles.breakdownRows}>
    {items.map((item) => (
      <View key={item.id} style={styles.breakdownRow}>
        <View style={styles.breakdownCopy}>
          <Text style={styles.breakdownLabel}>{item.label}</Text>
          <Text style={styles.breakdownNote}>{item.note}</Text>
        </View>
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          style={[
            styles.breakdownAmount,
            item.amount >= 0 ? styles.positiveValue : styles.negativeValue,
          ]}
        >
          {formatPayrollAmount(item.amount)}
        </Text>
      </View>
    ))}
  </View>
);

export const PayrollStatutoryGrid = ({
  details,
}: {
  details: PayrollStatutoryDetail[];
}) => (
  <View style={styles.metadataGrid}>
    {details.map((detail) => (
      <MetadataTile key={detail.id} label={detail.label} value={detail.value} />
    ))}
  </View>
);

export const PayrollEmptyState = ({
  message = 'Payroll information will appear when your payroll cycle is published.',
  title = 'No payroll data',
}: {
  message?: string;
  title?: string;
}) => <EnterpriseFeedbackBanner message={message} title={title} tone="empty" />;

export const PayrollSkeletonLoader = () => (
  <View style={styles.skeletonStack}>
    <PremiumSkeleton style={[styles.skeletonBlock, styles.skeletonHero]} />
    <View style={styles.skeletonRow}>
      <PremiumSkeleton style={styles.skeletonLine} />
      <PremiumSkeleton style={styles.skeletonLineShort} />
    </View>
    <PremiumSkeleton style={styles.skeletonBlock} />
    <PremiumSkeleton style={styles.skeletonBlock} />
  </View>
);

export const PayrollQuickAction = ({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress: () => void;
}) => (
  <Pressable
    accessibilityRole="button"
    onPress={onPress}
    style={({ pressed }) => [styles.quickAction, pressed ? styles.pressed : undefined]}
  >
    <Feather color={moduleColors.icon} name={icon} size={spacing(17)} />
    <Text style={styles.quickActionText}>{label}</Text>
  </Pressable>
);

export const InlineInfoGrid = ({
  items,
  style,
}: {
  items: { label: string; value: string }[];
  style?: StyleProp<ViewStyle>;
}) => (
  <View style={[styles.metadataGrid, style]}>
    {items.map((item) => (
      <MetadataTile key={item.label} label={item.label} value={item.value} />
    ))}
  </View>
);

const styles = StyleSheet.create({
  actionIcon: {
    alignItems: 'center',
    backgroundColor: surface.glassAction,
    borderColor: surface.aquaBorderMuted,
    borderRadius: radius(8),
    borderWidth: 1,
    height: spacing(34),
    justifyContent: 'center',
    width: spacing(34),
  },
  actionIconDisabled: {
    backgroundColor: reactNativeColorScheme.slate[100],
  },
  amountSummary: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing(8),
  },
  amountTile: {
    backgroundColor: moduleColors.heroMetric,
    borderColor: moduleColors.border,
    borderRadius: radius(8),
    borderWidth: 1,
    flex: 1,
    gap: spacing(4),
    minWidth: spacing(96),
    padding: spacing(11),
  },
  amountTileLabel: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansMedium,
    fontSize: fontSize(10),
    lineHeight: spacing(14),
  },
  amountTileValue: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(14),
    lineHeight: spacing(19),
  },
  breakdownAmount: {
    flexShrink: 1,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(13),
    lineHeight: spacing(18),
    minWidth: spacing(96),
    textAlign: 'right',
  },
  breakdownCopy: {
    flex: 1,
    gap: spacing(2),
    minWidth: 0,
  },
  breakdownLabel: {
    color: reactNativeColorScheme.text.primary,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(13),
    lineHeight: spacing(18),
  },
  breakdownNote: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansRegular,
    fontSize: fontSize(11),
    lineHeight: spacing(15),
  },
  breakdownRow: {
    alignItems: 'center',
    borderTopColor: surface.aquaBorderMuted,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: spacing(10),
    paddingVertical: spacing(10),
  },
  breakdownRows: {
    paddingHorizontal: spacing(14),
  },
  cardMeta: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansMedium,
    fontSize: fontSize(11),
    lineHeight: spacing(15),
  },
  cardTitle: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(16),
    lineHeight: spacing(22),
  },
  detailHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing(9),
    padding: spacing(14),
    paddingBottom: spacing(4),
  },
  metadataGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing(8),
  },
  metadataLabel: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansMedium,
    fontSize: fontSize(10),
    lineHeight: spacing(14),
  },
  metadataTile: {
    backgroundColor: surface.glassSoft,
    borderColor: surface.aquaBorderMuted,
    borderRadius: radius(8),
    borderWidth: 1,
    flex: 1,
    gap: spacing(3),
    minWidth: spacing(126),
    paddingHorizontal: spacing(10),
    paddingVertical: spacing(9),
  },
  metadataValue: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(12),
    lineHeight: spacing(17),
  },
  negativeSurface: {
    backgroundColor: reactNativeColorScheme.status.danger.background,
  },
  negativeValue: {
    color: reactNativeColorScheme.status.danger.foreground,
  },
  netAmountTile: {
    backgroundColor: moduleColors.accentSoft,
    borderColor: moduleColors.accent,
  },
  netAmountTileValue: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(16),
    lineHeight: spacing(21),
  },
  netPayBlock: {
    gap: spacing(4),
  },
  netPayLabel: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(11),
    lineHeight: spacing(15),
    textTransform: 'uppercase',
  },
  netPayMeta: {
    color: reactNativeColorScheme.status.success.foreground,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(12),
    lineHeight: spacing(16),
  },
  netPayValue: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(34),
    lineHeight: spacing(42),
  },
  overviewCard: {
    borderColor: moduleColors.borderStrong,
    borderRadius: radius(8),
    borderWidth: 1,
    gap: spacing(18),
    overflow: 'hidden',
    padding: spacing(18),
    shadowColor: moduleColors.shadow,
    shadowOffset: { height: spacing(12), width: 0 },
    shadowOpacity: 0.24,
    shadowRadius: spacing(22),
  },
  overviewEyebrow: {
    color: moduleColors.accentPressed,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(10),
    lineHeight: spacing(14),
    textTransform: 'uppercase',
  },
  overviewHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing(10),
  },
  overviewHeaderCopy: {
    flex: 1,
    gap: spacing(2),
    minWidth: 0,
  },
  overviewIconFrame: {
    alignItems: 'center',
    backgroundColor: moduleColors.iconSurface,
    borderColor: moduleColors.borderStrong,
    borderRadius: radius(8),
    borderWidth: 1,
    height: spacing(46),
    justifyContent: 'center',
    width: spacing(46),
  },
  overviewTitle: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(18),
    lineHeight: spacing(24),
  },
  payslipActions: {
    flexDirection: 'row',
    gap: spacing(8),
  },
  payslipAmount: {
    color: reactNativeColorScheme.ultiHuman.text,
    flex: 1,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(18),
    lineHeight: spacing(24),
  },
  payslipCard: {
    backgroundColor: surface.glassPanel,
    borderColor: surface.aquaBorderMuted,
    borderRadius: radius(8),
    borderWidth: 1,
    gap: spacing(14),
    padding: spacing(14),
    shadowColor: surface.cardShadow,
    shadowOffset: { height: spacing(8), width: 0 },
    shadowOpacity: 0.2,
    shadowRadius: spacing(16),
  },
  payslipCopy: {
    flex: 1,
    gap: spacing(2),
    minWidth: 0,
  },
  payslipFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing(12),
  },
  payslipHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing(10),
  },
  payslipIcon: {
    alignItems: 'center',
    backgroundColor: moduleColors.iconSurface,
    borderRadius: radius(8),
    height: spacing(40),
    justifyContent: 'center',
    width: spacing(40),
  },
  payslipSubtitle: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansMedium,
    fontSize: fontSize(12),
    lineHeight: spacing(16),
  },
  payslipTitle: {
    color: reactNativeColorScheme.text.primary,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(15),
    lineHeight: spacing(20),
  },
  positiveSurface: {
    backgroundColor: reactNativeColorScheme.status.success.background,
  },
  positiveValue: {
    color: reactNativeColorScheme.status.success.foreground,
  },
  pressed: {
    opacity: 0.76,
    transform: [{ scale: 0.995 }],
  },
  quickAction: {
    alignItems: 'center',
    backgroundColor: surface.glassAction,
    borderColor: surface.aquaBorderMuted,
    borderRadius: radius(8),
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing(8),
    minHeight: spacing(44),
    paddingHorizontal: spacing(13),
    shadowColor: surface.cardShadow,
    shadowOffset: { height: spacing(6), width: 0 },
    shadowOpacity: 0.16,
    shadowRadius: spacing(12),
  },
  quickActionText: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(12),
    lineHeight: spacing(16),
  },
  sectionCard: {
    backgroundColor: surface.glassPanel,
    borderColor: surface.aquaBorderMuted,
    borderRadius: radius(8),
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: surface.cardShadow,
    shadowOffset: { height: spacing(8), width: 0 },
    shadowOpacity: 0.18,
    shadowRadius: spacing(16),
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing(10),
    padding: spacing(14),
  },
  sectionIcon: {
    alignItems: 'center',
    backgroundColor: moduleColors.iconSurface,
    borderRadius: radius(8),
    height: spacing(38),
    justifyContent: 'center',
    width: spacing(38),
  },
  sectionSubtitle: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansRegular,
    fontSize: fontSize(11),
    lineHeight: spacing(15),
  },
  sectionSubtotal: {
    flexShrink: 1,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(13),
    lineHeight: spacing(18),
    maxWidth: spacing(104),
    textAlign: 'right',
  },
  sectionTitle: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(15),
    lineHeight: spacing(20),
  },
  sectionTitleWrap: {
    flex: 1,
    gap: spacing(2),
    minWidth: 0,
  },
  skeletonBlock: {
    backgroundColor: surface.glassPanel,
    borderColor: surface.aquaBorderMuted,
    borderRadius: radius(8),
    borderWidth: 1,
    height: spacing(118),
  },
  skeletonHero: {
    height: spacing(226),
  },
  skeletonLine: {
    backgroundColor: surface.glassPanel,
    borderRadius: radius(8),
    flex: 1,
    height: spacing(48),
  },
  skeletonLineShort: {
    backgroundColor: surface.glassPanel,
    borderRadius: radius(8),
    height: spacing(48),
    width: spacing(112),
  },
  skeletonRow: {
    flexDirection: 'row',
    gap: spacing(10),
  },
  skeletonStack: {
    gap: spacing(12),
  },
  statusBadge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: radius(8),
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing(6),
    maxWidth: spacing(142),
    paddingHorizontal: spacing(9),
    paddingVertical: spacing(6),
  },
  statusDot: {
    borderRadius: radius(4),
    height: spacing(7),
    width: spacing(7),
  },
  statusText: {
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(10),
    lineHeight: spacing(14),
  },
  timelineAmount: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(14),
    lineHeight: spacing(19),
    maxWidth: spacing(128),
    textAlign: 'right',
  },
  timelineBody: {
    flex: 1,
    gap: spacing(9),
    paddingBottom: spacing(14),
  },
  timelineCard: {
    backgroundColor: surface.glassPanel,
    borderColor: surface.aquaBorderMuted,
    borderRadius: radius(8),
    borderWidth: 1,
    gap: spacing(12),
    padding: spacing(14),
  },
  timelineCopy: {
    flex: 1,
    gap: spacing(2),
    minWidth: 0,
  },
  timelineDot: {
    backgroundColor: moduleColors.accent,
    borderColor: reactNativeColorScheme.text.inverse,
    borderRadius: radius(8),
    borderWidth: 2,
    height: spacing(14),
    width: spacing(14),
  },
  timelineHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timelineLine: {
    backgroundColor: surface.aquaBorderSoft,
    flex: 1,
    marginTop: spacing(4),
    width: 1,
  },
  timelineList: {
    gap: spacing(2),
  },
  timelineMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing(7),
  },
  timelineRail: {
    alignItems: 'center',
    width: spacing(18),
  },
  timelineRow: {
    flexDirection: 'row',
    gap: spacing(10),
    minHeight: spacing(86),
  },
  timelineSubtitle: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansMedium,
    fontSize: fontSize(11),
    lineHeight: spacing(15),
  },
  timelineTitle: {
    color: reactNativeColorScheme.text.primary,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(14),
    lineHeight: spacing(19),
  },
  timelineTop: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing(10),
  },
});
