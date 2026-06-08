import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { SplashScreen, SignInScreen, VerifyOtpScreen } from '@modules/auth';
import { ROUTES } from '@/navigation/route-types';

import { AppDrawerNavigator } from './AppDrawerNavigator';
import { premiumStackScreenOptions } from './premiumStackScreenOptions';
import type { RootStackParamList } from '@/navigation/route-types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => (
  <Stack.Navigator initialRouteName={ROUTES.splash} screenOptions={premiumStackScreenOptions}>
    <Stack.Screen component={SplashScreen} name={ROUTES.splash} />
    <Stack.Screen component={SignInScreen} name={ROUTES.signIn} />
    <Stack.Screen component={VerifyOtpScreen} name={ROUTES.verifyOtp} />
    <Stack.Screen component={AppDrawerNavigator} name={ROUTES.appDrawer} />
  </Stack.Navigator>
);
