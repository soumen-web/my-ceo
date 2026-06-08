import type { NavigatorScreenParams } from '@react-navigation/native';

import type { HrmsSelfServiceSection } from '@/modules/hrms/domain/entities/HrmsSelfService';

export const ROUTES = {
  appDrawer: 'AppDrawer',
  appTabs: 'AppTabs',
  attendance: 'Attendance',
  home: 'Home',
  hrQuery: 'HrQuery',
  leave: 'Leave',
  leaveAnalytics: 'LeaveAnalytics',
  leaveApply: 'LeaveApply',
  leaveDetail: 'LeaveDetail',
  leaveHistory: 'LeaveHistory',
  leaveHome: 'LeaveHome',
  myOrganization: 'MyOrganization',
  myOrganizationOverview: 'MyOrganizationOverview',
  myOrganizationInfo: 'MyOrganizationInfo',
  myReportingManager: 'MyReportingManager',
  myTeam: 'MyTeam',
  myWorkLocation: 'MyWorkLocation',
  myWorkMode: 'MyWorkMode',
  notifications: 'Notifications',
  payroll: 'Payroll',
  payrollDetail: 'PayrollDetail',
  payrollHome: 'PayrollHome',
  profileDetails: 'ProfileDetails',
  signIn: 'SignIn',
  splash: 'Splash',
  tabHome: 'TabHome',
  tabMyDesk: 'TabMyDesk',
  tabProfile: 'TabProfile',
  tabVision: 'TabVision',
  verifyOtp: 'VerifyOtp',
  attendanceAnalytics: 'AttendanceAnalytics',
  attendanceDailyTimeline: 'AttendanceDailyTimeline',
  attendanceDetail: 'AttendanceDetail',
  attendanceHistory: 'AttendanceHistory',
  attendanceHome: 'AttendanceHome',
  workforceHub: 'WorkforceHub',
  workforceHubDetail: 'WorkforceHubDetail',
  workforceHubOverview: 'WorkforceHubOverview',
} as const;

export type AttendanceStackParamList = {
  AttendanceAnalytics: undefined;
  AttendanceDailyTimeline: {
    date?: string;
    returnToDashboard?: boolean;
  };
  AttendanceDetail: undefined;
  AttendanceHistory: undefined;
  AttendanceHome: undefined;
};

export type LeaveStackParamList = {
  LeaveAnalytics: undefined;
  LeaveApply:
    | {
        returnToDashboard?: boolean;
      }
    | undefined;
  LeaveDetail: {
    leaveId: string;
  };
  LeaveHistory: undefined;
  LeaveHome: undefined;
};

export type HrmsStackParamList = {
  WorkforceHubDetail: {
    section: HrmsSelfServiceSection;
  };
  WorkforceHubOverview: undefined;
};

export type MyOrganizationStackParamList = {
  MyOrganizationOverview: undefined;
  MyOrganizationInfo: undefined;
  MyReportingManager: undefined;
  MyTeam: undefined;
  MyWorkLocation: undefined;
  MyWorkMode: undefined;
};

export type PayrollStackParamList = {
  PayrollDetail: {
    cycleId?: string;
    returnToDashboard?: boolean;
  };
  PayrollHome: undefined;
};

export type AppTabParamList = {
  TabHome: undefined;
  TabMyDesk: undefined;
  TabProfile: undefined;
  TabVision: NavigatorScreenParams<HrmsStackParamList> | undefined;
};

export type AppDrawerParamList = {
  AppTabs: NavigatorScreenParams<AppTabParamList> | undefined;
  Attendance: NavigatorScreenParams<AttendanceStackParamList> | undefined;
  Home: undefined;
  HrQuery: undefined;
  Leave: NavigatorScreenParams<LeaveStackParamList> | undefined;
  MyOrganization: NavigatorScreenParams<MyOrganizationStackParamList> | undefined;
  Notifications: undefined;
  Payroll: NavigatorScreenParams<PayrollStackParamList> | undefined;
  ProfileDetails: undefined;
  WorkforceHub: NavigatorScreenParams<HrmsStackParamList> | undefined;
};

export type RootStackParamList = {
  AppDrawer: NavigatorScreenParams<AppDrawerParamList> | undefined;
  SignIn: undefined;
  Splash: undefined;
  VerifyOtp: {
    email: string;
    otp?: string;
  };
};
