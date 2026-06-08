export type AppErrorCode =
  | 'AUTHENTICATION_ERROR'
  | 'AUTHORIZATION_ERROR'
  | 'BUSINESS_RULE_ERROR'
  | 'NETWORK_ERROR'
  | 'SERVER_ERROR'
  | 'UNKNOWN_ERROR'
  | 'VALIDATION_ERROR';

interface AppErrorOptions {
  cause?: unknown;
  details?: Record<string, unknown>;
  userMessage?: string;
}

export abstract class AppError extends Error {
  public override readonly cause: unknown;
  public readonly code: AppErrorCode;
  public readonly details: Record<string, unknown> | undefined;
  public readonly userMessage: string;

  protected constructor(
    code: AppErrorCode,
    message: string,
    options?: AppErrorOptions,
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.cause = options?.cause;
    this.details = options?.details;
    this.userMessage = options?.userMessage ?? message;
  }
}

export class ValidationError extends AppError {
  public constructor(message: string, options?: AppErrorOptions) {
    super('VALIDATION_ERROR', message, options);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends AppError {
  public constructor(message = 'Authentication is required.', options?: AppErrorOptions) {
    super('AUTHENTICATION_ERROR', message, options);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  public constructor(message = 'You are not authorized to perform this action.', options?: AppErrorOptions) {
    super('AUTHORIZATION_ERROR', message, options);
    this.name = 'AuthorizationError';
  }
}

export class NetworkError extends AppError {
  public constructor(message = 'Network connectivity is unavailable.', options?: AppErrorOptions) {
    super('NETWORK_ERROR', message, options);
    this.name = 'NetworkError';
  }
}

export class ServerError extends AppError {
  public constructor(message = 'The server could not process the request.', options?: AppErrorOptions) {
    super('SERVER_ERROR', message, options);
    this.name = 'ServerError';
  }
}

export class BusinessRuleError extends AppError {
  public constructor(message: string, options?: AppErrorOptions) {
    super('BUSINESS_RULE_ERROR', message, options);
    this.name = 'BusinessRuleError';
  }
}

export class UnknownAppError extends AppError {
  public constructor(message = 'An unexpected application error occurred.', options?: AppErrorOptions) {
    super('UNKNOWN_ERROR', message, options);
    this.name = 'UnknownAppError';
  }
}

export const toAppError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    return new UnknownAppError(error.message, {
      cause: error,
    });
  }

  return new UnknownAppError();
};
