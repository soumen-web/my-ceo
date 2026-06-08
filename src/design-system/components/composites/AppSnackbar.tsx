import type { ComponentProps } from 'react';
import { Snackbar } from 'react-native-paper';

export type AppSnackbarProps = ComponentProps<typeof Snackbar>;

export const AppSnackbar = (props: AppSnackbarProps) => <Snackbar {...props} />;
