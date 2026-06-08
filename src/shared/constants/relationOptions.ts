export const RELATION_OPTIONS = [
  'Spouse',
  'Child',
  'Parent',
  'Sibling',
  'Partner',
  'Friend',
  'Attorney',
  'Other',
] as const;

export type RelationOption = (typeof RELATION_OPTIONS)[number];
