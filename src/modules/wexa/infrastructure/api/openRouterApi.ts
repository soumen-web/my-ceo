import { env } from '@/config/env';

type OpenRouterRole = 'assistant' | 'system' | 'user';

export interface OpenRouterChatMessage {
  content: string;
  role: OpenRouterRole;
}

interface OpenRouterChatCompletionRequest {
  messages: OpenRouterChatMessage[];
  model: string;
}

interface OpenRouterChatCompletionResponse {
  choices?: {
    message?: {
      content?: string;
      role?: OpenRouterRole;
    };
  }[];
  error?: {
    code?: string;
    message?: string;
  };
}

export type OpenRouterErrorCode =
  | 'invalid_key'
  | 'malformed_response'
  | 'missing_key'
  | 'model_unavailable'
  | 'network'
  | 'production_proxy_required'
  | 'rate_limited'
  | 'timeout'
  | 'unknown';

export class OpenRouterApiError extends Error {
  code: OpenRouterErrorCode;

  constructor(code: OpenRouterErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}

const OPENROUTER_TIMEOUT_MS = 30000;
const OPENROUTER_TITLE = 'Wexa AI';
const OPENROUTER_SYSTEM_PROMPT =
  'You are Wexa, an HRMS AI assistant. Wexa helps employees with attendance, leave, payroll, HR policies, profile, requests, and workplace queries. Do not invent private employee data. If app data is unavailable, ask the user to connect or fetch required data.';

const normalizeBaseUrl = (value: string): string => value.replace(/\/+$/, '');

const mapStatusToError = (status: number): OpenRouterErrorCode => {
  if (status === 401 || status === 403) {
    return 'invalid_key';
  }

  if (status === 429) {
    return 'rate_limited';
  }

  if (status === 404) {
    return 'model_unavailable';
  }

  return 'unknown';
};

export const openRouterApi = {
  systemPrompt: OPENROUTER_SYSTEM_PROMPT,

  async createChatCompletion(
    messages: OpenRouterChatMessage[],
  ): Promise<string> {
    if (env.appEnv === 'production') {
      throw new OpenRouterApiError(
        'production_proxy_required',
        'A backend proxy is required before enabling Wexa AI in production.',
      );
    }

    if (!env.openRouterApiKey.trim()) {
      throw new OpenRouterApiError(
        'missing_key',
        'OpenRouter API key is missing.',
      );
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), OPENROUTER_TIMEOUT_MS);
    const baseUrl = normalizeBaseUrl(env.openRouterBaseUrl);
    const referer = env.apiBaseUrl || undefined;

    try {
      const response = await fetch(`${baseUrl}/chat/completions`, {
        body: JSON.stringify({
          messages,
          model: env.openRouterModel,
        } satisfies OpenRouterChatCompletionRequest),
        headers: {
          Authorization: `Bearer ${env.openRouterApiKey}`,
          'Content-Type': 'application/json',
          ...(referer ? { 'HTTP-Referer': referer } : {}),
          'X-OpenRouter-Title': OPENROUTER_TITLE,
        },
        method: 'POST',
        signal: controller.signal,
      });

      const data = (await response.json().catch(() => null)) as
        | OpenRouterChatCompletionResponse
        | null;

      if (!response.ok) {
        throw new OpenRouterApiError(
          mapStatusToError(response.status),
          data?.error?.message ?? 'OpenRouter request failed.',
        );
      }

      const content = data?.choices?.[0]?.message?.content?.trim();

      if (!content) {
        throw new OpenRouterApiError(
          'malformed_response',
          'OpenRouter returned an empty response.',
        );
      }

      return content;
    } catch (error) {
      if (error instanceof OpenRouterApiError) {
        throw error;
      }

      if (error instanceof Error && error.name === 'AbortError') {
        throw new OpenRouterApiError('timeout', 'OpenRouter request timed out.');
      }

      throw new OpenRouterApiError(
        'network',
        'Unable to reach OpenRouter. Check your internet connection.',
      );
    } finally {
      clearTimeout(timeoutId);
    }
  },
};
