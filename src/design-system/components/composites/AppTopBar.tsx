import type { ReactNode } from 'react';
import { Appbar } from 'react-native-paper';

interface AppTopBarProps {
  actions?: ReactNode;
  title: string;
}

export const AppTopBar = ({ actions, title }: AppTopBarProps) => (
  <Appbar.Header>
    <Appbar.Content title={title} />
    {actions}
  </Appbar.Header>
);
