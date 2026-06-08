import { useCallback, useMemo, useState } from 'react';

import type {
  NotificationFilter,
  NotificationItem,
  NotificationSection,
} from '../../domain/entities/Notification';
import { createMockNotifications } from '../../infrastructure/mock/notificationMockData';

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const sectionTitleFor = (createdAt: string): NotificationSection['title'] => {
  const now = startOfDay(new Date());
  const date = startOfDay(new Date(createdAt));
  const daysAgo = Math.round((now.getTime() - date.getTime()) / 86400000);

  if (daysAgo <= 0) {
    return 'Today';
  }

  if (daysAgo === 1) {
    return 'Yesterday';
  }

  return 'Earlier';
};

const matchesFilter = (notification: NotificationItem, filter: NotificationFilter) => {
  if (filter === 'All') {
    return true;
  }

  if (filter === 'Unread') {
    return !notification.isRead;
  }

  if (filter === 'HR') {
    return notification.module === 'HR' || notification.module === 'System';
  }

  return notification.module === filter;
};

export const useNotificationsScreenModel = () => {
  const [notifications, setNotifications] = useState(createMockNotifications);
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>('All');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<'failed' | 'loading' | 'ready'>('ready');

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.isRead).length,
    [notifications],
  );

  const filteredNotifications = useMemo(
    () =>
      notifications
        .filter((notification) => matchesFilter(notification, activeFilter))
        .sort(
          (left, right) =>
            new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
        ),
    [activeFilter, notifications],
  );

  const sections = useMemo<NotificationSection[]>(() => {
    const groups: Record<NotificationSection['title'], NotificationItem[]> = {
      Earlier: [],
      Today: [],
      Yesterday: [],
    };

    filteredNotifications.forEach((notification) => {
      groups[sectionTitleFor(notification.createdAt)].push(notification);
    });

    return (['Today', 'Yesterday', 'Earlier'] as const)
      .map((title) => ({ data: groups[title], title }))
      .filter((section) => section.data.length);
  }, [filteredNotifications]);

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === notificationId ? { ...notification, isRead: true } : notification,
      ),
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((current) =>
      current.map((notification) => ({ ...notification, isRead: true })),
    );
  }, []);

  const refresh = useCallback(() => {
    setIsRefreshing(true);
    setErrorMessage(null);
    setStatus('ready');
    setTimeout(() => {
      setNotifications(createMockNotifications());
      setIsRefreshing(false);
    }, 400);
  }, []);

  const retry = useCallback(() => {
    setErrorMessage(null);
    setStatus('loading');
    setTimeout(() => {
      setStatus('ready');
      setNotifications(createMockNotifications());
    }, 300);
  }, []);

  return {
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
  };
};
