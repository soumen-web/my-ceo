import type { DrawerScreenProps } from '@react-navigation/drawer';
import {
  RefreshControl,
  SectionList,
  StyleSheet,
  type SectionListRenderItem,
} from 'react-native';

import { MobileScreenShell } from '@/design-system/patterns/MobileScreenShell';
import { reactNativeColorScheme } from '@/design-system/tokens/colors';
import { toAuthenticatedUserViewModel, useAuthSession } from '@/modules/auth';
import type {
  NotificationItem,
  NotificationSection,
} from '@/modules/notifications/domain/entities/Notification';
import { DashboardShellHeader } from '@/modules/home/presentation/components/DashboardShellHeader';
import type { AppDrawerParamList } from '@/navigation/route-types';
import { ROUTES } from '@/navigation/route-types';
import { spacing } from '@/utils/scale';

import {
  NotificationCard,
  NotificationEmptyState,
  NotificationErrorState,
  NotificationFilterChips,
  NotificationHeader,
  NotificationListHeader,
  NotificationSectionHeader,
  NotificationSkeletonCard,
} from '../components/NotificationComponents';
import { useNotificationsScreenModel } from '../hooks/useNotificationsScreenModel';

type NotificationsScreenProps = DrawerScreenProps<AppDrawerParamList, 'Notifications'>;

const initialsFrom = (value: string | undefined): string => {
  const parts = value?.trim().split(/\s+/).filter(Boolean) ?? [];

  return parts.length
    ? parts.slice(0, 2).map((part) => part[0]).join('').toUpperCase()
    : 'U';
};

export const NotificationsScreen = ({ navigation }: NotificationsScreenProps) => {
  const { user } = useAuthSession();
  const userViewModel = toAuthenticatedUserViewModel(user);
  const displayName = userViewModel?.displayName ?? 'Employee';
  const {
    activeFilter,
    errorMessage,
    isRefreshing,
    markAllAsRead,
    markAsRead,
    refresh,
    retry,
    sections,
    setActiveFilter,
    status,
    unreadCount,
  } = useNotificationsScreenModel();

  const openAction = (notification: NotificationItem) => {
    markAsRead(notification.id);

    if (notification.actionRoute === 'Payroll') {
      navigation.navigate(ROUTES.payroll, { screen: ROUTES.payrollHome });
      return;
    }

    if (notification.actionRoute === 'Leave') {
      navigation.navigate(ROUTES.leave, { screen: ROUTES.leaveHome });
      return;
    }

    if (notification.actionRoute === 'Attendance') {
      navigation.navigate(ROUTES.attendance, { screen: ROUTES.attendanceHome });
      return;
    }

    if (notification.actionRoute === 'Query') {
      navigation.navigate(ROUTES.hrQuery);
    }
  };

  const renderNotification: SectionListRenderItem<NotificationItem, NotificationSection> = ({
    item,
  }) => (
    <NotificationCard
      notification={item}
      onMarkAsRead={(notification) => markAsRead(notification.id)}
      onOpen={openAction}
    />
  );

  return (
    <MobileScreenShell
      header={
        <DashboardShellHeader
          initials={initialsFrom(displayName)}
          onMenuPress={() => navigation.openDrawer()}
          onProfilePress={() => navigation.navigate(ROUTES.profileDetails)}
          subtitle=""
          title={displayName}
        />
      }
      scrollEnabled={false}
    >
      <SectionList
        ListEmptyComponent={
          status === 'loading' ? (
            <>
              <NotificationSkeletonCard />
              <NotificationSkeletonCard />
              <NotificationSkeletonCard />
            </>
          ) : errorMessage ? (
            <NotificationErrorState message={errorMessage} onRetry={retry} />
          ) : (
            <NotificationEmptyState />
          )
        }
        ListHeaderComponent={
          <NotificationListHeader>
            <NotificationHeader
              onMarkAllAsRead={markAllAsRead}
              unreadCount={unreadCount}
            />
            <NotificationFilterChips
              activeFilter={activeFilter}
              onChange={setActiveFilter}
            />
          </NotificationListHeader>
        }
        contentContainerStyle={styles.listContent}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            colors={[reactNativeColorScheme.ultiHuman.accent]}
            onRefresh={refresh}
            refreshing={isRefreshing}
            tintColor={reactNativeColorScheme.ultiHuman.accent}
          />
        }
        renderItem={renderNotification}
        renderSectionHeader={({ section }) => (
          <NotificationSectionHeader section={section} />
        )}
        sections={sections}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled
      />
    </MobileScreenShell>
  );
};

const styles = StyleSheet.create({
  listContent: {
    gap: spacing(10),
    paddingBottom: spacing(40),
  },
});
