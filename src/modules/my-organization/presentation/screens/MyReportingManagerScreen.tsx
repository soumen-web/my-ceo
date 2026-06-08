import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { MyOrganizationStackParamList } from '@/navigation/route-types';
import { observabilityEvents } from '@services/observability/events';
import { useScreenTelemetry } from '@services/observability/performance/useScreenTelemetry';

import {
  MyOrganizationDetailCard,
  MyOrganizationScreenFrame,
} from '../components';
import { useReportingManagerScreenModel } from '../hooks/useReportingManagerScreenModel';

type MyReportingManagerScreenProps = NativeStackScreenProps<
  MyOrganizationStackParamList,
  'MyReportingManager'
>;

export const MyReportingManagerScreen = ({
  navigation,
}: MyReportingManagerScreenProps) => {
  const { errorMessage, isRefreshing, refresh, reportingManager, status } =
    useReportingManagerScreenModel();

  useScreenTelemetry('MyReportingManager', observabilityEvents.screenMyReportingManagerViewed);

  return (
    <MyOrganizationScreenFrame
      isDetail
      navigation={navigation}
      onRefresh={refresh}
      refreshing={isRefreshing}
      title="My Reporting Manager"
    >
      <MyOrganizationDetailCard
        emptyMessage="No reporting manager details are available yet."
        errorMessage={errorMessage}
        heroIcon="user-check"
        heroKicker="Manager relationship"
        loadingMessage="Loading reporting manager..."
        rows={reportingManager.rows}
        status={status}
        subtitle={reportingManager.subtitle}
        title={reportingManager.title}
      />
    </MyOrganizationScreenFrame>
  );
};
