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
              TabMyDesk: 'mydesk',
              TabProfile: 'profile',
              TabVision: {
                path: 'vision',
                screens: {
                  WorkforceHubDetail: ':section',
                  WorkforceHubOverview: '',
                },
              },
            },
          },
          WorkforceHub: {
            path: 'dashboard/workforce-hub',
            screens: {
              WorkforceHubDetail: ':section',
              WorkforceHubOverview: '',
            },
          },
          Home: 'home',
          HrQuery: 'dashboard/hr-query',
          Leave: {
            path: 'dashboard/leave',
            screens: {
              LeaveAnalytics: 'analytics',
              LeaveApply: 'apply',
              LeaveDetail: 'detail/:leaveId',
              LeaveHistory: 'history',
              LeaveHome: '',
            },
          },
          Payroll: {
            path: 'dashboard/payroll',
            screens: {
              PayrollDetail: 'cycle/:cycleId',
              PayrollHome: '',
            },
          },
          MyOrganization: {
            path: 'dashboard/my-organization',
            screens: {
              MyOrganizationOverview: '',
              MyOrganizationInfo: 'info',
              MyReportingManager: 'reporting-manager',
              MyTeam: 'team',
              MyWorkLocation: 'work-location',
              MyWorkMode: 'work-mode',
            },
          },
          Notifications: 'dashboard/notifications',
          ProfileDetails: 'profile',
        },
      },
      SignIn: 'sign-in',
      Splash: 'splash',
      VerifyOtp: 'verify-otp',
    },
  },
  prefixes: ['myceo://'],
};
