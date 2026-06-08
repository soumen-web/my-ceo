import { Feather } from '@expo/vector-icons';
import type { DrawerScreenProps } from '@react-navigation/drawer';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  LayoutAnimation,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { AppFonts } from '@/assets/fonts';
import { EnterpriseFeedbackBanner } from '@/design-system/components';
import { useKeyboardBottomInset } from '@/design-system/hooks';
import { MobileScreenShell } from '@/design-system/patterns/MobileScreenShell';
import { reactNativeColorScheme } from '@/design-system/tokens/colors';
import {
  HR_QUERY_CATEGORIES,
  HR_QUERY_PRIORITIES,
  type CreateHrQueryRequest,
  type HrQuery,
  type HrQueryCategory,
  type HrQueryPriority,
  type HrQueryStatus,
} from '@/modules/hr-query/domain/entities/HrQuery';
import { toAuthenticatedUserViewModel, useAuthSession } from '@/modules/auth';
import { DashboardShellHeader } from '@/modules/home/presentation/components/DashboardShellHeader';
import type { AppDrawerParamList, AppTabParamList, MyDeskStackParamList } from '@/navigation/route-types';
import { ROUTES } from '@/navigation/route-types';
import { getDrawerNavigation } from '@/navigation/utils/drawerNavigation';
import { fontSize, radius, spacing } from '@/utils/scale';

import { useHrQueryScreenModel } from '../hooks/useHrQueryScreenModel';

type HrQueryScreenProps =
  | DrawerScreenProps<AppDrawerParamList, 'HrQuery'>
  | BottomTabScreenProps<AppTabParamList, 'TabMyDesk'>
  | NativeStackScreenProps<MyDeskStackParamList, 'HrQuery'>;
type HrQueryTab = 'ask' | 'track';

const moduleColors = reactNativeColorScheme.ultiHuman.module;
const surface = reactNativeColorScheme.ultiHuman.surface;

const initialsFrom = (value: string | undefined): string => {
  const parts = value?.trim().split(/\s+/).filter(Boolean) ?? [];

  return parts.length
    ? parts.slice(0, 2).map((part) => part[0]).join('').toUpperCase()
    : 'U';
};

const formatDate = (value: string): string => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

const statusTone = (status: HrQueryStatus) => {
  if (status === 'Approved' || status === 'Resolved' || status === 'Closed') {
    return reactNativeColorScheme.status.success;
  }

  if (status === 'Pending' || status === 'Waiting for Employee' || status === 'Reopened') {
    return reactNativeColorScheme.status.warning;
  }

  if (status === 'In Progress') {
    return reactNativeColorScheme.status.info;
  }

  return reactNativeColorScheme.status.neutral;
};

const statusIcon = (status: HrQueryStatus): keyof typeof Feather.glyphMap => {
  if (status === 'Pending') {
    return 'clock';
  }

  if (status === 'In Progress') {
    return 'loader';
  }

  if (status === 'Approved') {
    return 'check-square';
  }

  if (status === 'Resolved' || status === 'Closed') {
    return 'check-circle';
  }

  if (status === 'Waiting for Employee' || status === 'Reopened') {
    return 'alert-circle';
  }

  return 'circle';
};

const priorityTone = (priority: HrQueryPriority) => {
  if (priority === 'Urgent') {
    return reactNativeColorScheme.status.danger;
  }

  if (priority === 'High') {
    return reactNativeColorScheme.status.warning;
  }

  if (priority === 'Medium') {
    return reactNativeColorScheme.status.info;
  }

  return reactNativeColorScheme.status.neutral;
};

export const HrQueryScreen = ({ navigation }: HrQueryScreenProps) => {
  const drawerNavigation = getDrawerNavigation(navigation);
  const { bottomInset, keyboardVisible } = useKeyboardBottomInset({ extraOffset: spacing(16) });
  const { user } = useAuthSession();
  const userViewModel = toAuthenticatedUserViewModel(user);
  const displayName = userViewModel?.displayName ?? 'Employee';
  const {
    errorMessage,
    isInitialLoading,
    isRefreshing,
    lastSubmittedQueryId,
    refresh,
    resetSubmitState,
    snapshot,
    submitErrorMessage,
    submitQuery,
    submitStatus,
  } = useHrQueryScreenModel();
  const [activeTab, setActiveTab] = useState<HrQueryTab>('ask');
  const [category, setCategory] = useState<HrQueryCategory | null>(null);
  const [priority, setPriority] = useState<HrQueryPriority | null>(null);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [touched, setTouched] = useState(false);
  const [expandedQueryId, setExpandedQueryId] = useState<string | null>(null);
  const queries = snapshot.queries;

  useEffect(() => {
    if (submitStatus !== 'ready') {
      return;
    }

    setCategory(null);
    setPriority(null);
    setSubject('');
    setDescription('');
    setTouched(false);

    if (lastSubmittedQueryId) {
      setExpandedQueryId(lastSubmittedQueryId);
    }

    setActiveTab('track');
  }, [lastSubmittedQueryId, submitStatus]);

  const validation = useMemo(
    () => ({
      category: category ? '' : 'Category is required.',
      description: description.trim() ? '' : 'Description is required.',
      priority: priority ? '' : 'Priority is required.',
      subject: subject.trim() ? '' : 'Subject is required.',
    }),
    [category, description, priority, subject],
  );
  const isValid = Object.values(validation).every((message) => !message);

  const submit = () => {
    setTouched(true);

    if (!category || !priority || !isValid || submitStatus === 'loading') {
      return;
    }

    const request: CreateHrQueryRequest = {
      category,
      description: description.trim(),
      priority,
      subject: subject.trim(),
    };

    submitQuery(request);
  };

  const changeTab = (tab: HrQueryTab) => {
    resetSubmitState();
    setActiveTab(tab);
  };

  const toggleQuery = (queryId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedQueryId((current) => (current === queryId ? null : queryId));
  };

  const renderQuery = ({ item }: { item: HrQuery }) => (
    <HrQueryCard
      expanded={expandedQueryId === item.id}
      onPress={() => toggleQuery(item.id)}
      query={item}
    />
  );

  return (
    <MobileScreenShell
      header={
        <DashboardShellHeader
          initials={initialsFrom(displayName)}
          leftAccessibilityLabel="Go back"
          leftIcon="arrow-left"
          navigationTitle="HR Query"
          onMenuPress={navigation.canGoBack() ? () => navigation.goBack() : undefined}
          onNotificationPress={() =>
            drawerNavigation?.navigate(ROUTES.appTabs, {
              params: { screen: ROUTES.notifications },
              screen: ROUTES.tabMyDesk,
            })
          }
          subtitle=""
          title={`Hello ${displayName}`}
        />
      }
      scrollEnabled={false}
    >
      <FlatList
        ListEmptyComponent={
          activeTab === 'track' && !isInitialLoading ? (
            <EnterpriseFeedbackBanner
              message="Submitted HR questions will appear here with status and response updates."
              title="No HR queries yet"
              tone="empty"
            />
          ) : null
        }
        ListHeaderComponent={
          <View style={styles.headerContent}>
            <View style={styles.pageHeader}>
              <Text style={styles.routeLabel}>Employee support</Text>
              <Text style={styles.pageTitle}>HR Query</Text>
            </View>
            <View style={styles.segmentedControl}>
              <SegmentButton
                active={activeTab === 'ask'}
                icon="edit-3"
                label="Ask Query"
                onPress={() => changeTab('ask')}
              />
              <SegmentButton
                active={activeTab === 'track'}
                icon="list"
                label="Track Queries"
                onPress={() => changeTab('track')}
              />
            </View>
            {activeTab === 'ask' ? (
              <AskQueryForm
                category={category}
                description={description}
                errors={touched ? validation : undefined}
                onCategoryChange={setCategory}
                onDescriptionChange={(value) => {
                  setDescription(value);
                  resetSubmitState();
                }}
                onPriorityChange={setPriority}
                onSubjectChange={(value) => {
                  setSubject(value);
                  resetSubmitState();
                }}
                onSubmit={submit}
                priority={priority}
                submitErrorMessage={submitErrorMessage}
                submitStatus={submitStatus}
                subject={subject}
              />
            ) : (
              <>
                {errorMessage ? (
                  <EnterpriseFeedbackBanner message={errorMessage} tone="error" />
                ) : null}
                {isInitialLoading ? (
                  <EnterpriseFeedbackBanner message="Loading HR queries..." tone="loading" />
                ) : null}
              </>
            )}
          </View>
        }
        automaticallyAdjustKeyboardInsets={false}
        contentContainerStyle={[
          styles.listContent,
          keyboardVisible && activeTab === 'ask'
            ? { paddingBottom: spacing(40) + bottomInset }
            : null,
        ]}
        data={activeTab === 'track' ? queries : []}
        keyExtractor={(item) => item.id}
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          activeTab === 'track' ? (
            <RefreshControl
              colors={[reactNativeColorScheme.ultiHuman.accent]}
              onRefresh={refresh}
              refreshing={isRefreshing}
              tintColor={reactNativeColorScheme.ultiHuman.accent}
            />
          ) : undefined
        }
        renderItem={renderQuery}
        showsVerticalScrollIndicator={false}
      />
    </MobileScreenShell>
  );
};

const SegmentButton = ({
  active,
  icon,
  label,
  onPress,
}: {
  active: boolean;
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress: () => void;
}) => (
  <Pressable
    accessibilityRole="button"
    onPress={onPress}
    style={({ pressed }) => [
      styles.segmentButton,
      active ? styles.segmentButtonActive : undefined,
      pressed ? styles.pressed : undefined,
    ]}
  >
    <Feather
      color={active ? reactNativeColorScheme.text.inverse : moduleColors.icon}
      name={icon}
      size={spacing(16)}
    />
    <Text style={[styles.segmentText, active ? styles.segmentTextActive : undefined]}>
      {label}
    </Text>
  </Pressable>
);

const AskQueryForm = ({
  category,
  description,
  errors,
  onCategoryChange,
  onDescriptionChange,
  onPriorityChange,
  onSubjectChange,
  onSubmit,
  priority,
  submitErrorMessage,
  submitStatus,
  subject,
}: {
  category: HrQueryCategory | null;
  description: string;
  errors?: Record<'category' | 'description' | 'priority' | 'subject', string>;
  onCategoryChange: (category: HrQueryCategory) => void;
  onDescriptionChange: (value: string) => void;
  onPriorityChange: (priority: HrQueryPriority) => void;
  onSubjectChange: (value: string) => void;
  onSubmit: () => void;
  priority: HrQueryPriority | null;
  submitErrorMessage: string | null;
  submitStatus: 'failed' | 'idle' | 'loading' | 'ready';
  subject: string;
}) => (
  <View style={styles.formPanel}>
    {submitStatus === 'ready' ? (
      <EnterpriseFeedbackBanner
        message="Query submitted. Track it from the query list."
        title="Submitted"
        tone="empty"
      />
    ) : null}
    {submitErrorMessage ? (
      <EnterpriseFeedbackBanner message={submitErrorMessage} tone="error" />
    ) : null}

    <FieldLabel label="Category" error={errors?.category} />
    <View style={styles.optionWrap}>
      {HR_QUERY_CATEGORIES.map((item) => (
        <ChoiceChip
          active={category === item}
          key={item}
          label={item}
          onPress={() => onCategoryChange(item)}
        />
      ))}
    </View>

    <FieldLabel label="Subject" error={errors?.subject} />
    <TextInput
      onChangeText={onSubjectChange}
      placeholder="Short summary of your query"
      placeholderTextColor={reactNativeColorScheme.text.disabled}
      style={styles.input}
      value={subject}
    />

    <FieldLabel label="Description" error={errors?.description} />
    <TextInput
      multiline
      onChangeText={onDescriptionChange}
      placeholder="Add details, dates, policy names, or ticket context"
      placeholderTextColor={reactNativeColorScheme.text.disabled}
      style={[styles.input, styles.textArea]}
      textAlignVertical="top"
      value={description}
    />

    <FieldLabel label="Priority" error={errors?.priority} />
    <View style={styles.optionWrap}>
      {HR_QUERY_PRIORITIES.map((item) => (
        <ChoiceChip
          active={priority === item}
          key={item}
          label={item}
          onPress={() => onPriorityChange(item)}
        />
      ))}
    </View>

    <Pressable
      accessibilityRole="button"
      disabled={submitStatus === 'loading'}
      onPress={onSubmit}
      style={({ pressed }) => [
        styles.submitButton,
        submitStatus === 'loading' ? styles.submitButtonDisabled : undefined,
        pressed ? styles.pressed : undefined,
      ]}
    >
      {submitStatus === 'loading' ? (
        <ActivityIndicator color={moduleColors.selectedText} size="small" />
      ) : (
        <Feather color={moduleColors.selectedText} name="send" size={spacing(16)} />
      )}
      <Text style={styles.submitText}>
        {submitStatus === 'loading' ? 'Submitting' : 'Submit query'}
      </Text>
    </Pressable>
  </View>
);

const FieldLabel = ({ error, label }: { error?: string; label: string }) => (
  <View style={styles.fieldHeader}>
    <Text style={styles.fieldLabel}>{label}</Text>
    {error ? <Text style={styles.fieldError}>{error}</Text> : null}
  </View>
);

const ChoiceChip = ({
  active,
  label,
  onPress,
}: {
  active: boolean;
  label: string;
  onPress: () => void;
}) => (
  <Pressable
    accessibilityRole="button"
    onPress={onPress}
    style={({ pressed }) => [
      styles.choiceChip,
      active ? styles.choiceChipActive : undefined,
      pressed ? styles.pressed : undefined,
    ]}
  >
    <Text style={[styles.choiceText, active ? styles.choiceTextActive : undefined]}>
      {label}
    </Text>
  </Pressable>
);

const HrQueryCard = ({
  expanded,
  onPress,
  query,
}: {
  expanded: boolean;
  onPress: () => void;
  query: HrQuery;
}) => (
  <Pressable
    accessibilityRole="button"
    onPress={onPress}
    style={({ pressed }) => [
      styles.queryCard,
      expanded ? styles.queryCardExpanded : undefined,
      pressed ? styles.pressed : undefined,
    ]}
  >
    <View style={styles.queryHeader}>
      <View style={styles.queryIcon}>
        <Feather color={moduleColors.icon} name="message-square" size={spacing(18)} />
      </View>
      <View style={styles.queryTitleBlock}>
        <Text numberOfLines={1} style={styles.queryTitle}>{query.subject}</Text>
        <Text style={styles.queryMeta}>
          {query.category} - Created {formatDate(query.createdAt)}
        </Text>
      </View>
      <Feather
        color={reactNativeColorScheme.text.secondary}
        name={expanded ? 'chevron-up' : 'chevron-down'}
        size={spacing(18)}
      />
    </View>
    <View style={styles.badgeRow}>
      <StatusBadge status={query.status} />
      <PriorityBadge priority={query.priority} />
      <Text style={styles.updatedText}>Updated {formatDate(query.updatedAt)}</Text>
    </View>
    {query.latestResponse ? (
      <Text numberOfLines={expanded ? undefined : 2} style={styles.responsePreview}>
        {query.latestResponse}
      </Text>
    ) : null}
    {expanded ? (
      <View style={styles.queryDetail}>
        <DetailBlock label="Description" value={query.description} />
        {query.resolutionNote ? (
          <DetailBlock label="Resolution note" value={query.resolutionNote} />
        ) : null}
        <Text style={styles.timelineTitle}>Activity</Text>
        {query.timeline.map((event) => (
          <View key={event.id} style={styles.timelineItem}>
            <View style={styles.timelineDot} />
            <View style={styles.timelineCopy}>
              <Text style={styles.timelineLabel}>{event.label}</Text>
              <Text style={styles.timelineMeta}>
                {event.actor ? `${event.actor} - ` : ''}
                {formatDate(event.createdAt)}
              </Text>
              {event.message ? <Text style={styles.timelineMessage}>{event.message}</Text> : null}
            </View>
          </View>
        ))}
      </View>
    ) : null}
  </Pressable>
);

const DetailBlock = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.detailBlock}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const StatusBadge = ({ status }: { status: HrQueryStatus }) => {
  const tone = statusTone(status);
  const isPending = status === 'Pending';

  return (
    <View
      style={[
        styles.badge,
        styles.statusBadge,
        isPending ? styles.pendingBadge : undefined,
        { backgroundColor: tone.background, borderColor: tone.border },
      ]}
    >
      <Feather
        color={tone.foreground}
        name={statusIcon(status)}
        size={spacing(isPending ? 13 : 12)}
      />
      <Text style={[styles.badgeText, { color: tone.foreground }]}>{status}</Text>
    </View>
  );
};

const PriorityBadge = ({ priority }: { priority: HrQueryPriority }) => {
  const tone = priorityTone(priority);

  return (
    <View style={[styles.badge, { backgroundColor: tone.background, borderColor: tone.border }]}>
      <Text style={[styles.badgeText, { color: tone.foreground }]}>{priority}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    borderRadius: radius(8),
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing(4),
    paddingHorizontal: spacing(8),
    paddingVertical: spacing(5),
  },
  badgeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing(7),
  },
  badgeText: {
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(10),
    lineHeight: spacing(14),
  },
  choiceChip: {
    backgroundColor: surface.glassSoft,
    borderColor: surface.aquaBorderMuted,
    borderRadius: radius(8),
    borderWidth: 1,
    paddingHorizontal: spacing(11),
    paddingVertical: spacing(8),
  },
  choiceChipActive: {
    backgroundColor: moduleColors.accentSoft,
    borderColor: moduleColors.accent,
  },
  choiceText: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(12),
    lineHeight: spacing(16),
  },
  choiceTextActive: {
    color: reactNativeColorScheme.ultiHuman.text,
  },
  detailBlock: {
    gap: spacing(4),
  },
  detailLabel: {
    color: moduleColors.accentPressed,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(11),
    lineHeight: spacing(15),
    textTransform: 'uppercase',
  },
  detailValue: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansMedium,
    fontSize: fontSize(12),
    lineHeight: spacing(17),
  },
  fieldError: {
    color: reactNativeColorScheme.status.danger.foreground,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(11),
    lineHeight: spacing(15),
  },
  fieldHeader: {
    gap: spacing(3),
  },
  fieldLabel: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(13),
    lineHeight: spacing(18),
  },
  formPanel: {
    backgroundColor: surface.glassPanel,
    borderColor: surface.aquaBorderMuted,
    borderRadius: radius(8),
    borderWidth: 1,
    gap: spacing(12),
    padding: spacing(14),
  },
  headerContent: {
    gap: spacing(14),
  },
  input: {
    backgroundColor: surface.glassAction,
    borderColor: surface.aquaBorderMuted,
    borderRadius: radius(8),
    borderWidth: 1,
    color: reactNativeColorScheme.text.primary,
    fontFamily: AppFonts.googleSansMedium,
    fontSize: fontSize(13),
    lineHeight: spacing(18),
    minHeight: spacing(48),
    paddingHorizontal: spacing(12),
    paddingVertical: spacing(10),
  },
  listContent: {
    gap: spacing(12),
    paddingBottom: spacing(40),
  },
  optionWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing(8),
  },
  pageHeader: {
    gap: spacing(4),
    paddingTop: spacing(2),
  },
  pageTitle: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(23),
    lineHeight: spacing(29),
  },
  pendingBadge: {
    shadowColor: reactNativeColorScheme.status.warning.foreground,
    shadowOffset: { height: spacing(3), width: 0 },
    shadowOpacity: 0.2,
    shadowRadius: spacing(8),
  },
  pressed: {
    opacity: 0.74,
  },
  queryCard: {
    backgroundColor: surface.glassPanel,
    borderColor: surface.aquaBorderMuted,
    borderRadius: radius(8),
    borderWidth: 1,
    gap: spacing(11),
    padding: spacing(14),
    shadowColor: surface.cardShadow,
    shadowOffset: { height: spacing(8), width: 0 },
    shadowOpacity: 0.16,
    shadowRadius: spacing(14),
  },
  queryCardExpanded: {
    borderColor: moduleColors.borderStrong,
  },
  queryDetail: {
    borderTopColor: surface.aquaBorderMuted,
    borderTopWidth: 1,
    gap: spacing(12),
    paddingTop: spacing(12),
  },
  queryHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing(10),
  },
  queryIcon: {
    alignItems: 'center',
    backgroundColor: moduleColors.iconSurface,
    borderRadius: radius(8),
    height: spacing(40),
    justifyContent: 'center',
    width: spacing(40),
  },
  queryMeta: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansMedium,
    fontSize: fontSize(11),
    lineHeight: spacing(15),
  },
  queryTitle: {
    color: reactNativeColorScheme.text.primary,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(14),
    lineHeight: spacing(19),
  },
  queryTitleBlock: {
    flex: 1,
    gap: spacing(2),
    minWidth: 0,
  },
  responsePreview: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansMedium,
    fontSize: fontSize(12),
    lineHeight: spacing(17),
  },
  routeLabel: {
    color: moduleColors.accentPressed,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(12),
    lineHeight: spacing(16),
    textTransform: 'uppercase',
  },
  segmentButton: {
    alignItems: 'center',
    borderRadius: radius(8),
    flex: 1,
    flexDirection: 'row',
    gap: spacing(7),
    justifyContent: 'center',
    minHeight: spacing(42),
  },
  segmentButtonActive: {
    backgroundColor: moduleColors.accent,
  },
  segmentedControl: {
    backgroundColor: surface.glassPanel,
    borderColor: surface.aquaBorderMuted,
    borderRadius: radius(8),
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing(6),
    padding: spacing(5),
  },
  segmentText: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(12),
    lineHeight: spacing(16),
  },
  segmentTextActive: {
    color: reactNativeColorScheme.text.inverse,
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: moduleColors.accent,
    borderRadius: radius(8),
    flexDirection: 'row',
    gap: spacing(8),
    justifyContent: 'center',
    minHeight: spacing(48),
  },
  submitButtonDisabled: {
    backgroundColor: reactNativeColorScheme.ultiHuman.accentDisabled,
  },
  submitText: {
    color: moduleColors.selectedText,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(13),
    lineHeight: spacing(18),
  },
  statusBadge: {
    paddingHorizontal: spacing(9),
  },
  textArea: {
    minHeight: spacing(118),
  },
  timelineCopy: {
    flex: 1,
    gap: spacing(2),
  },
  timelineDot: {
    backgroundColor: moduleColors.accent,
    borderRadius: radius(4),
    height: spacing(8),
    marginTop: spacing(5),
    width: spacing(8),
  },
  timelineItem: {
    flexDirection: 'row',
    gap: spacing(9),
  },
  timelineLabel: {
    color: reactNativeColorScheme.text.primary,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(12),
    lineHeight: spacing(17),
  },
  timelineMessage: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansRegular,
    fontSize: fontSize(12),
    lineHeight: spacing(17),
  },
  timelineMeta: {
    color: reactNativeColorScheme.text.muted,
    fontFamily: AppFonts.googleSansMedium,
    fontSize: fontSize(11),
    lineHeight: spacing(15),
  },
  timelineTitle: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(13),
    lineHeight: spacing(18),
  },
  updatedText: {
    color: reactNativeColorScheme.text.muted,
    fontFamily: AppFonts.googleSansMedium,
    fontSize: fontSize(11),
    lineHeight: spacing(15),
  },
});
