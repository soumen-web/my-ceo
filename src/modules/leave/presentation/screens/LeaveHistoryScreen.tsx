import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { LeaveStackParamList } from '@/navigation/route-types';
import { ROUTES } from '@/navigation/route-types';

import { LeaveRequestRow, LeaveScreenFrame } from '../components';
import { useLeaveScreenModel } from '../hooks/useLeaveScreenModel';

type LeaveHistoryScreenProps = NativeStackScreenProps<LeaveStackParamList, 'LeaveHistory'>;

export const LeaveHistoryScreen = ({ navigation }: LeaveHistoryScreenProps) => {
  const { isRefreshing, refresh, snapshot } = useLeaveScreenModel();

  return (
    <LeaveScreenFrame
      isDetail
      navigation={navigation}
      onRefresh={refresh}
      refreshing={isRefreshing}
      title="Leave history"
    >
      {snapshot.history.map((request) => (
        <LeaveRequestRow
          key={request.id}
          onPress={() => navigation.navigate(ROUTES.leaveDetail, { leaveId: request.id })}
          request={request}
        />
      ))}
    </LeaveScreenFrame>
  );
};
