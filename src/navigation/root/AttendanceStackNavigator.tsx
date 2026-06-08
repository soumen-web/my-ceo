import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {
  AttendanceDailyTimelineScreen,
  AttendanceDetailScreen,
  AttendanceHistoryScreen,
  AttendanceHomeScreen,
  AttendanceMonthlyAnalyticsScreen,
} from '@/modules/attendance';
import { ROUTES, type AttendanceStackParamList } from '@/navigation/route-types';

import { premiumStackScreenOptions } from './premiumStackScreenOptions';

const Stack = createNativeStackNavigator<AttendanceStackParamList>();

export const AttendanceStackNavigator = () => (
  <Stack.Navigator
    initialRouteName={ROUTES.attendanceHome}
    screenOptions={premiumStackScreenOptions}
  >
    <Stack.Screen component={AttendanceHomeScreen} name={ROUTES.attendanceHome} />
    <Stack.Screen component={AttendanceDetailScreen} name={ROUTES.attendanceDetail} />
    <Stack.Screen
      component={AttendanceMonthlyAnalyticsScreen}
      name={ROUTES.attendanceAnalytics}
    />
    <Stack.Screen
      component={AttendanceDailyTimelineScreen}
      name={ROUTES.attendanceDailyTimeline}
    />
    <Stack.Screen component={AttendanceHistoryScreen} name={ROUTES.attendanceHistory} />
  </Stack.Navigator>
);
