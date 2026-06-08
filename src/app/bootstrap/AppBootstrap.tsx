import type { ReactNode } from 'react';

import { ErrorState } from '@/design-system/patterns/ErrorState';
import { LoadingState } from '@/design-system/patterns/LoadingState';

import { useAppStartup } from '@/app/startup/useAppStartup';

interface AppBootstrapProps {
  children: ReactNode;
}

export const AppBootstrap = ({ children }: AppBootstrapProps) => {
  const { errorMessage, isReady, retry, status } = useAppStartup();

  if (status === 'failed') {
    return (
      <ErrorState
        description={
          errorMessage ??
          'Startup did not complete successfully. Review configuration and retry.'
        }
        onRetry={() => {
          void retry();
        }}
        title="Unable to initialize the application"
      />
    );
  }

  if (!isReady) {
    return <LoadingState label="Preparing app..." />;
  }

  return children;
};
