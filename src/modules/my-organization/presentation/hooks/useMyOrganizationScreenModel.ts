import { useCallback, useEffect, useMemo } from 'react';

import { ROUTES, type MyOrganizationStackParamList } from '@/navigation/route-types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  loadMyOrganizationRequested,
  selectMyTeam,
  selectMyTeamErrorMessage,
  selectMyTeamStatus,
  selectOrganizationInfo,
  selectOrganizationInfoErrorMessage,
  selectOrganizationInfoStatus,
  selectReportingManager,
  selectReportingManagerErrorMessage,
  selectReportingManagerStatus,
  selectWorkLocation,
  selectWorkLocationErrorMessage,
  selectWorkLocationStatus,
  selectWorkMode,
  selectWorkModeErrorMessage,
  selectWorkModeStatus,
} from '@/store/slices/myOrganizationSlice';

import { toOrganizationInfoViewModel } from '../mappers/toOrganizationInfoViewModel';
import { toReportingManagerViewModel } from '../mappers/toReportingManagerViewModel';
import { toTeamViewModel } from '../mappers/toTeamViewModel';
import { toWorkLocationViewModel } from '../mappers/toWorkLocationViewModel';
import { toWorkModeViewModel } from '../mappers/toWorkModeViewModel';

type OrganizationStatus = 'failed' | 'idle' | 'loading' | 'ready';

export interface MyOrganizationOverviewItem {
  eyebrow: string;
  route: keyof MyOrganizationStackParamList;
  subtitle: string;
  title: string;
  value: string;
}

const firstMeaningfulValue = (rows: { value: string }[]): string =>
  rows.find((row) => row.value && row.value !== 'Not assigned')?.value ?? 'View details';

const isLoading = (statuses: OrganizationStatus[]) =>
  statuses.some((status) => status === 'loading');

export const useMyOrganizationScreenModel = () => {
  const dispatch = useAppDispatch();
  const organizationInfo = useAppSelector(selectOrganizationInfo);
  const organizationInfoStatus = useAppSelector(selectOrganizationInfoStatus);
  const organizationInfoErrorMessage = useAppSelector(selectOrganizationInfoErrorMessage);
  const reportingManager = useAppSelector(selectReportingManager);
  const reportingManagerStatus = useAppSelector(selectReportingManagerStatus);
  const reportingManagerErrorMessage = useAppSelector(selectReportingManagerErrorMessage);
  const team = useAppSelector(selectMyTeam);
  const teamStatus = useAppSelector(selectMyTeamStatus);
  const teamErrorMessage = useAppSelector(selectMyTeamErrorMessage);
  const workLocation = useAppSelector(selectWorkLocation);
  const workLocationStatus = useAppSelector(selectWorkLocationStatus);
  const workLocationErrorMessage = useAppSelector(selectWorkLocationErrorMessage);
  const workMode = useAppSelector(selectWorkMode);
  const workModeStatus = useAppSelector(selectWorkModeStatus);
  const workModeErrorMessage = useAppSelector(selectWorkModeErrorMessage);
  const statuses = useMemo(
    () => [
      organizationInfoStatus,
      reportingManagerStatus,
      teamStatus,
      workLocationStatus,
      workModeStatus,
    ],
    [
      organizationInfoStatus,
      reportingManagerStatus,
      teamStatus,
      workLocationStatus,
      workModeStatus,
    ],
  );

  useEffect(() => {
    if (statuses.every((status) => status === 'idle')) {
      dispatch(loadMyOrganizationRequested());
    }
  }, [dispatch, statuses]);

  const refresh = useCallback(() => {
    dispatch(loadMyOrganizationRequested());
  }, [dispatch]);

  const overviewItems = useMemo<MyOrganizationOverviewItem[]>(() => {
    const organizationViewModel = toOrganizationInfoViewModel(organizationInfo);
    const reportingManagerViewModel = toReportingManagerViewModel(reportingManager);
    const teamViewModel = toTeamViewModel(team);
    const workLocationViewModel = toWorkLocationViewModel(workLocation);
    const workModeViewModel = toWorkModeViewModel(workMode);

    return [
      {
        eyebrow: 'Identity',
        route: ROUTES.myOrganizationInfo,
        subtitle: organizationViewModel.subtitle,
        title: organizationViewModel.title,
        value: firstMeaningfulValue(organizationViewModel.rows),
      },
      {
        eyebrow: 'Manager',
        route: ROUTES.myReportingManager,
        subtitle: reportingManagerViewModel.subtitle,
        title: reportingManagerViewModel.title,
        value: firstMeaningfulValue(reportingManagerViewModel.rows),
      },
      {
        eyebrow: 'Team',
        route: ROUTES.myTeam,
        subtitle: teamViewModel.subtitle,
        title: 'My Team',
        value: firstMeaningfulValue(teamViewModel.rows),
      },
      {
        eyebrow: 'Location',
        route: ROUTES.myWorkLocation,
        subtitle: workLocationViewModel.subtitle,
        title: workLocationViewModel.title,
        value: firstMeaningfulValue(workLocationViewModel.rows),
      },
      {
        eyebrow: 'Work Setup',
        route: ROUTES.myWorkMode,
        subtitle: workModeViewModel.subtitle,
        title: workModeViewModel.title,
        value: firstMeaningfulValue(workModeViewModel.rows),
      },
    ];
  }, [organizationInfo, reportingManager, team, workLocation, workMode]);

  return {
    errorMessage:
      organizationInfoErrorMessage ??
      reportingManagerErrorMessage ??
      teamErrorMessage ??
      workLocationErrorMessage ??
      workModeErrorMessage,
    isRefreshing: isLoading(statuses),
    overviewItems,
    refresh,
    status: isLoading(statuses)
      ? 'loading'
      : statuses.some((status) => status === 'failed')
        ? 'failed'
        : statuses.every((status) => status === 'ready')
          ? 'ready'
          : 'idle',
  };
};
