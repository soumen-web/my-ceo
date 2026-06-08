import type { AuthSessionDto } from '@/modules/auth/infrastructure/dtos/AuthSessionDto';
import type { AuthApiSessionDataDto } from '@/modules/auth/infrastructure/dtos/AuthApiSessionDto';
import { UnknownAppError, ValidationError } from '@/shared/core/errors/AppError';

interface LoginJwtPayload {
  email?: string;
  roleId?: string;
  roleName?: string;
  sub?: string;
}

const hasValue = <T>(value: T | null | undefined): value is T =>
  value !== null && value !== undefined;

const getStringValue = (value: unknown): string | undefined =>
  typeof value === 'string' && value.trim() ? value : undefined;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const decodeBase64Url = (value: string): string | null => {
  const atob = (globalThis as { atob?: (input: string) => string }).atob;

  if (!atob) {
    return null;
  }

  try {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    const decoded = atob(padded);

    return decodeURIComponent(
      Array.from(decoded, (character) =>
        `%${character.charCodeAt(0).toString(16).padStart(2, '0')}`,
      ).join(''),
    );
  } catch {
    return null;
  }
};

const parseJwtPayload = (token: string | undefined): LoginJwtPayload | null => {
  const [, payloadSegment] = token?.split('.') ?? [];
  const decodedPayload = payloadSegment ? decodeBase64Url(payloadSegment) : null;

  if (!decodedPayload) {
    return null;
  }

  try {
    const payload: unknown = JSON.parse(decodedPayload);

    if (!isRecord(payload)) {
      return null;
    }

    return {
      email: getStringValue(payload.email),
      roleId: getStringValue(payload.roleId),
      roleName: getStringValue(payload.roleName),
      sub: getStringValue(payload.sub),
    };
  } catch {
    return null;
  }
};

export const authApiSessionMapper = {
  toDto(
    payload: AuthApiSessionDataDto | undefined,
    fallbackEmail: string,
  ): AuthSessionDto {
    const accessToken = payload?.accessToken ?? payload?.access_token;
    const refreshToken = payload?.refreshToken ?? payload?.refresh_token;
    const jwtPayload = parseJwtPayload(accessToken);
    const user = payload?.user ?? payload?.profile;
    const isVerified =
      payload?.isVerified ??
      payload?.is_verified ??
      user?.isVerified ??
      user?.is_verified ??
      user?.isEmailVerified ??
      user?.is_email_verified;
    const userId = user?._id ?? user?.id ?? jwtPayload?.sub ?? fallbackEmail;
    const userEmail = user?.email ?? jwtPayload?.email ?? fallbackEmail;
    const userAccountType = user?.accountType ?? user?.account_type;
    const userCreatedAt = user?.createdAt ?? user?.created_at;
    const userDisplayName = user?.displayName ?? user?.display_name;
    const userFirstName = user?.firstName ?? user?.first_name;
    const userFullName = user?.fullName ?? user?.full_name ?? userDisplayName;
    const userIsEmailVerified = user?.isEmailVerified ?? user?.is_email_verified;
    const userLastName = user?.lastName ?? user?.last_name;
    const userProfileImage = user?.profileImage ?? user?.profile_image;
    const capabilities =
      user?.capabilities ??
      user?.permissions ??
      payload?.capabilities ??
      payload?.permissions;

    if (isVerified === false) {
      throw new ValidationError('Please verify OTP before login.', {
        details: {
          isVerified: false,
          reason: 'otp_verification_required',
        },
        userMessage: 'Please verify OTP before login.',
      });
    }

    if (!accessToken || !userId || !userEmail) {
      throw new UnknownAppError('Malformed login response.', {
        userMessage: 'Unexpected login response. Please try again.',
      });
    }

    return {
      accessToken,
      ...(refreshToken ? { refreshToken } : {}),
      user: {
        ...(hasValue(userAccountType) ? { accountType: userAccountType } : {}),
        ...(hasValue(userCreatedAt) ? { createdAt: userCreatedAt } : {}),
        email: userEmail,
        ...(userFirstName ?? userDisplayName
          ? { firstName: userFirstName ?? userDisplayName }
          : {}),
        ...(hasValue(userFullName) ? { fullName: userFullName } : {}),
        id: userId,
        ...(hasValue(userIsEmailVerified)
          ? { isEmailVerified: userIsEmailVerified }
          : {}),
        ...(userLastName ? { lastName: userLastName } : {}),
        ...(hasValue(user?.messages) ? { messages: user.messages } : {}),
        ...(hasValue(userProfileImage) ? { profileImage: userProfileImage } : {}),
        ...(Array.isArray(capabilities) ? { capabilities } : {}),
        ...(hasValue(user?.role) || jwtPayload?.roleId || jwtPayload?.roleName
          ? {
              role: {
                ...(hasValue(user?.role?._id) || jwtPayload?.roleId
                  ? { _id: user?.role?._id ?? jwtPayload?.roleId }
                  : {}),
                ...(hasValue(user?.role?.role) || jwtPayload?.roleName
                  ? { role: user?.role?.role ?? jwtPayload?.roleName }
                  : {}),
                ...(hasValue(user?.role?.roleDisplayName) || jwtPayload?.roleName
                  ? {
                      roleDisplayName:
                        user?.role?.roleDisplayName ?? jwtPayload?.roleName,
                    }
                  : {}),
              },
            }
          : {}),
        ...(hasValue(user?.status) ? { status: user.status } : {}),
        ...(hasValue(user?.userName) ? { userName: user.userName } : {}),
      },
    };
  },
};
