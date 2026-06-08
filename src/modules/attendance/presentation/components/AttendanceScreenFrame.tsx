import type { DrawerNavigationProp } from '@react-navigation/drawer';
import type { NavigationProp } from '@react-navigation/native';
import type { PropsWithChildren } from 'react';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppFonts } from '@/assets/fonts';
import { MobileScreenShell } from '@/design-system/patterns/MobileScreenShell';
import { reactNativeColorScheme } from '@/design-system/tokens/colors';
import { toAuthenticatedUserViewModel, useAuthSession } from '@/modules/auth';
import { DashboardShellHeader } from '@/modules/home/presentation/components/DashboardShellHeader';
import type {
  AttendanceStackParamList,
  AppDrawerParamList,
} from '@/navigation/route-types';
import { ROUTES } from '@/navigation/route-types';
import { fontSize, spacing } from '@/utils/scale';

type AttendanceNavigation = NavigationProp<AttendanceStackParamList>;
const moduleColors = reactNativeColorScheme.ultiHuman.module;

interface AttendanceScreenFrameProps {
  isDetail?: boolean;
  navigation: AttendanceNavigation;
  onRefresh?: () => void;
  refreshing?: boolean;
  returnToDashboard?: boolean;
  routeLabel?: string;
  title: string;
}

const initialsFrom = (value: string | undefined): string => {
  const parts = value?.trim().split(/\s+/).filter(Boolean) ?? [];

  return parts.length ? parts.slice(0, 2).map((part) => part[0]).join('').toUpperCase() : 'U';
};

export const AttendanceScreenFrame = ({
  children,
  isDetail = false,
  navigation,
  onRefresh,
  refreshing = false,
  returnToDashboard = false,
  routeLabel = 'Attendance',
  title,
}: PropsWithChildren<AttendanceScreenFrameProps>) => {
  const { user } = useAuthSession();
  const userViewModel = toAuthenticatedUserViewModel(user);
  const initials = useMemo(
    () => initialsFrom(userViewModel?.displayName ?? 'Employee'),
    [userViewModel?.displayName],
  );
  const drawerNavigation = navigation.getParent<DrawerNavigationProp<AppDrawerParamList>>();

  const handleLeftPress = () => {
    if (returnToDashboard) {
      drawerNavigation?.navigate(ROUTES.home);
      return;
    }

    if (isDetail && navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    drawerNavigation?.openDrawer();
  };

  return (
    <MobileScreenShell
      header={
        <DashboardShellHeader
          initials={initials}
          leftAccessibilityLabel={isDetail ? 'Go back' : 'Open navigation menu'}
          leftIcon={isDetail ? 'arrow-left' : 'menu'}
          onMenuPress={handleLeftPress}
          onProfilePress={() => drawerNavigation?.navigate(ROUTES.profileDetails)}
        />
      }
      onRefresh={onRefresh}
      refreshing={refreshing}
    >
      <View style={styles.pageHeader}>
        <Text style={styles.routeLabel}>{routeLabel}</Text>
        <Text style={styles.pageTitle}>{title}</Text>
      </View>
      {children}
    </MobileScreenShell>
  );
};

const styles = StyleSheet.create({
  pageHeader: {
    gap: spacing(4),
    paddingTop: spacing(2),
  },
  pageTitle: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(23),
    lineHeight: spacing(29),
  },
  routeLabel: {
    color: moduleColors.accentPressed,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(12),
    lineHeight: spacing(16),
    textTransform: 'uppercase',
  },
});
