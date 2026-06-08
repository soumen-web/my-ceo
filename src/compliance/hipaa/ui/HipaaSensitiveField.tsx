import type { ComponentProps } from 'react';

import { MaskedText } from '@compliance/shared/masking/MaskedText';

type MaskedTextProps = ComponentProps<typeof MaskedText>;

export const HipaaSensitiveField = ({
  value,
  ...props
}: Omit<MaskedTextProps, 'classification'>) => (
  <MaskedText classification="PHI" value={value} {...props} />
);
