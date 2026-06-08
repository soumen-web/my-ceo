import type {
  RequestOtpCredentials,
  RequestOtpResult,
  VerifyOtpCredentials,
} from '@/modules/auth/domain/entities/AuthSession';
import type {
  RequestOtpApiRequestDto,
  RequestOtpApiResponseDto,
  VerifyOtpApiRequestDto,
} from '@/modules/auth/infrastructure/dtos/AuthOtpDto';

const AUTH_OTP_PLATFORM = 'desktop';

const normalizeEmail = (email: string): string => email.trim().toLowerCase();

const normalizeOtp = (otp: string): string => otp.trim();

const normalizeMessage = (message: string | undefined): string | undefined => {
  const normalizedMessage = message?.trim();

  return normalizedMessage ? normalizedMessage : undefined;
};

const normalizeOtpResponse = (otp: string | undefined): string | undefined => {
  const normalizedOtp = otp?.replace(/\D/g, '').slice(0, 4);

  return normalizedOtp ? normalizedOtp : undefined;
};

export const authOtpMapper = {
  toRequestOtpDto(credentials: RequestOtpCredentials): RequestOtpApiRequestDto {
    return {
      email: normalizeEmail(credentials.email),
      platform: AUTH_OTP_PLATFORM,
    };
  },
  toRequestOtpResult(
    response: RequestOtpApiResponseDto | undefined,
    email: string,
  ): RequestOtpResult {
    const message = normalizeMessage(response?.message ?? response?.data?.message);
    const otp = normalizeOtpResponse(response?.data?.otp);

    return {
      email,
      ...(message ? { message } : {}),
      ...(otp ? { otp } : {}),
    };
  },
  toVerifyOtpDto(credentials: VerifyOtpCredentials): VerifyOtpApiRequestDto {
    return {
      email: normalizeEmail(credentials.email),
      otp: normalizeOtp(credentials.otp),
      platform: AUTH_OTP_PLATFORM,
    };
  },
};
