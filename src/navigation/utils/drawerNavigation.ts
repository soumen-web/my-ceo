import type { DrawerNavigationProp } from '@react-navigation/drawer';
import { DrawerActions, type NavigationProp, type ParamListBase } from '@react-navigation/native';

import type { AppDrawerParamList } from '@/navigation/route-types';

type DrawerCandidate = NavigationProp<ParamListBase> & {
  getParent?: <T = DrawerCandidate>() => T | undefined;
  openDrawer?: () => void;
};

export const getDrawerNavigation = (
  navigation: DrawerCandidate | undefined,
): DrawerNavigationProp<AppDrawerParamList> | undefined => {
  let currentNavigation = navigation;

  for (let depth = 0; depth < 8 && currentNavigation; depth += 1) {
    if (typeof currentNavigation.openDrawer === 'function') {
      return currentNavigation as unknown as DrawerNavigationProp<AppDrawerParamList>;
    }

    currentNavigation = currentNavigation.getParent?.<DrawerCandidate>();
  }

  return undefined;
};

export const openAppDrawer = (navigation: DrawerCandidate | undefined) => {
  const drawerNavigation = getDrawerNavigation(navigation);

  if (drawerNavigation) {
    drawerNavigation.openDrawer();
    return;
  }

  navigation?.dispatch(DrawerActions.openDrawer());
};
