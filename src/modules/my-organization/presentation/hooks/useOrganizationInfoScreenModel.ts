import { useCallback, useEffect, useMemo } from 'react';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  loadOrganizationInfoRequested,
  selectOrganizationInfo,
  selectOrganizationInfoErrorMessage,
  selectOrganizationInfoStatus,
} from '@/store/slices/myOrganizationSlice';

import { toOrganizationInfoViewModel } from '../mappers/toOrganizationInfoViewModel';

export const useOrganizationInfoScreenModel = () => {
  const dispatch = useAppDispatch();
  const organizationInfo = useAppSelector(selectOrganizationInfo);
  const errorMessage = useAppSelector(selectOrganizationInfoErrorMessage);
  const status = useAppSelector(selectOrganizationInfoStatus);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(loadOrganizationInfoRequested());
    }
  }, [dispatch, status]);

  const refresh = useCallback(() => {
    dispatch(loadOrganizationInfoRequested());
  }, [dispatch]);

  const viewModel = useMemo(
    () => toOrganizationInfoViewModel(organizationInfo),
    [organizationInfo],
  );

  return {
    errorMessage,
    isRefreshing: status === 'loading',
    organizationInfo: viewModel,
    refresh,
    status,
  };
};
