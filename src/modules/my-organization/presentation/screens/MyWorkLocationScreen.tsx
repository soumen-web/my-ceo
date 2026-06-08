import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { MyOrganizationStackParamList } from '@/navigation/route-types';
import { observabilityEvents } from '@services/observability/events';
import { useScreenTelemetry } from '@services/observability/performance/useScreenTelemetry';

import {
  MyOrganizationDetailCard,
  MyOrganizationScreenFrame,
} from '../components';
import { useWorkLocationScreenModel } from '../hooks/useWorkLocationScreenModel';

type MyWorkLocationScreenProps = NativeStackScreenProps<MyOrganizationStackParamList, 'MyWorkLocation'>;

export const MyWorkLocationScreen = ({ navigation }: MyWorkLocationScreenProps) => {
  const { errorMessage, isRefreshing, refresh, status, workLocation } =
    useWorkLocationScreenModel();

  useScreenTelemetry('MyWorkLocation', observabilityEvents.screenMyWorkLocationViewed);

  return (
    <MyOrganizationScreenFrame
      isDetail
      navigation={navigation}
      onRefresh={refresh}
      refreshing={isRefreshing}
      title="My Work Location"
    >
      <MyOrganizationDetailCard
        emptyMessage="No work location details are available yet."
        errorMessage={errorMessage}
        heroIcon="map-pin"
        heroKicker="Workplace context"
        loadingMessage="Loading work location..."
        rows={workLocation.rows}
        status={status}
        subtitle={workLocation.subtitle}
        title={workLocation.title}
      />
    </MyOrganizationScreenFrame>
  );
};
