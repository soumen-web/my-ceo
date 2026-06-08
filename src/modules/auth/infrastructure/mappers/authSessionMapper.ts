import type { AppCapability, AppRole } from '@/shared/types/access';
import type { AuthSession } from '@/modules/auth/domain/entities/AuthSession';
import type { AuthSessionDto } from '@/modules/auth/infrastructure/dtos/AuthSessionDto';

const defaultRoles: AppRole[] = ['member'];
const defaultCapabilities: AppCapability[] = [
  'auth:access',
  'home:view',
  'profile:view',
];

const validCapabilities: AppCapability[] = [
  'auth:access',
  'employee:view:org',
  'home:view',
  'profile:view',
];

const toCapabilityList = (values: string[] | undefined): AppCapability[] => {
  const backendCapabilities = values?.filter(
    (value): value is AppCapability =>
      validCapabilities.includes(value as AppCapability),
  ) ?? [];

  return Array.from(new Set([...defaultCapabilities, ...backendCapabilities]));
};

export const authSessionMapper = {
  toDomain(dto: AuthSessionDto): AuthSession {
    const user = {
      capabilities: toCapabilityList(dto.user.capabilities ?? dto.user.permissions),
      email: dto.user.email,
      id: dto.user.id,
      roles: defaultRoles,
      ...(dto.user.firstName ? { firstName: dto.user.firstName } : {}),
      ...(dto.user.lastName ? { lastName: dto.user.lastName } : {}),
      ...(dto.user.profileImage ? { profileImage: dto.user.profileImage } : {}),
    };

    return {
      accessToken: dto.accessToken,
      user,
      ...(dto.refreshToken ? { refreshToken: dto.refreshToken } : {}),
    };
  },
};
