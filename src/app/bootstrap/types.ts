import type { AppDispatch } from '@/store/store';
import type { AppError } from '@shared/core/errors/AppError';

export interface BootstrapContext {
  dispatch: AppDispatch;
}

export interface BootstrapTask {
  critical?: boolean;
  execute: (context: BootstrapContext) => Promise<void>;
  key: string;
}

export interface BootstrapFailure {
  error: AppError;
  key: string;
}

export interface BootstrapPipelineResult {
  failures: BootstrapFailure[];
  isReady: boolean;
}
