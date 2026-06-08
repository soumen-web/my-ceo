import { useMemo } from 'react';

import { useAppSelector } from '@/app/providers/state/hooks';
import { useAuthSession } from '@/modules/auth';
import { selectHomeEmployeeAvatarUrl } from '@/store/slices/homeSlice';
import { toAbsoluteAssetUrl } from '@/shared/utils/toAbsoluteAssetUrl';

export const useProfileAvatarUri = (): string => {
  const { user } = useAuthSession();
  const employeeAvatarUrl = useAppSelector(selectHomeEmployeeAvatarUrl);

  return useMemo(() => {
    const employeeImage = employeeAvatarUrl?.trim();
    if (employeeImage) {
      return toAbsoluteAssetUrl(employeeImage);
    }

    const authImage = user?.profileImage?.trim();
    if (authImage) {
      return toAbsoluteAssetUrl(authImage);
    }

    return '';
  }, [employeeAvatarUrl, user?.profileImage]);
};
