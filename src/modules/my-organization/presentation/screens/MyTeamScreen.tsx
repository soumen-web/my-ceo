import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { MyOrganizationStackParamList } from '@/navigation/route-types';
import { observabilityEvents } from '@services/observability/events';
import { useScreenTelemetry } from '@services/observability/performance/useScreenTelemetry';

import {
  MyOrganizationDetailCard,
  MyOrganizationScreenFrame,
} from '../components';
import { useTeamScreenModel } from '../hooks/useTeamScreenModel';

type MyTeamScreenProps = NativeStackScreenProps<MyOrganizationStackParamList, 'MyTeam'>;

export const MyTeamScreen = ({ navigation }: MyTeamScreenProps) => {
  const { errorMessage, isRefreshing, refresh, status, team } = useTeamScreenModel();

  useScreenTelemetry('MyTeam', observabilityEvents.screenMyTeamViewed);

  return (
    <MyOrganizationScreenFrame
      isDetail
      navigation={navigation}
      onRefresh={refresh}
      refreshing={isRefreshing}
      title="My Team"
    >
      <MyOrganizationDetailCard
        emptyMessage="No team details are available yet."
        errorMessage={errorMessage}
        heroIcon="users"
        heroKicker="Team placement"
        loadingMessage="Loading team..."
        rows={team.rows}
        status={status}
        subtitle={team.subtitle}
        title={team.title}
      />
    </MyOrganizationScreenFrame>
  );
};
