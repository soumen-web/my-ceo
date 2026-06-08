export interface ApiErrorPayload {
  code?: string;
  correlationId?: string;
  message?: string;
}

export class ApiClientError extends Error {
  public readonly code: string;
  public readonly correlationId: string | undefined;
  public readonly status: number;

  public constructor({
    message,
    code,
    status,
    correlationId,
  }: {
    message: string;
    code: string;
    status: number;
    correlationId?: string | undefined;
  }) {
    super(message);
    this.name = 'ApiClientError';
    this.code = code;
    this.status = status;
    this.correlationId = correlationId;
  }
}
