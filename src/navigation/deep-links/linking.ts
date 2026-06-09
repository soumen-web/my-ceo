import type { LinkingOptions } from '@react-navigation/native';

import type { RootStackParamList } from '@/navigation/route-types';

export const linkingConfig: LinkingOptions<RootStackParamList> = {
  config: {
    screens: {
      AppDrawer: {
        screens: {
          AppTabs: {
            path: 'tabs',
            screens: {
              TabHome: 'home',
              TabMyDesk: {
                path: 'mydesk',
                screens: {
                  Attendance: {
                    path: 'attendance',
                    screens: {
                      AttendanceAnalytics: 'analytics',
                      AttendanceDailyTimeline: 'daily',
                      AttendanceDetail: 'detail',
                      AttendanceHistory: 'history',
                      AttendanceHome: '',
                    },
                  },
                  HrQuery: 'hr-query',
                  Leave: {
                    path: 'leave',
                    screens: {
                      LeaveAnalytics: 'analytics',
                      LeaveApply: 'apply',
                      LeaveDetail: 'detail/:leaveId',
                      LeaveHistory: 'history',
                      LeaveHome: '',
                    },
                  },
                  MyDeskHome: '',
                  MyOrganization: {
                    path: 'my-organization',
                    screens: {
                      MyOrganizationInfo: 'info',
                      MyOrganizationOverview: '',
                      MyReportingManager: 'reporting-manager',
                      MyTeam: 'team',
                      MyWorkLocation: 'work-location',
                      MyWorkMode: 'work-mode',
                    },
                  },
                  Notifications: 'notifications',
                  Payroll: {
                    path: 'payroll',
                    screens: {
                      PayrollDetail: 'cycle/:cycleId',
                      PayrollHome: '',
                    },
                  },
                  WorkforceHub: {
                    path: 'workforce-hub',
                    screens: {
                      WorkforceHubDetail: ':section',
                      WorkforceHubOverview: '',
                    },
                  },
                },
              },
              TabProfile: 'profile',
              TabWexa: 'wexa',
            },
          },
        },
      },
      SignIn: 'sign-in',
      Splash: 'splash',
      VerifyOtp: 'verify-otp',
    },
  },
  prefixes: ['myceo://'],
};
