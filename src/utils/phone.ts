export const sanitizePhoneNumberInput = (value: string): string =>
  value.replace(/\D/g, '');
