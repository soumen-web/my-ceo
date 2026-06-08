import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { HrmsScreen, HrmsSelfServiceDetailScreen } from '@/modules/hrms';
import { ROUTES, type HrmsStackParamList } from '@/navigation/route-types';

import { premiumStackScreenOptions } from './premiumStackScreenOptions';

const Stack = createNativeStackNavigator<HrmsStackParamList>();

export const HrmsStackNavigator = () => (
  <Stack.Navigator
    initialRouteName={ROUTES.workforceHubOverview}
    screenOptions={premiumStackScreenOptions}
  >
    <Stack.Screen component={HrmsScreen} name={ROUTES.workforceHubOverview} />
    <Stack.Screen
      component={HrmsSelfServiceDetailScreen}
      name={ROUTES.workforceHubDetail}
    />
  </Stack.Navigator>
);
