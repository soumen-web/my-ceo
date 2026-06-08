import type { AuthenticatedUser } from '@modules/auth/domain/entities/AuthSession';
import type { AuthenticatedUserViewModel } from '@modules/auth/presentation/view-models/AuthenticatedUserViewModel';

export const toAuthenticatedUserViewModel = (
  user: AuthenticatedUser | null,
): AuthenticatedUserViewModel | null => {
  if (!user) {
    return null;
  }

  const displayName =
    [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email;

  return {
    displayName,
    email: user.email,
    id: user.id,
  };
};
