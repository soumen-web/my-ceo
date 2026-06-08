import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { HomeScreen, ProfileDetailsScreen } from '@modules/home';
import { ROUTES, type AppTabParamList } from '@/navigation/route-types';

import { HrmsStackNavigator } from './HrmsStackNavigator';
import { MyDeskStackNavigator } from './MyDeskStackNavigator';
import { GlassTabBar, getGlassTabBarHeight } from './components/GlassTabBar';

const Tab = createBottomTabNavigator<AppTabParamList>();

export const AppTabNavigator = () => (
  <Tab.Navigator
    initialRouteName={ROUTES.tabHome}
    screenOptions={{
      headerShown: false,
      lazy: true,
      sceneStyle: {
        backgroundColor: 'transparent',
      },
      tabBarHideOnKeyboard: true,
      tabBarStyle: {
        backgroundColor: 'transparent',
        borderTopWidth: 0,
        elevation: 0,
        height: getGlassTabBarHeight(0),
        position: 'absolute',
        shadowOpacity: 0,
      },
    }}
    tabBar={(props) => <GlassTabBar {...props} />}
  >
    <Tab.Screen
      component={HomeScreen}
      name={ROUTES.tabHome}
      options={{ tabBarAccessibilityLabel: 'Home tab', tabBarLabel: 'Home' }}
    />
    <Tab.Screen
      component={HrmsStackNavigator}
      name={ROUTES.tabVision}
      options={{ tabBarAccessibilityLabel: 'Vision tab', tabBarLabel: 'Vision' }}
    />
    <Tab.Screen
      component={MyDeskStackNavigator}
      name={ROUTES.tabMyDesk}
      options={{ tabBarAccessibilityLabel: 'MyDesk tab', tabBarLabel: 'MyDesk' }}
    />
    <Tab.Screen
      component={ProfileDetailsScreen}
      name={ROUTES.tabProfile}
      options={{ tabBarAccessibilityLabel: 'Profile tab', tabBarLabel: 'Profile' }}
    />
  </Tab.Navigator>
);
