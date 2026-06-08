interface AuthenticatedUserRoleDto {
  _id?: string;
  role?: string;
  roleDisplayName?: string;
}

interface AuthenticatedUserDto {
  accountType?: string;
  capabilities?: string[];
  createdAt?: string;
  email: string;
  firstName?: string;
  fullName?: string;
  id: string;
  isEmailVerified?: boolean;
  lastName?: string;
  messages?: unknown[];
  profileImage?: string;
  permissions?: string[];
  role?: AuthenticatedUserRoleDto;
  status?: string;
  userName?: string;
}

export interface AuthSessionDto {
  accessToken: string;
  refreshToken?: string;
  user: AuthenticatedUserDto;
}
