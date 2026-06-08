import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { PayrollDetailScreen, PayrollHomeScreen } from '@/modules/payroll';
import { ROUTES, type PayrollStackParamList } from '@/navigation/route-types';

import { premiumStackScreenOptions } from './premiumStackScreenOptions';

const Stack = createNativeStackNavigator<PayrollStackParamList>();

export const PayrollStackNavigator = () => (
  <Stack.Navigator
    initialRouteName={ROUTES.payrollHome}
    screenOptions={premiumStackScreenOptions}
  >
    <Stack.Screen component={PayrollHomeScreen} name={ROUTES.payrollHome} />
    <Stack.Screen component={PayrollDetailScreen} name={ROUTES.payrollDetail} />
  </Stack.Navigator>
);
