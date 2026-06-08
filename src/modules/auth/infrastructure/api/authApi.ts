import type {
  RequestOtpCredentials,
  RequestOtpResult,
  SignInCredentials,
  VerifyOtpCredentials,
} from '@/modules/auth/domain/entities/AuthSession';
import type { AuthApiSessionResponseDto } from '@/modules/auth/infrastructure/dtos/AuthApiSessionDto';
import type { AuthSessionDto } from '@/modules/auth/infrastructure/dtos/AuthSessionDto';
import type { RequestOtpApiResponseDto } from '@/modules/auth/infrastructure/dtos/AuthOtpDto';
import { authApiSessionMapper } from '@/modules/auth/infrastructure/mappers/authApiSessionMapper';
import { authOtpMapper } from '@/modules/auth/infrastructure/mappers/authOtpMapper';
import { env } from '@/config/env';
import { API } from '@/services/api/apiEndpoints';
import { apiClient } from '@/services/api/client/apiClient';
import { mapApiError } from '@/services/api/error-mapping/mapApiError';
import {
  AppError,
  BusinessRuleError,
} from '@/shared/core/errors/AppError';

const unauthenticatedAuthRequestConfig = {
  headers: {
    Accept: '*/*',
    'Content-Type': 'application/json',
  },
  metadata: {
    skipAuthRefresh: true,
    skipAuthToken: true,
  },
} as const;

const resolveApiUrl = (endpoint: string): string => `${env.apiBaseUrl}${endpoint}`;

interface ApiSuccessEnvelope {
  message?: string;
  statusCode?: number;
  success?: boolean;
}

const logAuthApiCallInDev = (label: string, endpoint: string) => {
  if (!__DEV__) {
    return;
  }

  console.info(`[Auth API] ${label} call`, {
    endpoint,
    url: resolveApiUrl(endpoint),
  });
};

const logAuthApiResponseInDev = (
  label: string,
  response: ApiSuccessEnvelope & {
    data?: {
      access_token?: string;
      otp?: string;
      profile?: unknown;
      refresh_token?: string;
    };
  },
) => {
  if (!__DEV__) {
    return;
  }

  console.info(`[Auth API] ${label} response`, {
    hasAccessToken: Boolean(response.data?.access_token),
    hasOtp: Boolean(response.data?.otp),
    hasProfile: Boolean(response.data?.profile),
    hasRefreshToken: Boolean(response.data?.refresh_token),
    message: response.message,
    statusCode: response.statusCode,
    success: response.success,
  });
};

const assertSuccessfulAuthResponse = (response: ApiSuccessEnvelope): void => {
  if (response.success === false) {
    throw new BusinessRuleError(response.message ?? 'Authentication failed.', {
      details: {
        statusCode: response.statusCode,
      },
      userMessage: response.message ?? 'Authentication failed. Please try again.',
    });
  }
};

export const authApi = {
  async deleteAccount(): Promise<void> {
    try {
      await apiClient.delete(API.user.account, {
        headers: {
          Accept: '*/*',
        },
      });
    } catch (error) {
      throw mapApiError(error);
    }
  },
  async requestOtp(credentials: RequestOtpCredentials): Promise<RequestOtpResult> {
    const requestDto = authOtpMapper.toRequestOtpDto(credentials);
    const endpoint = API.auth.otp.request;

    try {
      logAuthApiCallInDev('Request OTP', endpoint);

      const response = await apiClient.post<RequestOtpApiResponseDto>(
        endpoint,
        requestDto,
        unauthenticatedAuthRequestConfig,
      );

      logAuthApiResponseInDev('Request OTP', response.data);
      assertSuccessfulAuthResponse(response.data);

      return authOtpMapper.toRequestOtpResult(response.data, requestDto.email);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw mapApiError(error);
    }
  },
  async signIn(credentials: SignInCredentials): Promise<AuthSessionDto> {
    const normalizedEmail = credentials.email.trim().toLowerCase();

    try {
      const response = await apiClient.post<AuthApiSessionResponseDto>(
        API.auth.login,
        {
          email: normalizedEmail,
          password: credentials.password,
        },
        unauthenticatedAuthRequestConfig,
      );

      assertSuccessfulAuthResponse(response.data);

      return authApiSessionMapper.toDto(response.data?.data ?? response.data, normalizedEmail);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw mapApiError(error);
    }
  },
  async verifyOtp(credentials: VerifyOtpCredentials): Promise<AuthSessionDto> {
    const requestDto = authOtpMapper.toVerifyOtpDto(credentials);
    const endpoint = API.auth.otp.verify;

    try {
      logAuthApiCallInDev('Verify OTP', endpoint);

      const response = await apiClient.post<AuthApiSessionResponseDto>(
        endpoint,
        requestDto,
        unauthenticatedAuthRequestConfig,
      );

      logAuthApiResponseInDev('Verify OTP', response.data);

      assertSuccessfulAuthResponse(response.data);

      return authApiSessionMapper.toDto(response.data?.data ?? response.data, requestDto.email);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw mapApiError(error);
    }
  },
};
