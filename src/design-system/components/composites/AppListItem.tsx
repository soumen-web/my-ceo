import type { ComponentProps } from 'react';
import { List } from 'react-native-paper';

import { AppIcon, type AppIconName } from '@design-system/icons';
import { ACCESSIBILITY } from '@shared/constants/accessibility';

type BaseListItemProps = ComponentProps<typeof List.Item>;

export interface AppListItemProps extends BaseListItemProps {
  leadingIcon?: AppIconName;
}

export const AppListItem = ({
  descriptionMaxFontSizeMultiplier = ACCESSIBILITY.maxFontSizeMultiplier,
  leadingIcon,
  left,
  titleMaxFontSizeMultiplier = ACCESSIBILITY.maxFontSizeMultiplier,
  ...props
}: AppListItemProps) => {
  const resolvedLeft = leadingIcon
    ? ({ color, style }: { color: string; style: BaseListItemProps['style'] }) => (
        <AppIcon
          color={color}
          name={leadingIcon}
          size={24}
          style={style}
        />
      )
    : left;

  return (
    <List.Item
      descriptionMaxFontSizeMultiplier={descriptionMaxFontSizeMultiplier}
      titleMaxFontSizeMultiplier={titleMaxFontSizeMultiplier}
      {...(resolvedLeft ? { left: resolvedLeft } : {})}
      {...props}
    />
  );
};
