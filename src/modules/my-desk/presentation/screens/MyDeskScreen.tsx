import { Feather } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppFonts } from '@/assets/fonts';
import { MobileScreenShell } from '@/design-system/patterns/MobileScreenShell';
import { reactNativeColorScheme } from '@/design-system/tokens/colors';
import { toAuthenticatedUserViewModel, useAuthSession } from '@/modules/auth';
import { DashboardShellHeader } from '@/modules/home/presentation/components/DashboardShellHeader';
import {
  ROUTES,
  type MyDeskStackParamList,
} from '@/navigation/route-types';
import { fontSize, radius, spacing } from '@/utils/scale';

type MyDeskScreenProps = NativeStackScreenProps<MyDeskStackParamList, 'MyDeskHome'>;

interface DeskItem {
  description: string;
  icon: keyof typeof Feather.glyphMap;
  label: string;
  route: keyof MyDeskStackParamList;
}

const deskItems: DeskItem[] = [
  {
    description: 'Daily readiness, history, and attendance activity.',
    icon: 'clock',
    label: 'Attendance',
    route: ROUTES.attendance,
  },
  {
    description: 'Apply, track, and review leave requests.',
    icon: 'edit-3',
    label: 'Leave',
    route: ROUTES.leave,
  },
  {
    description: 'Payslips, salary cycles, and payroll details.',
    icon: 'credit-card',
    label: 'Payroll',
    route: ROUTES.payroll,
  },
  {
    description: 'Ask HR questions and follow response status.',
    icon: 'message-square',
    label: 'HR Query',
    route: ROUTES.hrQuery,
  },
  {
    description: 'Company notices and workforce updates.',
    icon: 'bell',
    label: 'Notifications',
    route: ROUTES.notifications,
  },
  {
    description: 'Team, reporting manager, location, and work mode.',
    icon: 'users',
    label: 'My Organization',
    route: ROUTES.myOrganization,
  },
  {
    description: 'Employee services and workforce hub workflows.',
    icon: 'briefcase',
    label: 'Workforce Hub',
    route: ROUTES.workforceHub,
  },
];

const initialsFrom = (value: string | undefined): string => {
  const parts = value?.trim().split(/\s+/).filter(Boolean) ?? [];

  return parts.length
    ? parts.slice(0, 2).map((part) => part[0]).join('').toUpperCase()
    : 'U';
};

export const MyDeskScreen = ({ navigation }: MyDeskScreenProps) => {
  const { user } = useAuthSession();
  const userViewModel = toAuthenticatedUserViewModel(user);
  const displayName = userViewModel?.displayName ?? 'Employee';

  return (
    <MobileScreenShell
      header={
        <DashboardShellHeader
          initials={initialsFrom(displayName)}
          onNotificationPress={() => navigation.navigate(ROUTES.notifications)}
          subtitle=""
          title={`Hello ${displayName}`}
        />
      }
    >
      <View style={styles.pageHeader}>
        <Text style={styles.routeLabel}>MyDesk</Text>
        <Text style={styles.pageTitle}>Work tools</Text>
      </View>

      <View style={styles.grid}>
        {deskItems.map((item) => (
          <Pressable
            accessibilityLabel={`Open ${item.label}`}
            accessibilityRole="button"
            key={item.route}
            onPress={() => navigation.navigate(item.route)}
            style={({ pressed }) => [
              styles.card,
              pressed ? styles.cardPressed : undefined,
            ]}
          >
            <View style={styles.iconFrame}>
              <Feather
                color={reactNativeColorScheme.ultiHuman.accentPressed}
                name={item.icon}
                size={22}
              />
            </View>
            <View style={styles.cardCopy}>
              <Text numberOfLines={1} style={styles.cardTitle}>
                {item.label}
              </Text>
              <Text numberOfLines={2} style={styles.cardDescription}>
                {item.description}
              </Text>
            </View>
            <Feather
              color={reactNativeColorScheme.text.muted}
              name="chevron-right"
              size={20}
            />
          </Pressable>
        ))}
      </View>
    </MobileScreenShell>
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: reactNativeColorScheme.ultiHuman.surface.glassPanel,
    borderColor: reactNativeColorScheme.ultiHuman.surface.aquaBorderMuted,
    borderRadius: radius(8),
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing(12),
    minHeight: spacing(78),
    paddingHorizontal: spacing(16),
    paddingVertical: spacing(14),
    shadowColor: reactNativeColorScheme.ultiHuman.surface.cardShadow,
    shadowOffset: { height: spacing(8), width: 0 },
    shadowOpacity: 0.18,
    shadowRadius: spacing(16),
  },
  cardCopy: {
    flex: 1,
    gap: spacing(3),
    minWidth: 0,
  },
  cardDescription: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansRegular,
    fontSize: fontSize(12),
    lineHeight: spacing(17),
  },
  cardPressed: {
    opacity: 0.84,
    transform: [{ scale: 0.985 }],
  },
  cardTitle: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(16),
    lineHeight: spacing(22),
  },
  grid: {
    gap: spacing(12),
  },
  iconFrame: {
    alignItems: 'center',
    backgroundColor: reactNativeColorScheme.ultiHuman.surface.glassSoft,
    borderColor: reactNativeColorScheme.ultiHuman.surface.aquaBorderMuted,
    borderRadius: radius(8),
    borderWidth: 1,
    height: spacing(46),
    justifyContent: 'center',
    width: spacing(46),
  },
  pageHeader: {
    gap: spacing(4),
    paddingTop: spacing(2),
  },
  pageTitle: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(24),
    lineHeight: spacing(30),
  },
  routeLabel: {
    color: reactNativeColorScheme.ultiHuman.module.accentPressed,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(12),
    lineHeight: spacing(16),
    textTransform: 'uppercase',
  },
});
