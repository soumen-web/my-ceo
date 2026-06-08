import { AppText } from '@design-system/components';

interface InlineFeedbackMessageProps {
  message: string;
  tone?: 'default' | 'error' | 'muted';
}

export const InlineFeedbackMessage = ({
  message,
  tone = 'default',
}: InlineFeedbackMessageProps) => (
  <AppText tone={tone} variant="bodyMedium">
    {message}
  </AppText>
);
