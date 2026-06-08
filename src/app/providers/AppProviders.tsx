import { useEffect, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { Provider as ReduxProvider } from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ComplianceProvider } from '@compliance';
import { useResolvedTheme } from '@/hooks/useResolvedTheme';
import { logger } from '@/services/observability/logger/logger';
import { sessionStorage } from '@/services/storage/sessionStorage';
import { GlobalApiLoader } from '@/shared/ui/GlobalApiLoader';
import { store } from '@/store/store';

interface AppProvidersProps {
  children: ReactNode;
}

let hasLoggedStartupAuthTokenState = false;

const maskTokenForStartupLog = (token: string): string =>
  token.length > 12 ? `${token.slice(0, 8)}...${token.slice(-4)}` : '[PRESENT]';

const ProviderBridge = ({ children }: AppProvidersProps) => {
  const theme = useResolvedTheme();

  useEffect(() => {
    if (hasLoggedStartupAuthTokenState) {
      return;
    }

    hasLoggedStartupAuthTokenState = true;

    const logStartupAuthTokenState = async () => {
      try {
        const accessToken = await sessionStorage.getAccessToken();

        logger.info('App startup auth token state', {
          hasAuth: Boolean(accessToken),
          length: accessToken?.length ?? 0,
          preview: accessToken ? maskTokenForStartupLog(accessToken) : null,
          source: 'AppProviders',
        });
        console.log('[DEBUG][App Startup Token]', {
          hasAuth: Boolean(accessToken),
          length: accessToken?.length ?? 0,
          preview: accessToken ?? null,
          source: 'AppProviders',
        });
      } catch (error) {
        logger.warn('Unable to read startup auth token state.', {
          error,
          source: 'AppProviders',
        });
        console.log('[DEBUG][App Startup Token Error]', {
          message: error instanceof Error ? error.message : 'Unable to read token',
          source: 'AppProviders',
        });
      }
    };

    void logStartupAuthTokenState();
  }, []);

  return (
    <ComplianceProvider>
      <PaperProvider theme={theme}>
        <StatusBar style={theme.dark ? 'light' : 'dark'} />
        <View style={styles.content}>
          {children}
          <GlobalApiLoader />
        </View>
      </PaperProvider>
    </ComplianceProvider>
  );
};

export const AppProviders = ({ children }: AppProvidersProps) => (
  <GestureHandlerRootView style={styles.root}>
    <ReduxProvider store={store}>
      <SafeAreaProvider>
        <ProviderBridge>{children}</ProviderBridge>
      </SafeAreaProvider>
    </ReduxProvider>
  </GestureHandlerRootView>
);

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  root: {
    flex: 1,
  },
});
