import { Feather } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppFonts } from '@/assets/fonts';
import { EnterpriseFeedbackBanner, PremiumSkeleton } from '@/design-system/components';
import { reactNativeColorScheme } from '@/design-system/tokens/colors';
import { fontSize, radius, spacing } from '@/utils/scale';

import type {
  NotificationFilter,
  NotificationItem,
  NotificationModule,
  NotificationPriority,
  NotificationSection,
  NotificationType,
} from '../../domain/entities/Notification';
import { NOTIFICATION_FILTERS } from '../../domain/entities/Notification';

const moduleColors = reactNativeColorScheme.ultiHuman.module;
const surface = reactNativeColorScheme.ultiHuman.surface;

const typeConfig: Record<
  NotificationType,
  { icon: keyof typeof Feather.glyphMap; tone: 'danger' | 'info' | 'neutral' | 'success' | 'warning' }
> = {
  'Action Required': { icon: 'alert-circle', tone: 'warning' },
  Announcement: { icon: 'radio', tone: 'info' },
  Error: { icon: 'x-circle', tone: 'danger' },
  Info: { icon: 'info', tone: 'info' },
  Reminder: { icon: 'clock', tone: 'warning' },
  Success: { icon: 'check-circle', tone: 'success' },
  Warning: { icon: 'alert-triangle', tone: 'warning' },
};

const toneColor = (tone: 'danger' | 'info' | 'neutral' | 'success' | 'warning') => {
  if (tone === 'danger') {
    return reactNativeColorScheme.status.danger;
  }

  if (tone === 'success') {
    return reactNativeColorScheme.status.success;
  }

  if (tone === 'warning') {
    return reactNativeColorScheme.status.warning;
  }

  if (tone === 'info') {
    return reactNativeColorScheme.status.info;
  }

  return reactNativeColorScheme.status.neutral;
};

const priorityTone = (priority?: NotificationPriority) => {
  if (priority === 'High') {
    return reactNativeColorScheme.status.warning;
  }

  if (priority === 'Medium') {
    return reactNativeColorScheme.status.info;
  }

  return reactNativeColorScheme.status.neutral;
};

export const formatNotificationTime = (createdAt: string): string => {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return createdAt;
  }

  return new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const NotificationHeader = ({
  onMarkAllAsRead,
  unreadCount,
}: {
  onMarkAllAsRead: () => void;
  unreadCount: number;
}) => (
  <View style={styles.headerCard}>
    <View style={styles.headerCopy}>
      <Text style={styles.routeLabel}>Communication center</Text>
      <Text style={styles.pageTitle}>Notifications</Text>
      <Text style={styles.headerMeta}>
        {unreadCount ? `${unreadCount} unread update${unreadCount === 1 ? '' : 's'}` : 'All caught up'}
      </Text>
    </View>
    <Pressable
      accessibilityLabel="Mark all notifications as read"
      accessibilityRole="button"
      disabled={!unreadCount}
      onPress={onMarkAllAsRead}
      style={({ pressed }) => [
        styles.markAllButton,
        !unreadCount ? styles.markAllButtonDisabled : undefined,
        pressed ? styles.pressed : undefined,
      ]}
    >
      <Feather
        color={unreadCount ? moduleColors.selectedText : reactNativeColorScheme.text.disabled}
        name="check-circle"
        size={spacing(15)}
      />
      <Text style={[styles.markAllText, !unreadCount ? styles.markAllTextDisabled : undefined]}>
        Mark all
      </Text>
    </Pressable>
  </View>
);

export const NotificationFilterChips = ({
  activeFilter,
  onChange,
}: {
  activeFilter: NotificationFilter;
  onChange: (filter: NotificationFilter) => void;
}) => (
  <View style={styles.filterWrap}>
    {NOTIFICATION_FILTERS.map((filter) => (
      <Pressable
        accessibilityLabel={`Show ${filter} notifications`}
        accessibilityRole="button"
        key={filter}
        onPress={() => onChange(filter)}
        style={({ pressed }) => [
          styles.filterChip,
          activeFilter === filter ? styles.filterChipActive : undefined,
          pressed ? styles.pressed : undefined,
        ]}
      >
        <Text
          style={[
            styles.filterText,
            activeFilter === filter ? styles.filterTextActive : undefined,
          ]}
        >
          {filter}
        </Text>
      </Pressable>
    ))}
  </View>
);

export const NotificationSectionHeader = ({
  section,
}: {
  section: NotificationSection;
}) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{section.title}</Text>
    <Text style={styles.sectionCount}>{section.data.length}</Text>
  </View>
);

export const NotificationCard = ({
  notification,
  onMarkAsRead,
  onOpen,
}: {
  notification: NotificationItem;
  onMarkAsRead: (notification: NotificationItem) => void;
  onOpen: (notification: NotificationItem) => void;
}) => {
  const config = typeConfig[notification.type];
  const tone = toneColor(config.tone);

  return (
    <Pressable
      accessibilityLabel={`${notification.title}. ${notification.isRead ? 'Read' : 'Unread'}`}
      accessibilityRole="button"
      onPress={() => onMarkAsRead(notification)}
      style={({ pressed }) => [
        styles.card,
        notification.isRead ? styles.cardRead : styles.cardUnread,
        pressed ? styles.pressed : undefined,
      ]}
    >
      {!notification.isRead ? <View style={styles.unreadAccent} /> : null}
      <View style={[styles.typeIcon, { backgroundColor: tone.background, borderColor: tone.border }]}>
        <Feather color={tone.foreground} name={config.icon} size={spacing(18)} />
      </View>
      <View style={styles.cardBody}>
        <View style={styles.cardTop}>
          <View style={styles.titleWrap}>
            <Text numberOfLines={1} style={styles.cardTitle}>
              {notification.title}
            </Text>
            <Text numberOfLines={1} style={styles.moduleLabel}>
              {notification.module ?? 'System'} update
            </Text>
          </View>
          <View style={styles.timeWrap}>
            <Text numberOfLines={1} style={styles.timeText}>
              {formatNotificationTime(notification.createdAt)}
            </Text>
            {!notification.isRead ? <View style={styles.unreadDot} /> : null}
          </View>
        </View>
        <Text numberOfLines={2} style={styles.messageText}>
          {notification.message}
        </Text>
        <View style={styles.badgeRow}>
          <NotificationBadge label={notification.type} tone={tone} />
          {notification.priority ? (
            <NotificationBadge
              label={`${notification.priority} priority`}
              tone={priorityTone(notification.priority)}
            />
          ) : null}
          {notification.actionRoute ? (
            <Pressable
              accessibilityLabel={`Open related ${notification.actionRoute} module`}
              accessibilityRole="button"
              onPress={() => onOpen(notification)}
              style={({ pressed }) => [
                styles.openButton,
                pressed ? styles.pressed : undefined,
              ]}
            >
              <Text style={styles.openButtonText}>Open</Text>
              <Feather color={moduleColors.icon} name="arrow-up-right" size={spacing(13)} />
            </Pressable>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
};

export const NotificationBadge = ({
  label,
  tone,
}: {
  label: string;
  tone: { background: string; border: string; foreground: string };
}) => (
  <View style={[styles.badge, { backgroundColor: tone.background, borderColor: tone.border }]}>
    <Text numberOfLines={1} style={[styles.badgeText, { color: tone.foreground }]}>
      {label}
    </Text>
  </View>
);

export const NotificationSkeletonCard = () => (
  <View style={styles.skeletonCard}>
    <PremiumSkeleton style={styles.skeletonIcon} />
    <View style={styles.skeletonBody}>
      <PremiumSkeleton style={styles.skeletonLineLong} />
      <PremiumSkeleton style={styles.skeletonLine} />
      <PremiumSkeleton style={styles.skeletonLineShort} />
    </View>
  </View>
);

export const NotificationEmptyState = () => (
  <EnterpriseFeedbackBanner
    message="New HR, payroll, leave, and attendance updates will appear here."
    title="No notifications"
    tone="empty"
  />
);

export const NotificationErrorState = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) => (
  <View style={styles.errorWrap}>
    <EnterpriseFeedbackBanner message={message} title="Could not load notifications" tone="error" />
    <Pressable
      accessibilityLabel="Retry loading notifications"
      accessibilityRole="button"
      onPress={onRetry}
      style={({ pressed }) => [styles.retryButton, pressed ? styles.pressed : undefined]}
    >
      <Text style={styles.retryText}>Retry</Text>
    </Pressable>
  </View>
);

export const NotificationListHeader = ({ children }: { children: ReactNode }) => (
  <View style={styles.listHeader}>{children}</View>
);

const moduleLabelColor = (_module?: NotificationModule) => reactNativeColorScheme.text.secondary;

const styles = StyleSheet.create({
  badge: {
    borderRadius: radius(8),
    borderWidth: 1,
    maxWidth: spacing(128),
    paddingHorizontal: spacing(8),
    paddingVertical: spacing(5),
  },
  badgeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing(7),
  },
  badgeText: {
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(10),
    lineHeight: spacing(14),
  },
  card: {
    alignItems: 'flex-start',
    borderRadius: radius(8),
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing(12),
    overflow: 'hidden',
    padding: spacing(14),
    shadowColor: surface.cardShadow,
    shadowOffset: { height: spacing(8), width: 0 },
    shadowOpacity: 0.16,
    shadowRadius: spacing(14),
  },
  cardBody: {
    flex: 1,
    gap: spacing(9),
    minWidth: 0,
  },
  cardRead: {
    backgroundColor: surface.glassSoft,
    borderColor: surface.aquaBorderMuted,
  },
  cardTitle: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(14),
    lineHeight: spacing(19),
  },
  cardTop: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing(10),
  },
  cardUnread: {
    backgroundColor: surface.glassPanel,
    borderColor: moduleColors.borderStrong,
  },
  errorWrap: {
    gap: spacing(10),
  },
  filterChip: {
    backgroundColor: surface.glassSoft,
    borderColor: surface.aquaBorderMuted,
    borderRadius: radius(8),
    borderWidth: 1,
    paddingHorizontal: spacing(11),
    paddingVertical: spacing(8),
  },
  filterChipActive: {
    backgroundColor: moduleColors.accentSoft,
    borderColor: moduleColors.accent,
  },
  filterText: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(12),
    lineHeight: spacing(16),
  },
  filterTextActive: {
    color: reactNativeColorScheme.ultiHuman.text,
  },
  filterWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing(8),
  },
  headerCard: {
    alignItems: 'flex-start',
    backgroundColor: surface.glassPanel,
    borderColor: surface.aquaBorderMuted,
    borderRadius: radius(8),
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing(12),
    padding: spacing(16),
  },
  headerCopy: {
    flex: 1,
    gap: spacing(4),
    minWidth: 0,
  },
  headerMeta: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(12),
    lineHeight: spacing(16),
  },
  listHeader: {
    gap: spacing(12),
  },
  markAllButton: {
    alignItems: 'center',
    backgroundColor: moduleColors.accent,
    borderRadius: radius(8),
    flexDirection: 'row',
    gap: spacing(6),
    minHeight: spacing(38),
    paddingHorizontal: spacing(10),
  },
  markAllButtonDisabled: {
    backgroundColor: surface.glassAction,
  },
  markAllText: {
    color: moduleColors.selectedText,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(12),
    lineHeight: spacing(16),
  },
  markAllTextDisabled: {
    color: reactNativeColorScheme.text.disabled,
  },
  messageText: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansMedium,
    fontSize: fontSize(12),
    lineHeight: spacing(17),
  },
  moduleLabel: {
    color: moduleLabelColor(),
    fontFamily: AppFonts.googleSansMedium,
    fontSize: fontSize(11),
    lineHeight: spacing(15),
  },
  openButton: {
    alignItems: 'center',
    backgroundColor: moduleColors.accentWash,
    borderColor: moduleColors.border,
    borderRadius: radius(8),
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing(4),
    paddingHorizontal: spacing(8),
    paddingVertical: spacing(5),
  },
  openButtonText: {
    color: moduleColors.icon,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(10),
    lineHeight: spacing(14),
  },
  pageTitle: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(23),
    lineHeight: spacing(29),
  },
  pressed: {
    opacity: 0.74,
  },
  retryButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: moduleColors.accent,
    borderRadius: radius(8),
    minHeight: spacing(40),
    paddingHorizontal: spacing(16),
    justifyContent: 'center',
  },
  retryText: {
    color: moduleColors.selectedText,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(12),
    lineHeight: spacing(16),
  },
  routeLabel: {
    color: moduleColors.accentPressed,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(12),
    lineHeight: spacing(16),
    textTransform: 'uppercase',
  },
  sectionCount: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(11),
    lineHeight: spacing(15),
  },
  sectionHeader: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: spacing(4),
    paddingTop: spacing(6),
  },
  sectionTitle: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(13),
    lineHeight: spacing(18),
    textTransform: 'uppercase',
  },
  skeletonBody: {
    flex: 1,
    gap: spacing(8),
  },
  skeletonCard: {
    alignItems: 'center',
    backgroundColor: surface.glassPanel,
    borderColor: surface.aquaBorderMuted,
    borderRadius: radius(8),
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing(12),
    minHeight: spacing(112),
    padding: spacing(14),
  },
  skeletonIcon: {
    backgroundColor: moduleColors.iconSurface,
    borderRadius: radius(8),
    height: spacing(42),
    width: spacing(42),
  },
  skeletonLine: {
    backgroundColor: surface.glassAction,
    borderRadius: radius(8),
    height: spacing(14),
    width: '86%',
  },
  skeletonLineLong: {
    backgroundColor: surface.glassAction,
    borderRadius: radius(8),
    height: spacing(16),
    width: '96%',
  },
  skeletonLineShort: {
    backgroundColor: surface.glassAction,
    borderRadius: radius(8),
    height: spacing(12),
    width: '48%',
  },
  timeText: {
    color: reactNativeColorScheme.text.muted,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(11),
    lineHeight: spacing(15),
    textAlign: 'right',
  },
  timeWrap: {
    alignItems: 'flex-end',
    gap: spacing(6),
    width: spacing(76),
  },
  titleWrap: {
    flex: 1,
    gap: spacing(2),
    minWidth: 0,
  },
  typeIcon: {
    alignItems: 'center',
    borderRadius: radius(8),
    borderWidth: 1,
    height: spacing(42),
    justifyContent: 'center',
    width: spacing(42),
  },
  unreadAccent: {
    backgroundColor: moduleColors.accent,
    bottom: 0,
    left: 0,
    position: 'absolute',
    top: 0,
    width: spacing(3),
  },
  unreadDot: {
    backgroundColor: moduleColors.accent,
    borderRadius: radius(4),
    height: spacing(8),
    width: spacing(8),
  },
});
