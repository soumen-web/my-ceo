export type AppRole = 'admin' | 'member';

export type AppCapability =
  | 'auth:access'
  | 'employee:view:org'
  | 'home:view'
  | 'profile:view';
