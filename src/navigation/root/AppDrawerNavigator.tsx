import { createDrawerNavigator } from '@react-navigation/drawer';

import {
  HomeScreen,
  ProfileDetailsScreen,
} from '@modules/home';
import { DashboardSideMenu } from '@/modules/home/presentation/components/DashboardSideMenu';
import { HrQueryScreen } from '@/modules/hr-query';
import { NotificationsScreen } from '@/modules/notifications';
import { ROUTES, type AppDrawerParamList } from '@/navigation/route-types';
import { reactNativeColorScheme } from '@/design-system/tokens/colors';
import { AttendanceStackNavigator } from './AttendanceStackNavigator';
import { HrmsStackNavigator } from './HrmsStackNavigator';
import { LeaveStackNavigator } from './LeaveStackNavigator';
import { MyOrganizationStackNavigator } from './MyOrganizationStackNavigator';
import { PayrollStackNavigator } from './PayrollStackNavigator';

const Drawer = createDrawerNavigator<AppDrawerParamList>();

export const AppDrawerNavigator = () => (
  <Drawer.Navigator
    drawerContent={(props) => <DashboardSideMenu {...props} />}
    screenOptions={{
      drawerStyle: {
        backgroundColor: reactNativeColorScheme.ultiHuman.background,
        borderBottomRightRadius: 28,
        borderTopRightRadius: 28,
        height: '100%',
        overflow: 'hidden',
        width: '88%',
      },
      drawerType: 'front',
      headerShown: false,
      overlayColor: 'rgba(7, 28, 46, 0.32)',
      swipeEdgeWidth: 28,
    }}
  >
    <Drawer.Screen component={HomeScreen} name={ROUTES.home} />
    <Drawer.Screen component={AttendanceStackNavigator} name={ROUTES.attendance} />
    <Drawer.Screen component={LeaveStackNavigator} name={ROUTES.leave} />
    <Drawer.Screen component={PayrollStackNavigator} name={ROUTES.payroll} />
    <Drawer.Screen component={HrQueryScreen} name={ROUTES.hrQuery} />
    <Drawer.Screen component={NotificationsScreen} name={ROUTES.notifications} />
    <Drawer.Screen component={MyOrganizationStackNavigator} name={ROUTES.myOrganization} />
    <Drawer.Screen component={ProfileDetailsScreen} name={ROUTES.profileDetails} />
    <Drawer.Screen component={HrmsStackNavigator} name={ROUTES.workforceHub} />
  </Drawer.Navigator>
);
