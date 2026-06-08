export type DashboardIconName =
  | 'briefcase'
  | 'calendar'
  | 'check-circle'
  | 'clipboard'
  | 'clock'
  | 'dollar-sign'
  | 'edit-3'
  | 'file-text'
  | 'map-pin'
  | 'settings'
  | 'users';

export interface DashboardAttendanceMonth {
  absent: number;
  leave: number;
  month: string;
  present: number;
}

export interface DashboardEmployeeSummary {
  avatarUrl: string;
  role: string;
}

export interface DashboardNote {
  body: string;
  id: string;
  title: string;
}

export interface DashboardQuickAction {
  icon: DashboardIconName;
  id: string;
  label: string;
}

export interface DashboardStat {
  icon: DashboardIconName;
  id: string;
  label: string;
  value: string;
}

export interface HomeDashboard {
  attendanceByMonth: DashboardAttendanceMonth[];
  employee: DashboardEmployeeSummary;
  notes: DashboardNote[];
  quickActions: DashboardQuickAction[];
  stats: DashboardStat[];
}

export const createEmptyHomeDashboard = (): HomeDashboard => ({
  attendanceByMonth: [],
  employee: {
    avatarUrl: '',
    role: 'Employee',
  },
  notes: [],
  quickActions: [],
  stats: [],
});
