import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AttendanceStackNavigator } from '@/navigation/root/AttendanceStackNavigator';
import { HrmsStackNavigator } from '@/navigation/root/HrmsStackNavigator';
import { LeaveStackNavigator } from '@/navigation/root/LeaveStackNavigator';
import { MyOrganizationStackNavigator } from '@/navigation/root/MyOrganizationStackNavigator';
import { PayrollStackNavigator } from '@/navigation/root/PayrollStackNavigator';
import { HrQueryScreen } from '@/modules/hr-query';
import { MyDeskScreen } from '@/modules/my-desk';
import { NotificationsScreen } from '@/modules/notifications';
import { ROUTES, type MyDeskStackParamList } from '@/navigation/route-types';

import { premiumStackScreenOptions } from './premiumStackScreenOptions';

const Stack = createNativeStackNavigator<MyDeskStackParamList>();

export const MyDeskStackNavigator = () => (
  <Stack.Navigator
    initialRouteName={ROUTES.myDeskHome}
    screenOptions={premiumStackScreenOptions}
  >
    <Stack.Screen component={MyDeskScreen} name={ROUTES.myDeskHome} />
    <Stack.Screen component={AttendanceStackNavigator} name={ROUTES.attendance} />
    <Stack.Screen component={LeaveStackNavigator} name={ROUTES.leave} />
    <Stack.Screen component={PayrollStackNavigator} name={ROUTES.payroll} />
    <Stack.Screen component={HrQueryScreen} name={ROUTES.hrQuery} />
    <Stack.Screen component={NotificationsScreen} name={ROUTES.notifications} />
    <Stack.Screen
      component={MyOrganizationStackNavigator}
      name={ROUTES.myOrganization}
    />
    <Stack.Screen component={HrmsStackNavigator} name={ROUTES.workforceHub} />
  </Stack.Navigator>
);
