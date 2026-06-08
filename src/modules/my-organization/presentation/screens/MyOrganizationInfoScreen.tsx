import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { MyOrganizationStackParamList } from '@/navigation/route-types';
import { observabilityEvents } from '@services/observability/events';
import { useScreenTelemetry } from '@services/observability/performance/useScreenTelemetry';

import {
  MyOrganizationDetailCard,
  MyOrganizationScreenFrame,
} from '../components';
import { useOrganizationInfoScreenModel } from '../hooks/useOrganizationInfoScreenModel';

type MyOrganizationInfoScreenProps = NativeStackScreenProps<
  MyOrganizationStackParamList,
  'MyOrganizationInfo'
>;

export const MyOrganizationInfoScreen = ({
  navigation,
}: MyOrganizationInfoScreenProps) => {
  const { errorMessage, isRefreshing, organizationInfo, refresh, status } =
    useOrganizationInfoScreenModel();

  useScreenTelemetry(
    'MyOrganizationInfo',
    observabilityEvents.screenMyOrganizationInfoViewed,
  );

  return (
    <MyOrganizationScreenFrame
      isDetail
      navigation={navigation}
      onRefresh={refresh}
      refreshing={isRefreshing}
      title="My Organization Info"
    >
      <MyOrganizationDetailCard
        emptyMessage="No organization info is available yet."
        errorMessage={errorMessage}
        heroIcon="briefcase"
        heroKicker="Identity and org path"
        loadingMessage="Loading organization info..."
        rows={organizationInfo.rows}
        status={status}
        subtitle={organizationInfo.subtitle}
        title={organizationInfo.title}
      />
    </MyOrganizationScreenFrame>
  );
};
