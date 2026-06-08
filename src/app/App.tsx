import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';

import { AppFontSources } from '@/assets/fonts';
import { AppErrorBoundary } from '@/shared/ui/AppErrorBoundary';
import { useAppTheme } from '@/hooks/useAppTheme';
import { linkingConfig } from '@/navigation/deep-links/linking';
import { RootNavigator } from '@/navigation/root/RootNavigator';

import { AppBootstrap } from './bootstrap/AppBootstrap';
import { AppProviders } from './providers/AppProviders';

const AppShell = () => {
  const theme = useAppTheme();

  return (
    <NavigationContainer linking={linkingConfig} theme={theme.navigationTheme}>
      <AppBootstrap>
        <RootNavigator />
      </AppBootstrap>
    </NavigationContainer>
  );
};

const App = () => {
  const [fontsLoaded] = useFonts(AppFontSources);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AppErrorBoundary>
      <AppProviders>
        <AppShell />
      </AppProviders>
    </AppErrorBoundary>
  );
};

export default App;
