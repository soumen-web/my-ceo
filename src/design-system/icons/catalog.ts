export const appIcons = {
  profile: 'account-circle-outline',
  security: 'shield-check-outline',
  session: 'account-lock-outline',
} as const;

export type AppIconName = keyof typeof appIcons;
