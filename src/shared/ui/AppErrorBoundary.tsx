import { Component, type ErrorInfo, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppButton, AppText } from '@design-system/components';
import { logger } from '@/services/observability/logger/logger';

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  hasError: boolean;
}

export class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  public override state: AppErrorBoundaryState = {
    hasError: false,
  };

  public static getDerivedStateFromError(): AppErrorBoundaryState {
    return {
      hasError: true,
    };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logger.error(error, {
      componentStack: errorInfo.componentStack,
      scope: 'AppErrorBoundary',
    });
  }

  private handleReset = (): void => {
    this.setState({
      hasError: false,
    });
  };

  public override render(): ReactNode {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <AppText variant="headlineSmall">Application unavailable</AppText>
          <AppText style={styles.description} variant="bodyMedium">
            An unexpected error was caught before any sensitive state was
            exposed. Reload the shell and retry the workflow.
          </AppText>
          <AppButton mode="contained" onPress={this.handleReset}>
            Reload shell
          </AppButton>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    gap: 16,
    justifyContent: 'center',
    padding: 24,
  },
  description: {
    textAlign: 'center',
  },
});
