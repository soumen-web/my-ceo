import { createDrawerNavigator } from '@react-navigation/drawer';

import { ROUTES, type AppDrawerParamList } from '@/navigation/route-types';
import { AppTabNavigator } from './AppTabNavigator';

const Drawer = createDrawerNavigator<AppDrawerParamList>();

export const AppDrawerNavigator = () => (
  <Drawer.Navigator
    initialRouteName={ROUTES.appTabs}
    screenOptions={{
      headerShown: false,
      swipeEnabled: false,
    }}
  >
    <Drawer.Screen component={AppTabNavigator} name={ROUTES.appTabs} />
  </Drawer.Navigator>
);
