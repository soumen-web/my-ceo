import type { DrawerScreenProps } from '@react-navigation/drawer';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { StackActions } from '@react-navigation/native';
import { useEffect, useMemo } from 'react';

import { MobileScreenShell } from '@/design-system/patterns/MobileScreenShell';
import { ROUTES, type AppDrawerParamList, type AppTabParamList } from '@/navigation/route-types';
import { getDrawerNavigation } from '@/navigation/utils/drawerNavigation';
import { selectIsAuthenticated } from '@/store/slices/authSlice';
import { useAppSelector } from '@/store/hooks';
import { useScreenTelemetry } from '@services/observability/performance/useScreenTelemetry';
import { observabilityEvents } from '@services/observability/events';

import { DashboardFeedbackCard } from '../components/DashboardFeedbackCard';
import { DashboardInsightList } from '../components/DashboardInsightList';
import { DashboardQuickActionList } from '../components/DashboardQuickActionList';
import { DashboardScreenIntro } from '../components/DashboardScreenIntro';
import { DashboardSection } from '../components/DashboardSection';
import { DashboardShellHeader } from '../components/DashboardShellHeader';
import { DashboardStatGrid } from '../components/DashboardStatGrid';
import { MonthlyAttendanceChart } from '../components/MonthlyAttendanceChart';
import { useHomeScreenModel } from '../hooks/useHomeScreenModel';
import type { DashboardQuickAction } from '../../domain/entities/HomeDashboard';

type HomeScreenProps =
  | DrawerScreenProps<AppDrawerParamList, 'Home'>
  | BottomTabScreenProps<AppTabParamList, 'TabHome'>;

const getInitials = (value: string | undefined): string => {
  const nameParts = value?.trim().split(/\s+/).filter(Boolean) ?? [];
  const initials = nameParts.slice(0, 2).map((part) => part[0]).join('');

  return initials ? initials.toUpperCase() : 'U';
};

const isRoutableQuickAction = (action: DashboardQuickAction): boolean =>
  action.id === 'daily-attendance' ||
  action.id === 'apply-leave' ||
  action.id === 'current-salary-slip';

export const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const drawerNavigation = getDrawerNavigation(navigation);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { dashboard, errorMessage, isRefreshing, refreshDashboard, status, user } =
    useHomeScreenModel();
  const displayName = user?.displayName ?? 'Employee';
  const initials = useMemo(() => getInitials(displayName), [displayName]);
  const chartData = useMemo(
    () => dashboard.attendanceByMonth,
    [dashboard.attendanceByMonth],
  );
  const quickActions = useMemo(
    () => dashboard.quickActions.filter(isRoutableQuickAction),
    [dashboard.quickActions],
  );

  useScreenTelemetry('Home', observabilityEvents.screenHomeViewed);

  useEffect(() => {
    if (!isAuthenticated) {
      drawerNavigation?.getParent()?.dispatch(StackActions.replace(ROUTES.signIn));
    }
  }, [drawerNavigation, isAuthenticated]);

  const handleQuickActionPress = (action: DashboardQuickAction) => {
    if (action.id === 'daily-attendance') {
      drawerNavigation?.navigate(ROUTES.appTabs, {
        params: {
          params: {
            params: { returnToDashboard: true },
            screen: ROUTES.attendanceDailyTimeline,
          },
          screen: ROUTES.attendance,
        },
        screen: ROUTES.tabMyDesk,
      });
      return;
    }

    if (action.id === 'apply-leave') {
      drawerNavigation?.navigate(ROUTES.appTabs, {
        params: {
          params: { params: { returnToDashboard: true }, screen: ROUTES.leaveApply },
          screen: ROUTES.leave,
        },
        screen: ROUTES.tabMyDesk,
      });
      return;
    }

    if (action.id === 'current-salary-slip') {
      drawerNavigation?.navigate(ROUTES.appTabs, {
        params: {
          params: { params: { returnToDashboard: true }, screen: ROUTES.payrollDetail },
          screen: ROUTES.payroll,
        },
        screen: ROUTES.tabMyDesk,
      });
    }
  };

  return (
    <MobileScreenShell
      header={
        <DashboardShellHeader
          initials={initials}
          onNotificationPress={() =>
            drawerNavigation?.navigate(ROUTES.appTabs, {
              params: { screen: ROUTES.notifications },
              screen: ROUTES.tabMyDesk,
            })
          }
          subtitle=""
          title={`Hello ${displayName}`}
        />
      }
      onRefresh={refreshDashboard}
      refreshing={isRefreshing}
    >
      <DashboardScreenIntro
        displayName={displayName}
        role={dashboard.employee.role}
      />

      <DashboardStatGrid stats={dashboard.stats} />

      <MonthlyAttendanceChart data={chartData} />

      <DashboardSection title="Quick Actions">
        <DashboardQuickActionList
          actions={quickActions}
          onActionPress={handleQuickActionPress}
        />
      </DashboardSection>

      <DashboardSection title="Updates">
        {status === 'loading' ? (
          <DashboardFeedbackCard message="Refreshing your workspace..." tone="loading" />
        ) : errorMessage ? (
          <DashboardFeedbackCard message={errorMessage} tone="error" />
        ) : dashboard.notes.length ? (
          <DashboardInsightList notes={dashboard.notes} />
        ) : (
          <DashboardFeedbackCard message="No updates yet." />
        )}
      </DashboardSection>
    </MobileScreenShell>
  );
};
