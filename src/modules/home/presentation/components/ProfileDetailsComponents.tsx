import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { memo, useState } from 'react';
import { ActivityIndicator, LayoutAnimation, StyleSheet, Text, View } from 'react-native';

import { AppFonts } from '@/assets/fonts';
import { PremiumAnimatedView, PremiumPressable, premiumMotionTiming } from '@/design-system/components';
import { useReducedMotionPreference } from '@/design-system/hooks';
import { reactNativeColorScheme } from '@/design-system/tokens/colors';
import type { HrmsStatusTone } from '@/modules/hrms';
import { fontSize, radius, spacing } from '@/utils/scale';

export interface ProfileDetailRow {
  meta?: string;
  protectedLabel?: string;
  label: string;
  sensitive?: boolean;
  statusLabel?: string;
  statusTone?: HrmsStatusTone;
  supportingLabel?: string;
  type?: 'document' | 'field';
  value: string;
}

export interface ProfileDetailSectionModel {
  icon: keyof typeof Feather.glyphMap;
  id: string;
  rows: ProfileDetailRow[];
  title: string;
}

interface ProfileHeroProps {
  accountStatus: string;
  accountStatusTone: HrmsStatusTone;
  department: string;
  designation: string;
  displayName: string;
  employeeNumber: string;
  employmentStatus: string;
  employmentStatusTone: HrmsStatusTone;
  employmentType: string;
  grade: string;
  initials: string;
  verificationLabel: string;
  verificationTone: HrmsStatusTone;
}

interface VerificationSummaryCardProps {
  outstanding: number;
  pending: number;
  rejected: number;
  unverified: number;
  verificationLabel: string;
}

interface ProfileDetailSectionProps {
  section: ProfileDetailSectionModel;
}

interface ProfileInlineFeedbackProps {
  message: string;
  tone: 'error' | 'loading';
}

const moduleColors = reactNativeColorScheme.ultiHuman.module;
const cardEnterDelay = (index: number) => Math.min(index * 48, 260);

const statusToneStyles: Record<
  HrmsStatusTone,
  { backgroundColor: string; borderColor: string; color: string }
> = {
  danger: {
    backgroundColor: reactNativeColorScheme.status.danger.background,
    borderColor: reactNativeColorScheme.status.danger.border,
    color: reactNativeColorScheme.status.danger.foreground,
  },
  neutral: {
    backgroundColor: moduleColors.heroOverlay,
    borderColor: moduleColors.border,
    color: moduleColors.softText,
  },
  success: {
    backgroundColor: reactNativeColorScheme.status.success.background,
    borderColor: reactNativeColorScheme.status.success.border,
    color: reactNativeColorScheme.status.success.foreground,
  },
  warning: {
    backgroundColor: reactNativeColorScheme.status.warning.background,
    borderColor: reactNativeColorScheme.status.warning.border,
    color: reactNativeColorScheme.status.warning.foreground,
  },
};

export const StatusBadge = ({
  label,
  tone = 'neutral',
}: {
  label: string;
  tone?: HrmsStatusTone;
}) => {
  const toneStyle = statusToneStyles[tone];

  return (
    <View
      style={[
        styles.statusBadge,
        { backgroundColor: toneStyle.backgroundColor, borderColor: toneStyle.borderColor },
      ]}
    >
      <Text style={[styles.statusBadgeText, { color: toneStyle.color }]}>
        {label}
      </Text>
    </View>
  );
};

export const VerificationBadge = ({
  label,
  tone,
}: {
  label: string;
  tone: HrmsStatusTone;
}) => (
  <View style={styles.verificationBadge}>
    <Feather color={statusToneStyles[tone].color} name="check-circle" size={spacing(12)} />
    <StatusBadge label={label} tone={tone} />
  </View>
);

export const ProfileHero = ({
  accountStatus,
  accountStatusTone,
  department,
  designation,
  displayName,
  employeeNumber,
  employmentStatus,
  employmentStatusTone,
  employmentType,
  grade,
  initials,
  verificationLabel,
  verificationTone,
}: ProfileHeroProps) => {
  const quickChips = [
    { label: employmentStatus, tone: employmentStatusTone },
    { label: verificationLabel, tone: verificationTone },
    { label: employmentType, tone: 'neutral' as HrmsStatusTone },
    { label: department, tone: 'neutral' as HrmsStatusTone },
    { label: grade, tone: 'neutral' as HrmsStatusTone },
  ].filter((chip) => chip.label !== 'Not available' && chip.label !== 'Not assigned');

  return (
    <PremiumAnimatedView delay={40} distance={7} duration={premiumMotionTiming.screen}>
      <LinearGradient
        colors={moduleColors.heroGradient}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={styles.hero}
      >
        <View style={styles.heroTop}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.heroCopy}>
            <Text style={styles.eyebrow}>Employee profile</Text>
            <Text numberOfLines={2} style={styles.heroName}>
              {displayName}
            </Text>
            <Text numberOfLines={2} style={styles.heroMeta}>
              {employeeNumber} • {designation}
            </Text>
          </View>
        </View>

        <View style={styles.heroBadgeRail}>
          <StatusBadge label={employmentStatus} tone={employmentStatusTone} />
          <StatusBadge label={accountStatus} tone={accountStatusTone} />
          <VerificationBadge label={verificationLabel} tone={verificationTone} />
        </View>

        <View style={styles.heroStats}>
          <HeroStat label="Department" value={department} />
          <HeroStat label="Designation" value={designation} />
          <HeroStat label="Grade" value={grade} />
        </View>

        <View style={styles.summaryChips}>
          {quickChips.map((chip) => (
            <StatusBadge key={`${chip.label}-${chip.tone}`} label={chip.label} tone={chip.tone} />
          ))}
        </View>
      </LinearGradient>
    </PremiumAnimatedView>
  );
};

const HeroStat = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.heroStat}>
    <Text style={styles.heroStatLabel}>
      {label}
    </Text>
    <Text style={styles.heroStatValue}>
      {value}
    </Text>
  </View>
);

export const VerificationSummaryCard = ({
  outstanding,
  pending,
  rejected,
  unverified,
  verificationLabel,
}: VerificationSummaryCardProps) => {
  const totalOpen = pending + rejected + unverified + outstanding;
  const progress = totalOpen === 0 ? 100 : Math.max(0, 100 - totalOpen * 18);

  return (
    <PremiumAnimatedView delay={80} distance={6} style={styles.verificationCard}>
      <View style={styles.verificationHeader}>
        <View style={styles.sectionIcon}>
          <Feather color={moduleColors.icon} name="shield" size={spacing(18)} />
        </View>
        <View style={styles.sectionHeaderCopy}>
          <Text style={styles.sectionEyebrow}>Secure profile</Text>
          <Text style={styles.sectionTitle}>{verificationLabel}</Text>
        </View>
        <Text style={styles.progressText}>{progress}%</Text>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      <View style={styles.verificationGrid}>
        <VerificationMetric label="Pending" value={pending} />
        <VerificationMetric label="Unverified" value={unverified} />
        <VerificationMetric label="Rejected" value={rejected} />
        <VerificationMetric label="Docs" value={outstanding} />
      </View>
    </PremiumAnimatedView>
  );
};

const VerificationMetric = ({ label, value }: { label: string; value: number }) => (
  <View style={styles.verificationMetric}>
    <Text style={styles.verificationMetricValue}>{value}</Text>
    <Text numberOfLines={1} style={styles.verificationMetricLabel}>
      {label}
    </Text>
  </View>
);

export const ProfileFieldCard = ({ index = 0, row }: { index?: number; row: ProfileDetailRow }) => (
  <PremiumAnimatedView delay={cardEnterDelay(index)} distance={5} style={styles.fieldCard}>
    <View style={styles.fieldAccent} />
    <View style={styles.fieldLabelRow}>
      <View style={styles.fieldDot} />
      <Text style={styles.fieldLabel}>{row.label}</Text>
    </View>
    <Text numberOfLines={2} style={styles.fieldValue}>
      {row.value}
    </Text>
    {row.statusLabel ? (
      <View style={styles.fieldFooter}>
        <StatusBadge label={row.statusLabel} tone={row.statusTone} />
      </View>
    ) : row.supportingLabel ? (
      <Text style={styles.fieldMeta}>{row.supportingLabel}</Text>
    ) : null}
  </PremiumAnimatedView>
);

export const SecureFieldCard = ({ row }: { row: ProfileDetailRow }) => (
  <PremiumAnimatedView disabled style={[styles.fieldCard, styles.secureFieldCard]}>
    <View style={[styles.fieldAccent, styles.secureFieldAccent]} />
    <View style={styles.secureFieldHeader}>
      <View style={styles.fieldLabelRow}>
        <View style={styles.fieldDot} />
        <Text style={styles.fieldLabel}>{row.label}</Text>
      </View>
      <View style={styles.lockBadge}>
        <Feather color={moduleColors.icon} name="lock" size={spacing(12)} />
      </View>
    </View>
    <Text numberOfLines={2} style={styles.fieldValue}>
      {row.value}
    </Text>
    <View style={styles.fieldFooter}>
      <StatusBadge label={row.protectedLabel ?? 'Protected'} tone="neutral" />
    </View>
  </PremiumAnimatedView>
);

export const DocumentCard = ({ index = 0, row }: { index?: number; row: ProfileDetailRow }) => (
  <PremiumAnimatedView
    delay={cardEnterDelay(index)}
    distance={5}
    style={[styles.fieldCard, styles.documentCard]}
  >
    <View style={[styles.fieldAccent, styles.documentFieldAccent]} />
    <View style={styles.fieldLabelRow}>
      <View style={styles.fieldDot} />
      <Text style={styles.fieldLabel}>Document Name</Text>
    </View>
    <Text numberOfLines={2} style={styles.fieldValue}>
      {row.label}
    </Text>
    <View style={styles.documentMetaRow}>
      <StatusBadge label={row.statusLabel ?? 'Protected'} tone={row.statusTone} />
      <StatusBadge label={row.protectedLabel ?? 'Protected'} tone="neutral" />
    </View>
    <Text style={styles.fieldMeta}>{row.value}</Text>
  </PremiumAnimatedView>
);

export const ProfileGrid = ({ rows }: { rows: ProfileDetailRow[] }) => (
  <View style={styles.gridContent}>
    {rows.map((row, index) => {
      const key = `${row.type ?? 'field'}-${row.label}-${row.value}`;

      if (row.type === 'document') {
        return <DocumentCard index={index} key={key} row={row} />;
      }

      if (row.sensitive) {
        return <SecureFieldCard key={key} row={row} />;
      }

      return <ProfileFieldCard index={index} key={key} row={row} />;
    })}
    {rows.length % 2 === 1 ? <View pointerEvents="none" style={styles.gridSpacer} /> : null}
  </View>
);

const ProfileDetailSectionComponent = ({ section }: ProfileDetailSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const reduceMotionEnabled = useReducedMotionPreference();

  const handleToggle = () => {
    if (!reduceMotionEnabled) {
      LayoutAnimation.configureNext({
        duration: premiumMotionTiming.section,
        create: {
          duration: premiumMotionTiming.section,
          property: LayoutAnimation.Properties.opacity,
          type: LayoutAnimation.Types.easeInEaseOut,
        },
        delete: {
          duration: premiumMotionTiming.section,
          property: LayoutAnimation.Properties.opacity,
          type: LayoutAnimation.Types.easeInEaseOut,
        },
        update: {
          duration: premiumMotionTiming.section,
          type: LayoutAnimation.Types.easeInEaseOut,
        },
      });
    }
    setIsExpanded((current) => !current);
  };

  return (
    <PremiumAnimatedView distance={6} style={styles.sectionCard}>
      <PremiumPressable
        accessibilityRole="button"
        android_ripple={{ color: moduleColors.accentWash }}
        onPress={handleToggle}
        style={({ pressed }) => [styles.sectionHeader, pressed ? styles.pressed : undefined]}
      >
        <View style={styles.sectionIcon}>
          <Feather color={moduleColors.icon} name={section.icon} size={spacing(17)} />
        </View>
        <View style={styles.sectionHeaderCopy}>
          <Text style={styles.sectionEyebrow}>{section.rows.length} signals</Text>
          <Text style={styles.sectionTitle}>{section.title}</Text>
        </View>
        <View style={styles.expandIcon}>
          <Feather
            color={moduleColors.icon}
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={spacing(16)}
          />
        </View>
      </PremiumPressable>

      {isExpanded ? (
        <PremiumAnimatedView
          distance={4}
          duration={premiumMotionTiming.section}
        >
          <ProfileGrid rows={section.rows} />
        </PremiumAnimatedView>
      ) : null}
    </PremiumAnimatedView>
  );
};

export const ProfileSection = memo(ProfileDetailSectionComponent);
export const ProfileDetailSection = ProfileSection;

export const ProfileEmptyState = () => (
  <PremiumAnimatedView distance={6} style={styles.emptyState}>
    <View style={styles.sectionIcon}>
      <Feather color={moduleColors.icon} name="inbox" size={spacing(17)} />
    </View>
    <View style={styles.sectionHeaderCopy}>
      <Text style={styles.sectionEyebrow}>Profile layer</Text>
      <Text style={styles.sectionTitle}>No profile details available</Text>
      <Text style={styles.emptyText}>Pull down to refresh when employee data is available.</Text>
    </View>
  </PremiumAnimatedView>
);

export const ProfileInlineFeedback = ({ message, tone }: ProfileInlineFeedbackProps) => (
  <View style={[styles.feedback, tone === 'error' ? styles.feedbackError : undefined]}>
    {tone === 'loading' ? (
      <ActivityIndicator color={reactNativeColorScheme.ultiHuman.accent} size="small" />
    ) : (
      <Feather color={reactNativeColorScheme.status.danger.foreground} name="alert-circle" size={18} />
    )}
    <Text style={[styles.feedbackText, tone === 'error' ? styles.feedbackErrorText : undefined]}>
      {message}
    </Text>
  </View>
);

export const ProfileActionChip = ({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress: () => void;
}) => (
  <PremiumPressable
    accessibilityRole="button"
    android_ripple={{ color: moduleColors.accentWash }}
    onPress={onPress}
    style={({ pressed }) => [styles.actionChip, pressed ? styles.pressed : undefined]}
  >
    <LinearGradient
      colors={[
        'rgba(255, 255, 255, 0.98)',
        'rgba(236, 248, 255, 0.94)',
        'rgba(204, 239, 255, 0.82)',
      ]}
      end={{ x: 1, y: 1 }}
      start={{ x: 0, y: 0 }}
      style={StyleSheet.absoluteFill}
    />
    <View style={styles.actionIconFrame}>
      <Feather color={moduleColors.icon} name={icon} size={spacing(15)} />
    </View>
    <Text numberOfLines={1} style={styles.actionText}>
      {label}
    </Text>
  </PremiumPressable>
);

const styles = StyleSheet.create({
  actionChip: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    borderColor: 'rgba(3, 86, 158, 0.34)',
    borderRadius: radius(8),
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    gap: spacing(8),
    minHeight: spacing(46),
    minWidth: spacing(118),
    overflow: 'hidden',
    paddingHorizontal: spacing(9),
    paddingVertical: spacing(6),
    position: 'relative',
    shadowColor: moduleColors.shadow,
    shadowOffset: { height: spacing(6), width: 0 },
    shadowOpacity: 0.12,
    shadowRadius: spacing(12),
  },
  actionIconFrame: {
    alignItems: 'center',
    backgroundColor: moduleColors.iconSurface,
    borderColor: moduleColors.border,
    borderRadius: radius(999),
    borderWidth: 1,
    height: spacing(30),
    justifyContent: 'center',
    width: spacing(30),
  },
  actionText: {
    color: moduleColors.ink,
    flex: 1,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(12),
    lineHeight: spacing(16),
    textTransform: 'uppercase',
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: moduleColors.ink,
    borderColor: 'rgba(255, 255, 255, 0.74)',
    borderRadius: radius(8),
    borderWidth: 1,
    height: spacing(62),
    justifyContent: 'center',
    width: spacing(62),
  },
  avatarText: {
    color: reactNativeColorScheme.text.inverse,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(20),
    lineHeight: spacing(26),
  },
  eyebrow: {
    color: moduleColors.accentPressed,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(10),
    lineHeight: spacing(14),
    textTransform: 'uppercase',
  },
  emptyState: {
    alignItems: 'center',
    backgroundColor: reactNativeColorScheme.ultiHuman.surface.glassPanel,
    borderColor: moduleColors.borderStrong,
    borderRadius: radius(8),
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing(12),
    minHeight: spacing(82),
    padding: spacing(14),
  },
  emptyText: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansMedium,
    fontSize: fontSize(12),
    lineHeight: spacing(17),
  },
  expandIcon: {
    alignItems: 'center',
    backgroundColor: moduleColors.heroOverlay,
    borderColor: moduleColors.border,
    borderRadius: radius(8),
    borderWidth: 1,
    height: spacing(32),
    justifyContent: 'center',
    width: spacing(32),
  },
  feedback: {
    alignItems: 'center',
    backgroundColor: reactNativeColorScheme.ultiHuman.surface.glassPanel,
    borderColor: moduleColors.border,
    borderRadius: radius(8),
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing(10),
    minHeight: spacing(58),
    paddingHorizontal: spacing(14),
  },
  feedbackError: {
    backgroundColor: reactNativeColorScheme.status.danger.background,
    borderColor: reactNativeColorScheme.status.danger.border,
  },
  feedbackErrorText: {
    color: reactNativeColorScheme.status.danger.foreground,
  },
  feedbackText: {
    color: reactNativeColorScheme.text.secondary,
    flex: 1,
    fontFamily: AppFonts.googleSansMedium,
    fontSize: fontSize(13),
    lineHeight: spacing(18),
  },
  documentCard: {
    gap: spacing(6),
    minHeight: spacing(116),
  },
  documentFieldAccent: {
    backgroundColor: reactNativeColorScheme.status.info.strong,
  },
  documentMetaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing(6),
  },
  fieldCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    borderColor: 'rgba(3, 86, 158, 0.34)',
    borderRadius: radius(8),
    borderWidth: 1,
    gap: spacing(6),
    marginBottom: spacing(8),
    minHeight: spacing(82),
    overflow: 'hidden',
    paddingHorizontal: spacing(11),
    paddingTop: spacing(10),
    paddingVertical: spacing(10),
    position: 'relative',
    shadowColor: moduleColors.shadow,
    shadowOffset: { height: spacing(10), width: 0 },
    shadowOpacity: 0.13,
    shadowRadius: spacing(18),
    width: '48%',
  },
  fieldAccent: {
    backgroundColor: moduleColors.accentPressed,
    borderBottomRightRadius: radius(8),
    borderTopRightRadius: radius(8),
    bottom: spacing(12),
    left: 0,
    position: 'absolute',
    top: spacing(12),
    width: spacing(3),
  },
  fieldDot: {
    backgroundColor: moduleColors.accentPressed,
    borderRadius: radius(999),
    height: spacing(5),
    width: spacing(5),
  },
  fieldFooter: {
    alignItems: 'flex-start',
    marginTop: 'auto',
  },
  fieldLabel: {
    color: moduleColors.softText,
    flex: 1,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(10),
    lineHeight: spacing(14),
    textTransform: 'uppercase',
  },
  fieldLabelRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing(6),
    minWidth: 0,
  },
  fieldMeta: {
    color: moduleColors.softText,
    fontFamily: AppFonts.googleSansMedium,
    fontSize: fontSize(11),
    lineHeight: spacing(15),
  },
  fieldValue: {
    color: moduleColors.ink,
    flexShrink: 1,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(15),
    lineHeight: spacing(20),
  },
  gridContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridSpacer: {
    marginBottom: spacing(8),
    minHeight: spacing(1),
    width: '48%',
  },
  hero: {
    borderColor: moduleColors.borderStrong,
    borderRadius: radius(8),
    borderWidth: 1,
    gap: spacing(16),
    overflow: 'hidden',
    padding: spacing(18),
    shadowColor: moduleColors.shadow,
    shadowOffset: { height: spacing(12), width: 0 },
    shadowOpacity: 0.24,
    shadowRadius: spacing(22),
  },
  heroCopy: {
    flex: 1,
    gap: spacing(3),
    minWidth: 0,
  },
  heroMeta: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansMedium,
    fontSize: fontSize(12),
    lineHeight: spacing(17),
  },
  heroName: {
    color: moduleColors.ink,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(22),
    lineHeight: spacing(28),
  },
  heroNarrative: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansMedium,
    fontSize: fontSize(13),
    lineHeight: spacing(18),
  },
  heroStat: {
    backgroundColor: moduleColors.heroMetric,
    borderColor: moduleColors.border,
    borderRadius: radius(8),
    borderWidth: 1,
    flex: 1,
    gap: spacing(2),
    minWidth: spacing(88),
    paddingHorizontal: spacing(10),
    paddingVertical: spacing(9),
  },
  heroStatLabel: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansMedium,
    fontSize: fontSize(10),
    lineHeight: spacing(14),
  },
  heroStatValue: {
    color: moduleColors.ink,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(12),
    lineHeight: spacing(16),
  },
  heroStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing(8),
  },
  heroBadgeRail: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing(7),
  },
  heroTop: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing(12),
  },
  pressed: {
    opacity: 0.88,
  },
  progressFill: {
    backgroundColor: moduleColors.accentPressed,
    borderRadius: radius(8),
    height: '100%',
  },
  progressText: {
    color: moduleColors.ink,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(18),
    lineHeight: spacing(24),
  },
  progressTrack: {
    backgroundColor: moduleColors.accentWash,
    borderRadius: radius(8),
    height: spacing(10),
    overflow: 'hidden',
  },
  row: {
    alignItems: 'center',
    backgroundColor: reactNativeColorScheme.ultiHuman.surface.glassSoft,
    borderColor: moduleColors.border,
    borderRadius: radius(8),
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing(10),
    minHeight: spacing(64),
    paddingHorizontal: spacing(12),
    paddingVertical: spacing(10),
  },
  rowCopy: {
    flex: 1,
    gap: spacing(4),
    minWidth: 0,
  },
  rowLabel: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansSemiBold,
    fontSize: fontSize(10),
    lineHeight: spacing(14),
    textTransform: 'uppercase',
  },
  rowList: {
    gap: spacing(8),
  },
  rowValue: {
    color: moduleColors.ink,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(14),
    lineHeight: spacing(19),
  },
  sectionCard: {
    backgroundColor: reactNativeColorScheme.ultiHuman.surface.glassPanel,
    borderColor: moduleColors.borderStrong,
    borderRadius: radius(8),
    borderWidth: 1,
    gap: spacing(12),
    padding: spacing(12),
    shadowColor: moduleColors.shadow,
    shadowOffset: { height: spacing(8), width: 0 },
    shadowOpacity: 0.14,
    shadowRadius: spacing(16),
  },
  sectionEyebrow: {
    color: moduleColors.accentPressed,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(10),
    lineHeight: spacing(14),
    textTransform: 'uppercase',
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing(10),
  },
  sectionHeaderCopy: {
    flex: 1,
    gap: spacing(1),
    minWidth: 0,
  },
  sectionIcon: {
    alignItems: 'center',
    backgroundColor: moduleColors.iconSurface,
    borderColor: moduleColors.border,
    borderRadius: radius(8),
    borderWidth: 1,
    height: spacing(40),
    justifyContent: 'center',
    width: spacing(40),
  },
  sectionTitle: {
    color: moduleColors.ink,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(16),
    lineHeight: spacing(21),
  },
  secureFieldCard: {
    backgroundColor: 'rgba(249, 255, 253, 0.94)',
    borderColor: 'rgba(3, 86, 158, 0.42)',
  },
  secureFieldAccent: {
    backgroundColor: moduleColors.icon,
  },
  secureFieldHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing(6),
    justifyContent: 'space-between',
  },
  lockBadge: {
    alignItems: 'center',
    backgroundColor: moduleColors.iconSurface,
    borderColor: moduleColors.border,
    borderRadius: radius(999),
    borderWidth: 1,
    height: spacing(26),
    justifyContent: 'center',
    width: spacing(26),
  },
  secureBadge: {
    alignItems: 'center',
    backgroundColor: moduleColors.heroOverlay,
    borderColor: moduleColors.border,
    borderRadius: radius(8),
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing(5),
    paddingHorizontal: spacing(8),
    paddingVertical: spacing(5),
  },
  secureBadgeText: {
    color: moduleColors.softText,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(10),
    lineHeight: spacing(13),
  },
  verificationCard: {
    backgroundColor: reactNativeColorScheme.ultiHuman.surface.glassPanel,
    borderColor: moduleColors.borderStrong,
    borderRadius: radius(8),
    borderWidth: 1,
    gap: spacing(13),
    padding: spacing(14),
  },
  statusBadge: {
    alignSelf: 'flex-start',
    borderRadius: radius(999),
    borderWidth: 1,
    maxWidth: '100%',
    paddingHorizontal: spacing(8),
    paddingVertical: spacing(4),
  },
  statusBadgeText: {
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(10),
    lineHeight: spacing(13),
  },
  summaryChips: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing(7),
  },
  verificationGrid: {
    flexDirection: 'row',
    gap: spacing(8),
  },
  verificationHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing(10),
  },
  verificationMetric: {
    backgroundColor: moduleColors.heroMetric,
    borderColor: moduleColors.border,
    borderRadius: radius(8),
    borderWidth: 1,
    flex: 1,
    gap: spacing(1),
    paddingHorizontal: spacing(9),
    paddingVertical: spacing(9),
  },
  verificationMetricLabel: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansMedium,
    fontSize: fontSize(10),
    lineHeight: spacing(14),
  },
  verificationMetricValue: {
    color: moduleColors.ink,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(18),
    lineHeight: spacing(23),
  },
  verificationBadge: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing(5),
  },
});
