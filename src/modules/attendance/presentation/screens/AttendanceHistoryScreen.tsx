import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';

import { EnterpriseFeedbackBanner } from '@/design-system/components';
import type { AttendanceStackParamList } from '@/navigation/route-types';
import { ROUTES } from '@/navigation/route-types';
import { spacing } from '@/utils/scale';

import {
  AttendanceHistoryRow,
  AttendanceScreenFrame,
  AttendanceSkeleton,
} from '../components';
import { useAttendanceScreenModel } from '../hooks/useAttendanceScreenModel';

type AttendanceHistoryScreenProps = NativeStackScreenProps<
  AttendanceStackParamList,
  'AttendanceHistory'
>;

export const AttendanceHistoryScreen = ({ navigation }: AttendanceHistoryScreenProps) => {
  const {
    errorMessage,
    isInitialLoading,
    isRefreshing,
    refreshHistory,
    snapshot,
  } = useAttendanceScreenModel();

  return (
    <AttendanceScreenFrame
      isDetail
      navigation={navigation}
      onRefresh={refreshHistory}
      refreshing={isRefreshing}
      routeLabel="Attendance"
      title="History"
    >
      {isInitialLoading ? (
        <AttendanceSkeleton />
      ) : errorMessage ? (
        <EnterpriseFeedbackBanner message={errorMessage} tone="error" />
      ) : snapshot.history.length ? (
        <View style={styles.list}>
          {snapshot.history.map((item) => (
            <AttendanceHistoryRow
              item={item}
              key={item.id}
              onPress={() =>
                navigation.navigate(ROUTES.attendanceDailyTimeline, {
                  date: item.date,
                })
              }
            />
          ))}
        </View>
      ) : (
        <EnterpriseFeedbackBanner
          message="Attendance history will appear after your first synced workday."
          tone="empty"
        />
      )}
    </AttendanceScreenFrame>
  );
};

const styles = StyleSheet.create({
  list: {
    gap: spacing(10),
  },
});
