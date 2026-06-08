import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppFonts } from '@/assets/fonts';
import {
  EnterpriseFeedbackBanner,
  EnterpriseListRow,
  EnterpriseMetricTile,
} from '@/design-system/components';
import { reactNativeColorScheme } from '@/design-system/tokens/colors';
import type { HrmsSelfServiceSection } from '@/modules/hrms/domain/entities/HrmsSelfService';
import type { HrmsStackParamList } from '@/navigation/route-types';
import { ROUTES } from '@/navigation/route-types';
import { fontSize, radius, spacing } from '@/utils/scale';

import { HrmsScreenFrame } from '../components';
import { useHrmsSelfServiceScreenModel } from '../hooks/useHrmsSelfServiceScreenModel';

type HrmsScreenProps = NativeStackScreenProps<HrmsStackParamList, 'WorkforceHubOverview'>;

const iconBySection: Record<HrmsSelfServiceSection, keyof typeof Feather.glyphMap> = {
  attendance: 'clock',
  documents: 'file-text',
  jobs: 'briefcase',
  organization: 'git-branch',
  people: 'users',
  profile: 'user',
  qualifications: 'award',
  requests: 'inbox',
};

const moduleColors = reactNativeColorScheme.ultiHuman.module;

const getSummaryTotal = (
  snapshot: ReturnType<typeof useHrmsSelfServiceScreenModel>['snapshot'],
  label: string,
) => snapshot.summaries.find((summary) => summary.label === label)?.total ?? 0;

export const HrmsScreen = ({ navigation }: HrmsScreenProps) => {
  const { errorMessage, isRefreshing, refresh, sectionCards, snapshot, status } =
    useHrmsSelfServiceScreenModel();
  const isInitialLoading = status === 'loading' && !errorMessage && !snapshot.profile.id;
  const peopleTotal = getSummaryTotal(snapshot, 'People');
  const teamsTotal = getSummaryTotal(snapshot, 'Teams');
  const verifiedSignals = snapshot.summaries.reduce(
    (total, summary) => total + summary.completed,
    0,
  );

  return (
    <HrmsScreenFrame
      navigation={navigation}
      onRefresh={refresh}
      refreshing={isRefreshing}
      routeLabel="Employee services"
      title="Workforce Hub"
    >
      <LinearGradient
        colors={moduleColors.heroGradient}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={styles.heroCard}
      >
        <View style={styles.heroTop}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {snapshot.profile.displayName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.heroCopy}>
            <Text style={styles.heroEyebrow}>Executive workforce view</Text>
            <Text numberOfLines={1} style={styles.heroTitle}>
              {snapshot.profile.displayName}
            </Text>
            <Text numberOfLines={1} style={styles.heroSubtitle}>
              {snapshot.profile.employeeNumber} • {snapshot.profile.role}
            </Text>
          </View>
          <View style={styles.heroBadge}>
            <Feather color={moduleColors.icon} name="shield" size={spacing(15)} />
            <Text style={styles.heroBadgeText}>{snapshot.profile.verificationLabel}</Text>
          </View>
        </View>

        <Text numberOfLines={2} style={styles.heroNarrative}>
          {snapshot.profile.teamName} operating profile with {peopleTotal} people, {teamsTotal}{' '}
          teams, and {verifiedSignals} verified workforce signals.
        </Text>

        <View style={styles.heroMetrics}>
          <View style={styles.heroMetric}>
            <Text style={styles.heroMetricValue}>{peopleTotal}</Text>
            <Text style={styles.heroMetricLabel}>People</Text>
          </View>
          <View style={styles.heroMetric}>
            <Text style={styles.heroMetricValue}>{teamsTotal}</Text>
            <Text style={styles.heroMetricLabel}>Teams</Text>
          </View>
          <View style={styles.heroMetric}>
            <Text style={styles.heroMetricValue}>{snapshot.profile.pendingVerificationCount}</Text>
            <Text style={styles.heroMetricLabel}>Open checks</Text>
          </View>
        </View>
      </LinearGradient>

      {isInitialLoading ? (
        <EnterpriseFeedbackBanner message="Loading your Workforce Hub..." tone="loading" />
      ) : errorMessage ? (
        <EnterpriseFeedbackBanner message={errorMessage} tone="error" />
      ) : null}

      <ScrollView
        horizontal
        bounces
        contentContainerStyle={styles.summaryGrid}
        showsHorizontalScrollIndicator={false}
      >
        {snapshot.summaries.map((summary) => (
          <View key={summary.label} style={styles.summaryTile}>
            <EnterpriseMetricTile label={summary.label} value={summary.total} />
          </View>
        ))}
      </ScrollView>

      <View style={styles.moduleList}>
        {sectionCards.map((item) => (
          <EnterpriseListRow
            count={item.count}
            eyebrow={item.statusLabel}
            icon={iconBySection[item.section]}
            key={item.section}
            onPress={() =>
              navigation.navigate(ROUTES.workforceHubDetail, {
                section: item.section,
              })
            }
            subtitle={item.description}
            title={item.title}
          />
        ))}
      </View>
    </HrmsScreenFrame>
  );
};

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    backgroundColor: moduleColors.ink,
    borderColor: 'rgba(255, 255, 255, 0.74)',
    borderRadius: radius(8),
    borderWidth: 1,
    height: spacing(58),
    justifyContent: 'center',
    width: spacing(58),
  },
  avatarText: {
    color: reactNativeColorScheme.text.inverse,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(20),
    lineHeight: spacing(26),
  },
  heroCard: {
    borderColor: moduleColors.borderStrong,
    borderRadius: radius(8),
    borderWidth: 1,
    gap: spacing(16),
    overflow: 'hidden',
    padding: spacing(18),
    shadowColor: moduleColors.shadow,
    shadowOffset: { height: spacing(12), width: 0 },
    shadowOpacity: 0.24,
    shadowRadius: spacing(22),
  },
  heroBadge: {
    alignItems: 'center',
    backgroundColor: moduleColors.heroOverlay,
    borderColor: moduleColors.border,
    borderRadius: radius(8),
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing(6),
    maxWidth: spacing(122),
    paddingHorizontal: spacing(9),
    paddingVertical: spacing(8),
  },
  heroBadgeText: {
    color: moduleColors.ink,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(11),
    lineHeight: spacing(15),
  },
  heroCopy: {
    flex: 1,
    gap: spacing(2),
    minWidth: 0,
  },
  heroEyebrow: {
    color: moduleColors.accentPressed,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(10),
    lineHeight: spacing(14),
    textTransform: 'uppercase',
  },
  heroMetric: {
    backgroundColor: moduleColors.heroMetric,
    borderColor: moduleColors.border,
    borderRadius: radius(8),
    borderWidth: 1,
    flex: 1,
    gap: spacing(2),
    minWidth: spacing(86),
    paddingHorizontal: spacing(10),
    paddingVertical: spacing(10),
  },
  heroMetricLabel: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansMedium,
    fontSize: fontSize(10),
    lineHeight: spacing(14),
  },
  heroMetricValue: {
    color: moduleColors.ink,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(20),
    lineHeight: spacing(26),
  },
  heroMetrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing(8),
  },
  heroNarrative: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansMedium,
    fontSize: fontSize(13),
    lineHeight: spacing(18),
  },
  heroSubtitle: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansMedium,
    fontSize: fontSize(13),
    lineHeight: spacing(18),
  },
  heroTitle: {
    color: moduleColors.ink,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(20),
    lineHeight: spacing(26),
  },
  heroTop: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing(12),
  },
  moduleList: {
    gap: spacing(12),
  },
  summaryGrid: {
    gap: spacing(10),
    paddingHorizontal: spacing(1),
    paddingVertical: spacing(2),
  },
  summaryTile: {
    width: spacing(126),
  },
});
