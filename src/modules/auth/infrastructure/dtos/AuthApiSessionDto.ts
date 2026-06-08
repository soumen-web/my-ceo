export interface AuthApiUserResponseDto {
  _id?: string;
  accountType?: string | null;
  account_type?: string | null;
  capabilities?: string[] | null;
  createdAt?: string | null;
  created_at?: string | null;
  dataClassification?: string | null;
  data_classification?: string | null;
  displayName?: string;
  display_name?: string;
  email?: string;
  firstName?: string;
  first_name?: string;
  fullName?: string;
  full_name?: string;
  id?: string;
  isEmailVerified?: boolean | null;
  is_email_verified?: boolean | null;
  isVerified?: boolean | null;
  is_verified?: boolean | null;
  lastAuthenticatedAt?: string | null;
  last_authenticated_at?: string | null;
  lastLoginPlatform?: string | null;
  last_login_platform?: string | null;
  lastName?: string;
  last_name?: string;
  messages?: unknown[] | null;
  profileImage?: string | null;
  profile_image?: string | null;
  permissions?: string[] | null;
  role?: {
    _id?: string | null;
    role?: string | null;
    roleDisplayName?: string | null;
  } | null;
  status?: string | null;
  subjectRef?: string | null;
  subject_ref?: string | null;
  tenantId?: string | null;
  tenant_id?: string | null;
  updatedAt?: string | null;
  updated_at?: string | null;
  userName?: string | null;
  user_name?: string | null;
}

export interface AuthApiSessionDataDto {
  access_token?: string;
  accessToken?: string;
  capabilities?: string[] | null;
  expires_at?: string;
  expiresIn?: number;
  expires_in?: number;
  isVerified?: boolean | null;
  is_verified?: boolean | null;
  profile?: AuthApiUserResponseDto;
  permissions?: string[] | null;
  refresh_expires_at?: string;
  refresh_token?: string;
  refreshToken?: string;
  token_type?: string;
  user?: AuthApiUserResponseDto;
}

export interface AuthApiSessionResponseDto extends AuthApiSessionDataDto {
  correlationId?: string;
  data?: AuthApiSessionDataDto;
  message?: string;
  success?: boolean;
  statusCode?: number;
  timestamp?: string;
}
