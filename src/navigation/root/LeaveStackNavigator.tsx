import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {
  ApplyLeaveScreen,
  LeaveAnalyticsScreen,
  LeaveDetailScreen,
  LeaveHistoryScreen,
  LeaveHomeScreen,
} from '@/modules/leave';
import { ROUTES, type LeaveStackParamList } from '@/navigation/route-types';

import { premiumStackScreenOptions } from './premiumStackScreenOptions';

const Stack = createNativeStackNavigator<LeaveStackParamList>();

export const LeaveStackNavigator = () => (
  <Stack.Navigator
    initialRouteName={ROUTES.leaveHome}
    screenOptions={premiumStackScreenOptions}
  >
    <Stack.Screen component={LeaveHomeScreen} name={ROUTES.leaveHome} />
    <Stack.Screen component={ApplyLeaveScreen} name={ROUTES.leaveApply} />
    <Stack.Screen component={LeaveHistoryScreen} name={ROUTES.leaveHistory} />
    <Stack.Screen component={LeaveAnalyticsScreen} name={ROUTES.leaveAnalytics} />
    <Stack.Screen component={LeaveDetailScreen} name={ROUTES.leaveDetail} />
  </Stack.Navigator>
);
