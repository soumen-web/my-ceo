import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppFonts } from '@/assets/fonts';
import { EnterpriseFeedbackBanner } from '@/design-system/components';
import { reactNativeColorScheme } from '@/design-system/tokens/colors';
import type { LeaveStackParamList } from '@/navigation/route-types';
import { ROUTES } from '@/navigation/route-types';
import { fontSize, spacing } from '@/utils/scale';

import {
  getDateForMonthOffset,
  getDateKey,
  getMonthDateFromSelectedDate,
  LeaveAnalyticsPreview,
  LeaveBalanceRail,
  LeaveCalendarCard,
  LeaveHeroCard,
  LeaveInsightsPanel,
  LeaveQuickAction,
  LeaveRequestRow,
  LeaveScreenFrame,
  LeaveSkeleton,
  SelectedLeaveDayPanel,
  TeamLeaveRow,
} from '../components';
import { useLeaveScreenModel } from '../hooks/useLeaveScreenModel';

const moduleColors = reactNativeColorScheme.ultiHuman.module;

type LeaveHomeScreenProps = NativeStackScreenProps<LeaveStackParamList, 'LeaveHome'>;

export const LeaveHomeScreen = ({ navigation }: LeaveHomeScreenProps) => {
  const {
    errorMessage,
    isInitialLoading,
    isRefreshing,
    nextLeave,
    pendingCount,
    refresh,
    snapshot,
    totalAvailableDays,
  } = useLeaveScreenModel();
  const todayKey = getDateKey(new Date());
  const [selectedDate, setSelectedDate] = useState(todayKey);
  const selectedDay = useMemo(
    () => snapshot.calendar.find((day) => day.date === selectedDate),
    [selectedDate, snapshot.calendar],
  );

  const changeMonth = (offset: number) => {
    setSelectedDate((current) => getDateForMonthOffset(current, offset));
  };

  return (
    <LeaveScreenFrame
      navigation={navigation}
      onRefresh={refresh}
      refreshing={isRefreshing}
      title="Leave"
    >
      {isInitialLoading ? (
        <LeaveSkeleton />
      ) : (
        <>
          {errorMessage ? <EnterpriseFeedbackBanner message={errorMessage} tone="error" /> : null}
          <LeaveHeroCard
            availableDays={totalAvailableDays}
            nextLeave={nextLeave}
            pendingCount={pendingCount}
            protectedDays={snapshot.analytics.streakProtectedDays}
          />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.actionDock}
          >
            <LeaveQuickAction
              icon="send"
              label="Apply"
              onPress={() => navigation.navigate(ROUTES.leaveApply)}
            />
            <LeaveQuickAction
              icon="list"
              label="History"
              onPress={() => navigation.navigate(ROUTES.leaveHistory)}
            />
            <LeaveQuickAction
              icon="bar-chart-2"
              label="Analytics"
              onPress={() => navigation.navigate(ROUTES.leaveAnalytics)}
            />
          </ScrollView>

          <LeaveBalanceRail balances={snapshot.balances} />
          <LeaveCalendarCard
            calendar={snapshot.calendar}
            month={getMonthDateFromSelectedDate(selectedDate)}
            onChangeMonth={changeMonth}
            onSelectDate={setSelectedDate}
            selectedDate={selectedDate}
          />
          <SelectedLeaveDayPanel day={selectedDay} selectedDate={selectedDate} />

          <CompactSection title="Pending approvals">
            {snapshot.pendingApprovals.slice(0, 2).map((request) => (
              <LeaveRequestRow
                key={request.id}
                onPress={() => navigation.navigate(ROUTES.leaveDetail, { leaveId: request.id })}
                request={request}
              />
            ))}
          </CompactSection>

          <CompactSection icon="users" title="Team leave watch">
            {snapshot.teamLeaves.slice(0, 3).map((leave) => (
              <TeamLeaveRow key={leave.id} leave={leave} />
            ))}
          </CompactSection>

          <LeaveAnalyticsPreview
            approvalRate={snapshot.analytics.approvalRate}
            monthlyUsage={snapshot.analytics.monthlyUsage}
          />
          <LeaveInsightsPanel insights={snapshot.insights} />
        </>
      )}
    </LeaveScreenFrame>
  );
};

const CompactSection = ({
  children,
  icon = 'clock',
  title,
}: {
  children: ReactNode;
  icon?: keyof typeof Feather.glyphMap;
  title: string;
}) => (
  <View style={styles.compactSection}>
    <View style={styles.compactHeader}>
      <Feather color={moduleColors.icon} name={icon} size={spacing(17)} />
      <Text style={styles.compactTitle}>{title}</Text>
    </View>
    <View style={styles.compactBody}>{children}</View>
  </View>
);

const styles = StyleSheet.create({
  actionDock: {
    flexDirection: 'row',
    gap: spacing(9),
    paddingRight: spacing(8),
  },
  compactBody: {
    gap: spacing(8),
  },
  compactHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing(8),
  },
  compactSection: {
    gap: spacing(10),
  },
  compactTitle: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(15),
    lineHeight: spacing(20),
  },
});
