import { useCallback, useEffect, useMemo } from 'react';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  loadMyTeamRequested,
  selectMyTeam,
  selectMyTeamErrorMessage,
  selectMyTeamStatus,
} from '@/store/slices/myOrganizationSlice';

import { toTeamViewModel } from '../mappers/toTeamViewModel';

export const useTeamScreenModel = () => {
  const dispatch = useAppDispatch();
  const teamInfo = useAppSelector(selectMyTeam);
  const errorMessage = useAppSelector(selectMyTeamErrorMessage);
  const status = useAppSelector(selectMyTeamStatus);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(loadMyTeamRequested());
    }
  }, [dispatch, status]);

  const refresh = useCallback(() => {
    dispatch(loadMyTeamRequested());
  }, [dispatch]);

  const viewModel = useMemo(() => toTeamViewModel(teamInfo), [teamInfo]);

  return {
    errorMessage,
    isRefreshing: status === 'loading',
    refresh,
    status,
    team: viewModel,
  };
};
