import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {
  MyOrganizationInfoScreen,
  MyOrganizationScreen,
  MyReportingManagerScreen,
  MyTeamScreen,
  MyWorkLocationScreen,
  MyWorkModeScreen,
} from '@/modules/my-organization';
import { ROUTES, type MyOrganizationStackParamList } from '@/navigation/route-types';

import { premiumStackScreenOptions } from './premiumStackScreenOptions';

const Stack = createNativeStackNavigator<MyOrganizationStackParamList>();

export const MyOrganizationStackNavigator = () => (
  <Stack.Navigator
    initialRouteName={ROUTES.myOrganizationOverview}
    screenOptions={premiumStackScreenOptions}
  >
    <Stack.Screen component={MyOrganizationScreen} name={ROUTES.myOrganizationOverview} />
    <Stack.Screen component={MyOrganizationInfoScreen} name={ROUTES.myOrganizationInfo} />
    <Stack.Screen component={MyReportingManagerScreen} name={ROUTES.myReportingManager} />
    <Stack.Screen component={MyTeamScreen} name={ROUTES.myTeam} />
    <Stack.Screen component={MyWorkLocationScreen} name={ROUTES.myWorkLocation} />
    <Stack.Screen component={MyWorkModeScreen} name={ROUTES.myWorkMode} />
  </Stack.Navigator>
);
