import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback } from 'react';
import { FlatList, RefreshControl, StyleSheet } from 'react-native';

import { EnterpriseFeedbackBanner } from '@/design-system/components';
import {
  isHrmsSelfServiceSection,
  type HrmsSelfServiceItem,
} from '@/modules/hrms/domain/entities/HrmsSelfService';
import { reactNativeColorScheme } from '@/design-system/tokens/colors';
import type { HrmsStackParamList } from '@/navigation/route-types';
import { spacing } from '@/utils/scale';

import { HrmsItemCard, HrmsScreenFrame } from '../components';
import { useHrmsSelfServiceScreenModel } from '../hooks/useHrmsSelfServiceScreenModel';

type HrmsSelfServiceDetailScreenProps = NativeStackScreenProps<
  HrmsStackParamList,
  'WorkforceHubDetail'
>;

export const HrmsSelfServiceDetailScreen = ({
  navigation,
  route,
}: HrmsSelfServiceDetailScreenProps) => {
  const {
    errorMessage,
    getItemsForSection,
    isRefreshing,
    refresh,
    sectionTitles,
    status,
    canViewOrganizationEmployees,
  } = useHrmsSelfServiceScreenModel();
  const section = isHrmsSelfServiceSection(route.params.section)
    ? route.params.section
    : 'profile';
  const items = getItemsForSection(section);
  const title = sectionTitles[section];
  const isAccessDenied = section === 'people' && !canViewOrganizationEmployees;
  const isInitialLoading = status === 'loading' && !items.length && !errorMessage;
  const renderItem = useCallback(
    ({ item }: { item: HrmsSelfServiceItem }) => <HrmsItemCard item={item} />,
    [],
  );

  return (
    <HrmsScreenFrame
      isDetail
      navigation={navigation}
      routeLabel="Workforce Hub"
      scrollEnabled={false}
      title={title}
    >
      {isAccessDenied ? (
        <EnterpriseFeedbackBanner
          message="People directory needs organization employee access. Your personal Workforce Hub remains available."
          title="Limited access"
          tone="empty"
        />
      ) : isInitialLoading ? (
        <EnterpriseFeedbackBanner
          message={`Loading ${title.toLowerCase()}...`}
          tone="loading"
        />
      ) : errorMessage ? (
        <EnterpriseFeedbackBanner message={errorMessage} tone="error" />
      ) : null}

      {!isAccessDenied && items.length ? (
        <FlatList
          contentContainerStyle={styles.list}
          data={items}
          initialNumToRender={8}
          keyExtractor={(item) => item.id}
          maxToRenderPerBatch={8}
          refreshControl={
            <RefreshControl
              colors={[reactNativeColorScheme.ultiHuman.accent]}
              onRefresh={refresh}
              refreshing={isRefreshing}
              tintColor={reactNativeColorScheme.ultiHuman.accent}
            />
          }
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          updateCellsBatchingPeriod={40}
          windowSize={7}
        />
      ) : !isAccessDenied && !isInitialLoading ? (
        <EnterpriseFeedbackBanner
          message="This section is clean right now. Pull down to refresh when new workforce data is available."
          title="Nothing to review"
          tone="empty"
        />
      ) : null}
    </HrmsScreenFrame>
  );
};

const styles = StyleSheet.create({
  list: {
    gap: spacing(12),
    paddingBottom: spacing(34),
  },
});
