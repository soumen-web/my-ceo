import type { DrawerNavigationProp } from '@react-navigation/drawer';
import type { NavigationProp } from '@react-navigation/native';
import { StackActions } from '@react-navigation/native';
import type { PropsWithChildren } from 'react';
import { useEffect, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppFonts } from '@/assets/fonts';
import { MobileScreenShell } from '@/design-system/patterns/MobileScreenShell';
import { reactNativeColorScheme } from '@/design-system/tokens/colors';
import { toAuthenticatedUserViewModel, useAuthSession } from '@/modules/auth';
import { DashboardShellHeader } from '@/modules/home/presentation/components/DashboardShellHeader';
import {
  ROUTES,
  type AppDrawerParamList,
  type HrmsStackParamList,
} from '@/navigation/route-types';
import { useAppSelector } from '@/store/hooks';
import { selectIsAuthenticated } from '@/store/slices/authSlice';
import { fontSize, spacing } from '@/utils/scale';

type HrmsNavigation = NavigationProp<HrmsStackParamList>;
const moduleColors = reactNativeColorScheme.ultiHuman.module;

interface HrmsScreenFrameProps {
  isDetail?: boolean;
  navigation: HrmsNavigation;
  onRefresh?: () => void;
  refreshing?: boolean;
  routeLabel?: string;
  scrollEnabled?: boolean;
  title: string;
}

const getInitials = (value: string | undefined): string => {
  const nameParts = value?.trim().split(/\s+/).filter(Boolean) ?? [];
  const initials = nameParts.slice(0, 2).map((part) => part[0]).join('');

  return initials ? initials.toUpperCase() : 'U';
};

export const HrmsScreenFrame = ({
  children,
  isDetail = false,
  navigation,
  onRefresh,
  refreshing = false,
  routeLabel = 'Workforce Hub',
  scrollEnabled = true,
  title,
}: PropsWithChildren<HrmsScreenFrameProps>) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { user } = useAuthSession();
  const userViewModel = toAuthenticatedUserViewModel(user);
  const initials = useMemo(
    () => getInitials(userViewModel?.displayName ?? 'Employee'),
    [userViewModel?.displayName],
  );
  const drawerNavigation = navigation.getParent<DrawerNavigationProp<AppDrawerParamList>>();

  useEffect(() => {
    if (!isAuthenticated) {
      drawerNavigation?.getParent()?.dispatch(StackActions.replace(ROUTES.signIn));
    }
  }, [drawerNavigation, isAuthenticated]);

  const handleLeftPress = () => {
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
      scrollEnabled={scrollEnabled}
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
    fontSize: fontSize(22),
    lineHeight: spacing(28),
  },
  routeLabel: {
    color: moduleColors.accentPressed,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(12),
    lineHeight: spacing(16),
    textTransform: 'uppercase',
  },
});
