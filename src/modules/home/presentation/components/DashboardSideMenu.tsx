import { Feather } from '@expo/vector-icons';
import {
  DrawerContentScrollView,
  type DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppFonts } from '@/assets/fonts';
import { reactNativeColorScheme } from '@/design-system/tokens/colors';
import { toAuthenticatedUserViewModel, useAuthSession } from '@/modules/auth';
import { ROUTES, type AppDrawerParamList } from '@/navigation/route-types';
import { fontSize, radius, spacing } from '@/utils/scale';

type MenuItem =
  | 'attendance'
  | 'dashboard'
  | 'hrQuery'
  | 'leave'
  | 'myOrganization'
  | 'notifications'
  | 'payroll'
  | 'workforceHub';

interface DrawerMenuItem {
  icon: keyof typeof Feather.glyphMap;
  id: MenuItem;
  label: string;
  route: keyof AppDrawerParamList;
}

const routeToActiveItem: Partial<Record<keyof AppDrawerParamList, MenuItem>> = {
  AppTabs: 'dashboard',
  Attendance: 'attendance',
  Home: 'dashboard',
  HrQuery: 'hrQuery',
  Leave: 'leave',
  MyOrganization: 'myOrganization',
  Notifications: 'notifications',
  Payroll: 'payroll',
  WorkforceHub: 'workforceHub',
};

const workspaceItems: DrawerMenuItem[] = [
  {
    icon: 'clock',
    id: 'attendance',
    label: 'Attendance',
    route: ROUTES.attendance,
  },
  {
    icon: 'calendar',
    id: 'leave',
    label: 'Leave',
    route: ROUTES.leave,
  },
  {
    icon: 'credit-card',
    id: 'payroll',
    label: 'Payroll',
    route: ROUTES.payroll,
  },
  {
    icon: 'help-circle',
    id: 'hrQuery',
    label: 'HR Query',
    route: ROUTES.hrQuery,
  },
  {
    icon: 'layers',
    id: 'workforceHub',
    label: 'Workforce Hub',
    route: ROUTES.workforceHub,
  },
  {
    icon: 'briefcase',
    id: 'myOrganization',
    label: 'My Organization',
    route: ROUTES.myOrganization,
  },
];

const getActiveItem = (props: DrawerContentComponentProps): MenuItem | undefined => {
  const routeName = props.state.routeNames[props.state.index] as keyof AppDrawerParamList;

  return routeToActiveItem[routeName];
};

const getInitials = (value: string | undefined): string => {
  const nameParts = value?.trim().split(/\s+/).filter(Boolean) ?? [];
  const initials = nameParts.slice(0, 2).map((part) => part[0]).join('');

  return initials ? initials.toUpperCase() : 'U';
};

export const DashboardSideMenu = (props: DrawerContentComponentProps) => {
  const { signOut, user } = useAuthSession();
  const userViewModel = toAuthenticatedUserViewModel(user);
  const displayName = userViewModel?.displayName ?? 'Employee';
  const userEmail = userViewModel?.email ?? 'Workforce Hub';
  const activeItem = getActiveItem(props);
  const initials = getInitials(displayName);

  const closeDrawer = () => props.navigation.closeDrawer();
  const openNotifications = () => {
    props.navigation.navigate(ROUTES.notifications);
    closeDrawer();
  };
  const navigateAndClose = (routeName: keyof AppDrawerParamList) => {
    if (routeName === ROUTES.attendance) {
      props.navigation.navigate(routeName, { screen: ROUTES.attendanceHome });
      closeDrawer();
      return;
    }

    if (routeName === ROUTES.leave) {
      props.navigation.navigate(routeName, { screen: ROUTES.leaveHome });
      closeDrawer();
      return;
    }

    if (routeName === ROUTES.payroll) {
      props.navigation.navigate(routeName, { screen: ROUTES.payrollHome });
      closeDrawer();
      return;
    }

    if (routeName === ROUTES.workforceHub) {
      props.navigation.navigate(routeName, { screen: ROUTES.workforceHubOverview });
      closeDrawer();
      return;
    }

    if (routeName === ROUTES.myOrganization) {
      props.navigation.navigate(routeName, { screen: ROUTES.myOrganizationOverview });
      closeDrawer();
      return;
    }

    props.navigation.navigate(routeName);
    closeDrawer();
  };
  const handleSignOut = () => {
    closeDrawer();
    void signOut();
  };

  return (
    <View style={styles.drawer}>
      <LinearGradient
        colors={['#020914', '#061321', '#0a1d33']}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={styles.drawerGradient}
      >
        <SafeAreaView edges={['top', 'left', 'bottom']} style={styles.safeArea}>
        <View style={styles.drawerHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.identity}>
            <Text numberOfLines={1} style={styles.drawerName}>
              {displayName}
            </Text>
            <Text numberOfLines={1} style={styles.drawerSubtitle}>
              {userEmail}
            </Text>
          </View>
          <Pressable
            accessibilityLabel="Open notifications"
            accessibilityRole="button"
            onPress={openNotifications}
            style={({ pressed }) => [
              styles.notificationButton,
              pressed ? styles.pressed : undefined,
            ]}
          >
            <Feather color={reactNativeColorScheme.ultiHuman.text} name="bell" size={19} />
          </Pressable>
        </View>

        <DrawerContentScrollView
          {...props}
          contentContainerStyle={styles.menuContent}
          showsVerticalScrollIndicator={false}
          style={styles.menuScroll}
        >
          <Text style={styles.groupLabel}>Workspace</Text>
          <Pressable
            accessibilityLabel="Open Dashboard"
            accessibilityRole="button"
            onPress={() => {
              props.navigation.navigate(ROUTES.appTabs, {
                screen: ROUTES.tabHome,
              });
              closeDrawer();
            }}
            style={({ pressed }) => [
              styles.menuItem,
              activeItem === 'dashboard' ? styles.menuItemActive : undefined,
              pressed ? styles.pressed : undefined,
            ]}
          >
            <View style={[styles.iconFrame, activeItem === 'dashboard' ? styles.iconFrameActive : undefined]}>
              <Feather
                color={
                  activeItem === 'dashboard'
                    ? reactNativeColorScheme.text.inverse
                    : reactNativeColorScheme.ultiHuman.text
                }
                name="grid"
                size={18}
              />
            </View>
            <Text style={[styles.menuText, activeItem === 'dashboard' ? styles.menuTextActive : undefined]}>
              Dashboard
            </Text>
          </Pressable>

          <Text style={styles.groupLabel}>Modules</Text>
          <View style={styles.menuGroup}>
            {workspaceItems.map((item) => {
              const isActive = activeItem === item.id;

              return (
                <Pressable
                  accessibilityLabel={`Open ${item.label}`}
                  accessibilityRole="button"
                  key={item.id}
                  onPress={() => navigateAndClose(item.route)}
                  style={({ pressed }) => [
                    styles.menuItem,
                    isActive ? styles.menuItemActive : undefined,
                    pressed ? styles.pressed : undefined,
                  ]}
                >
                  <View style={[styles.iconFrame, isActive ? styles.iconFrameActive : undefined]}>
                    <Feather
                      color={
                        isActive
                          ? reactNativeColorScheme.text.inverse
                          : reactNativeColorScheme.ultiHuman.text
                      }
                      name={item.icon}
                      size={18}
                    />
                  </View>
                  <Text style={[styles.menuText, isActive ? styles.menuTextActive : undefined]}>
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </DrawerContentScrollView>

        <View style={styles.footer}>
          <Pressable
            accessibilityRole="button"
            onPress={handleSignOut}
            style={({ pressed }) => [
              styles.signOutButton,
              pressed ? styles.pressed : undefined,
            ]}
          >
            <Feather color={reactNativeColorScheme.status.danger.foreground} name="log-out" size={18} />
            <Text style={styles.signOutText}>Sign out</Text>
          </Pressable>
        </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    backgroundColor: reactNativeColorScheme.brand[700],
    borderRadius: radius(22),
    height: spacing(44),
    justifyContent: 'center',
    width: spacing(44),
  },
  avatarText: {
    color: reactNativeColorScheme.text.inverse,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(14),
    lineHeight: spacing(19),
  },
  notificationButton: {
    alignItems: 'center',
    backgroundColor: reactNativeColorScheme.ultiHuman.surface.glassSoft,
    borderColor: reactNativeColorScheme.ultiHuman.surface.aquaBorderMuted,
    borderRadius: radius(8),
    borderWidth: 1,
    height: spacing(42),
    justifyContent: 'center',
    width: spacing(42),
  },
  drawer: {
    backgroundColor: 'transparent',
    borderBottomRightRadius: spacing(28),
    borderTopRightRadius: spacing(28),
    flex: 1,
    minHeight: '100%',
    overflow: 'hidden',
    width: '100%',
    shadowColor: reactNativeColorScheme.slate[950],
    shadowOffset: { height: 0, width: spacing(8) },
    shadowOpacity: 0.16,
    shadowRadius: spacing(18),
  },
  drawerGradient: {
    borderBottomRightRadius: spacing(28),
    borderTopRightRadius: spacing(28),
    flex: 1,
  },
  drawerHeader: {
    alignItems: 'center',
    backgroundColor: reactNativeColorScheme.ultiHuman.surface.glassPanel,
    borderColor: reactNativeColorScheme.ultiHuman.surface.aquaBorderMuted,
    borderRadius: radius(8),
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing(12),
    marginHorizontal: spacing(14),
    marginTop: spacing(8),
    paddingHorizontal: spacing(18),
    paddingVertical: spacing(16),
    shadowColor: reactNativeColorScheme.ultiHuman.surface.cardShadow,
    shadowOffset: { height: spacing(8), width: 0 },
    shadowOpacity: 0.28,
    shadowRadius: spacing(18),
  },
  drawerName: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(16),
    lineHeight: spacing(22),
  },
  drawerSubtitle: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansRegular,
    fontSize: fontSize(12),
    lineHeight: spacing(16),
  },
  footer: {
    backgroundColor: 'rgba(2, 9, 20, 0.34)',
    borderTopColor: reactNativeColorScheme.ultiHuman.surface.aquaBorderMuted,
    borderTopWidth: 1,
    marginTop: 'auto',
    paddingBottom: spacing(20),
    paddingHorizontal: spacing(18),
    paddingTop: spacing(14),
  },
  groupLabel: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(11),
    letterSpacing: 0,
    lineHeight: spacing(15),
    paddingHorizontal: spacing(4),
    paddingTop: spacing(8),
    textTransform: 'uppercase',
  },
  iconFrame: {
    alignItems: 'center',
    backgroundColor: reactNativeColorScheme.ultiHuman.surface.glassSoft,
    borderColor: reactNativeColorScheme.ultiHuman.surface.aquaBorderMuted,
    borderRadius: radius(8),
    borderWidth: 1,
    height: spacing(42),
    justifyContent: 'center',
    width: spacing(42),
  },
  iconFrameActive: {
    backgroundColor: reactNativeColorScheme.ultiHuman.accent,
    borderColor: reactNativeColorScheme.ultiHuman.accent,
  },
  identity: {
    flex: 1,
    minWidth: 0,
  },
  menuContent: {
    gap: spacing(12),
    paddingBottom: spacing(20),
    paddingHorizontal: spacing(14),
    paddingTop: spacing(16),
  },
  menuGroup: {
    gap: spacing(8),
  },
  menuItem: {
    alignItems: 'center',
    backgroundColor: reactNativeColorScheme.ultiHuman.surface.glassPanel,
    borderColor: reactNativeColorScheme.ultiHuman.surface.aquaBorderMuted,
    borderWidth: 1,
    borderRadius: radius(8),
    flexDirection: 'row',
    gap: spacing(12),
    minHeight: spacing(58),
    paddingHorizontal: spacing(10),
  },
  menuItemActive: {
    backgroundColor: reactNativeColorScheme.ultiHuman.module.accentSoft,
    borderColor: reactNativeColorScheme.ultiHuman.module.borderStrong,
    shadowColor: reactNativeColorScheme.ultiHuman.accent,
    shadowOffset: { height: spacing(8), width: 0 },
    shadowOpacity: 0.16,
    shadowRadius: spacing(14),
  },
  menuScroll: {
    flex: 1,
  },
  menuText: {
    color: reactNativeColorScheme.text.primary,
    flex: 1,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(14),
    lineHeight: spacing(20),
  },
  menuTextActive: {
    color: reactNativeColorScheme.ultiHuman.text,
  },
  pressed: {
    opacity: 0.74,
  },
  safeArea: {
    flex: 1,
  },
  signOutButton: {
    alignItems: 'center',
    backgroundColor: reactNativeColorScheme.status.danger.background,
    borderColor: reactNativeColorScheme.status.danger.border,
    borderRadius: radius(8),
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing(12),
    minHeight: spacing(50),
    paddingHorizontal: spacing(14),
  },
  signOutText: {
    color: reactNativeColorScheme.status.danger.foreground,
    flex: 1,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(13),
    lineHeight: spacing(18),
  },
});
