import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { MyOrganizationStackParamList } from '@/navigation/route-types';
import { observabilityEvents } from '@services/observability/events';
import { useScreenTelemetry } from '@services/observability/performance/useScreenTelemetry';

import {
  MyOrganizationDetailCard,
  MyOrganizationScreenFrame,
} from '../components';
import { useWorkModeScreenModel } from '../hooks/useWorkModeScreenModel';

type MyWorkModeScreenProps = NativeStackScreenProps<MyOrganizationStackParamList, 'MyWorkMode'>;

export const MyWorkModeScreen = ({ navigation }: MyWorkModeScreenProps) => {
  const { errorMessage, isRefreshing, refresh, status, workMode } = useWorkModeScreenModel();

  useScreenTelemetry('MyWorkMode', observabilityEvents.screenMyWorkModeViewed);

  return (
    <MyOrganizationScreenFrame
      isDetail
      navigation={navigation}
      onRefresh={refresh}
      refreshing={isRefreshing}
      title="My Work Mode"
    >
      <MyOrganizationDetailCard
        emptyMessage="No work mode details are available yet."
        errorMessage={errorMessage}
        heroIcon="calendar"
        heroKicker="Work setup"
        loadingMessage="Loading work mode..."
        rows={workMode.rows}
        status={status}
        subtitle={workMode.subtitle}
        title={workMode.title}
      />
    </MyOrganizationScreenFrame>
  );
};
