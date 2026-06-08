import type { ComponentProps, ReactNode } from 'react';
import { Dialog, Portal } from 'react-native-paper';

interface AppDialogProps extends ComponentProps<typeof Dialog> {
  children: ReactNode;
  visible: boolean;
}

export const AppDialog = ({
  children,
  visible,
  ...props
}: AppDialogProps) => (
  <Portal>
    <Dialog visible={visible} {...props}>
      {children}
    </Dialog>
  </Portal>
);
