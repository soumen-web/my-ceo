import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { AppFonts } from '@/assets/fonts';
import { PremiumAnimatedView } from '@/design-system/components';
import { reactNativeColorScheme } from '@/design-system/tokens/colors';
import { fontSize, radius, spacing } from '@/utils/scale';

export interface MyOrganizationInfoRowModel {
  label: string;
  value: string;
}

interface MyOrganizationInfoRowProps {
  index?: number;
  isLast?: boolean;
  row: MyOrganizationInfoRowModel;
}

const moduleColors = reactNativeColorScheme.ultiHuman.module;

const iconByLabel: Record<string, keyof typeof Feather.glyphMap> = {
  'Business Unit': 'layers',
  Department: 'grid',
  Email: 'mail',
  'Employee Name': 'user',
  'Employee Number': 'hash',
  'Employee Record': 'database',
  'Employment Status': 'activity',
  'Employment Type': 'briefcase',
  'Holiday Calendar': 'calendar',
  'Legal Entity': 'shield',
  Location: 'map-pin',
  'Location Code': 'hash',
  Manager: 'user-check',
  Organization: 'briefcase',
  Roles: 'award',
  'Shift Calendar': 'clock',
  Status: 'activity',
  Team: 'users',
  'Work Mode': 'navigation',
  'Work Week': 'calendar',
};

export const MyOrganizationInfoRow = ({
  index = 0,
  isLast = false,
  row,
}: MyOrganizationInfoRowProps) => (
  <PremiumAnimatedView
    delay={Math.min(index * 56, 280)}
    distance={5}
    style={[styles.row, isLast ? styles.rowLast : undefined]}
  >
    <View style={styles.accentRail} />
    <View style={styles.rowHeader}>
      <View style={styles.labelWrap}>
        <View style={styles.labelDot} />
        <Text style={styles.label}>
          {row.label}
        </Text>
      </View>
      <View style={styles.iconFrame}>
        <Feather color={moduleColors.icon} name={iconByLabel[row.label] ?? 'circle'} size={13} />
      </View>
    </View>
    <Text numberOfLines={2} style={styles.value}>{row.value || 'Not available'}</Text>
  </PremiumAnimatedView>
);

const styles = StyleSheet.create({
  accentRail: {
    backgroundColor: moduleColors.accentPressed,
    borderBottomRightRadius: radius(8),
    borderTopRightRadius: radius(8),
    bottom: spacing(12),
    left: 0,
    position: 'absolute',
    top: spacing(12),
    width: spacing(3),
  },
  iconFrame: {
    alignItems: 'center',
    backgroundColor: moduleColors.iconSurface,
    borderColor: moduleColors.border,
    borderRadius: radius(999),
    borderWidth: 1,
    height: spacing(26),
    justifyContent: 'center',
    width: spacing(26),
  },
  label: {
    color: moduleColors.softText,
    flex: 1,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(10),
    lineHeight: spacing(14),
    textTransform: 'uppercase',
  },
  labelDot: {
    backgroundColor: moduleColors.accentPressed,
    borderRadius: radius(999),
    height: spacing(5),
    width: spacing(5),
  },
  labelWrap: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: spacing(6),
    minWidth: 0,
  },
  row: {
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
  rowHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing(8),
    justifyContent: 'space-between',
  },
  rowLast: {
    borderBottomWidth: 1,
  },
  value: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(15),
    lineHeight: spacing(20),
  },
});
