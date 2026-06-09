import { useCallback, useMemo, useState } from 'react';

import type { WexaChatMessage } from '@/modules/wexa/domain/entities/WexaChatMessage';
import {
  openRouterApi,
  OpenRouterApiError,
  type OpenRouterChatMessage,
} from '@/modules/wexa/infrastructure/api/openRouterApi';

const MAX_CONTEXT_MESSAGES = 12;

const createMessageId = (): string =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const toFriendlyError = (error: unknown): string => {
  if (!(error instanceof OpenRouterApiError)) {
    return 'Wexa could not respond right now. Please try again.';
  }

  switch (error.code) {
    case 'invalid_key':
      return 'Wexa is not configured correctly. Please check the OpenRouter API key.';
    case 'malformed_response':
      return 'Wexa received an unreadable response. Please try again.';
    case 'missing_key':
      return 'Wexa AI needs a secure backend proxy before it can send messages.';
    case 'model_unavailable':
      return 'The selected Wexa model is unavailable. Please update the OpenRouter model.';
    case 'production_proxy_required':
      return 'Wexa AI needs a secure backend proxy before production use.';
    case 'rate_limited':
      return 'Wexa is receiving too many requests. Please wait a moment and retry.';
    case 'timeout':
      return 'Wexa took too long to respond. Please try again.';
    case 'network':
      return 'Wexa cannot reach the network. Please check your connection.';
    default:
      return 'Wexa could not respond right now. Please try again.';
  }
};

const toApiMessages = (
  messages: WexaChatMessage[],
): OpenRouterChatMessage[] => [
  {
    content: openRouterApi.systemPrompt,
    role: 'system',
  },
  ...messages.slice(-MAX_CONTEXT_MESSAGES).map((message) => ({
    content: message.content,
    role: message.role,
  })),
];

export const useWexaChat = () => {
  const [messages, setMessages] = useState<WexaChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastPrompt, setLastPrompt] = useState<string | null>(null);

  const hasMessages = messages.length > 0;

  const sendMessage = useCallback(
    async (content: string, options?: { replay?: boolean }) => {
      const trimmedContent = content.trim();

      if (!trimmedContent || isLoading) {
        return false;
      }

      const userMessage: WexaChatMessage = {
        content: trimmedContent,
        createdAt: Date.now(),
        id: createMessageId(),
        role: 'user',
      };
      const nextMessages = options?.replay
        ? messages
        : [...messages, userMessage];

      if (!options?.replay) {
        setMessages(nextMessages);
        setLastPrompt(trimmedContent);
      }

      setError(null);
      setIsLoading(true);

      try {
        const response = await openRouterApi.createChatCompletion(
          toApiMessages(nextMessages),
        );
        const assistantMessage: WexaChatMessage = {
          content: response,
          createdAt: Date.now(),
          id: createMessageId(),
          role: 'assistant',
        };

        setMessages((currentMessages) => [...currentMessages, assistantMessage]);

        return true;
      } catch (requestError) {
        setError(toFriendlyError(requestError));

        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, messages],
  );

  const retryLastMessage = useCallback(async () => {
    if (!lastPrompt || isLoading) {
      return false;
    }

    return sendMessage(lastPrompt, { replay: true });
  }, [isLoading, lastPrompt, sendMessage]);

  const clearChat = useCallback(() => {
    if (isLoading) {
      return;
    }

    setMessages([]);
    setError(null);
    setLastPrompt(null);
  }, [isLoading]);

  return useMemo(
    () => ({
      clearChat,
      error,
      hasMessages,
      isLoading,
      messages,
      retryLastMessage,
      sendMessage,
    }),
    [
      clearChat,
      error,
      hasMessages,
      isLoading,
      messages,
      retryLastMessage,
      sendMessage,
    ],
  );
};
