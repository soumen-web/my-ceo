export type NotificationType =
  | 'Action Required'
  | 'Announcement'
  | 'Error'
  | 'Info'
  | 'Reminder'
  | 'Success'
  | 'Warning';

export type NotificationModule =
  | 'Attendance'
  | 'HR'
  | 'Leave'
  | 'Payroll'
  | 'Query'
  | 'System';

export type NotificationPriority = 'High' | 'Low' | 'Medium';

export type NotificationFilter =
  | 'All'
  | 'Unread'
  | 'HR'
  | 'Attendance'
  | 'Leave'
  | 'Payroll'
  | 'Query';

export interface NotificationItem {
  actionRoute?: NotificationModule;
  createdAt: string;
  id: string;
  isRead: boolean;
  message: string;
  module?: NotificationModule;
  priority?: NotificationPriority;
  title: string;
  type: NotificationType;
}

export interface NotificationSection {
  data: NotificationItem[];
  title: 'Earlier' | 'Today' | 'Yesterday';
}

export const NOTIFICATION_FILTERS: NotificationFilter[] = [
  'All',
  'Unread',
  'HR',
  'Attendance',
  'Leave',
  'Payroll',
  'Query',
];
