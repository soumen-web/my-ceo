import type { DrawerScreenProps } from '@react-navigation/drawer';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { StackActions } from '@react-navigation/native';
import { useCallback, useEffect, useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { MobileScreenShell } from '@/design-system/patterns/MobileScreenShell';
import type { HrmsEmployeeProfile, HrmsSelfServiceItem, HrmsStatusTone } from '@/modules/hrms';
import {
  ROUTES,
  type AppDrawerParamList,
  type AppTabParamList,
} from '@/navigation/route-types';
import { getDrawerNavigation } from '@/navigation/utils/drawerNavigation';
import { usePermission } from '@/services/access-control/usePermission';
import { observabilityEvents } from '@/services/observability/events';
import { useScreenTelemetry } from '@/services/observability/performance/useScreenTelemetry';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectIsAuthenticated } from '@/store/slices/authSlice';
import {
  loadHrmsSelfServiceRequested,
  selectHrmsEmployeeProfile,
  selectHrmsErrorMessage,
  selectHrmsSelfService,
  selectHrmsStatus,
} from '@/store/slices/hrmsSlice';
import { spacing } from '@/utils/scale';

import { DashboardShellHeader } from '../components/DashboardShellHeader';
import {
  ProfileActionChip,
  type ProfileDetailSectionModel,
  ProfileEmptyState,
  ProfileHero,
  ProfileInlineFeedback,
  ProfileSection,
  VerificationSummaryCard,
} from '../components/ProfileDetailsComponents';

type ProfileDetailsScreenProps =
  | DrawerScreenProps<AppDrawerParamList, 'ProfileDetails'>
  | BottomTabScreenProps<AppTabParamList, 'TabProfile'>;

const looksLikeOpaqueId = (value: string): boolean =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value) ||
  /^[0-9a-f]{24}$/i.test(value);

const isAvailable = (value: string): boolean =>
  Boolean(value.trim()) &&
  !['not available', 'not assigned', 'null', 'undefined', '--', '-'].includes(
    value.trim().toLowerCase(),
  ) &&
  !looksLikeOpaqueId(value.trim());

const compactValues = (...values: string[]): string =>
  values.filter(isAvailable).join(' • ') || 'Not available';

const displayValue = (value: string, fallbackValue = 'Not available'): string =>
  isAvailable(value) ? value : fallbackValue;

const getInitials = (value: string | undefined): string => {
  const nameParts = value?.trim().split(/\s+/).filter(Boolean) ?? [];
  const initials = nameParts.slice(0, 2).map((part) => part[0]).join('');

  return initials ? initials.toUpperCase() : 'U';
};

const verificationTone = (profile: HrmsEmployeeProfile): HrmsStatusTone => {
  if (profile.verificationSummary.rejectedCount > 0) {
    return 'danger';
  }

  if (
    profile.verificationSummary.pendingCount > 0 ||
    profile.verificationSummary.unverifiedCount > 0
  ) {
    return 'warning';
  }

  return profile.verificationLabel === 'Verified' ? 'success' : 'neutral';
};

const statusTone = (value: string): HrmsStatusTone => {
  const normalizedValue = value.toLowerCase();

  if (
    normalizedValue.includes('reject') ||
    normalizedValue.includes('blocked')
  ) {
    return 'danger';
  }

  if (
    normalizedValue.includes('pending') ||
    normalizedValue.includes('inactive') ||
    normalizedValue.includes('probation')
  ) {
    return 'warning';
  }

  if (
    normalizedValue.includes('active') ||
    normalizedValue.includes('verified') ||
    normalizedValue.includes('approved') ||
    normalizedValue.includes('full time')
  ) {
    return 'success';
  }

  return 'neutral';
};

const sectionRows = (
  rows: { label: string; sensitive?: boolean; value: string }[],
) => rows.filter((row) => isAvailable(row.value));

const qualificationRows = (items: HrmsSelfServiceItem[]) =>
  items
    .map((item) => ({
      label: item.title,
      statusLabel: item.statusLabel,
      statusTone: item.statusTone,
      value: compactValues(item.meta, item.subtitle),
    }))
    .filter((row) => isAvailable(row.label) && isAvailable(row.value));

const documentRows = (items: HrmsSelfServiceItem[]) =>
  items
    .map((item) => {
      const verificationDate =
        item.detailRows.find((row) => /verified|verification/i.test(row.label))?.value ??
        'Not available';

      return {
        label: item.title,
        protectedLabel: 'Protected',
        statusLabel: item.statusLabel,
        statusTone: item.statusTone,
        type: 'document' as const,
        value: isAvailable(verificationDate)
          ? `Verification date: ${verificationDate}`
          : 'Verification date: Protected',
      };
    })
    .filter((row) => isAvailable(row.label));

const buildSections = (
  profile: HrmsEmployeeProfile,
  documents: HrmsSelfServiceItem[],
  qualifications: HrmsSelfServiceItem[],
): ProfileDetailSectionModel[] =>
  [
    {
      icon: 'user',
      id: 'identity',
      rows: sectionRows([
        { label: 'Employee Number', value: profile.employeeNumber },
        { label: 'Preferred Name', value: profile.preferredName },
        { label: 'First name', value: profile.firstName },
        { label: 'Last name', value: profile.lastName },
        { label: 'Display Name', value: profile.displayName },
        { label: 'Gender', value: profile.gender },
        { label: 'DOB', value: profile.dateOfBirth },
        { label: 'Status', value: profile.employmentStatus },
      ]),
      title: 'Employee Identity',
    },
    {
      icon: 'mail',
      id: 'contact',
      rows: sectionRows([
        { label: 'Work Email', value: profile.workEmail },
        { label: 'Personal Email', value: profile.personalEmail },
        { label: 'Phone', value: compactValues(profile.phoneNumber, profile.workPhoneNumber) },
        {
          label: 'Emergency Contact',
          value: compactValues(
            profile.emergencyContactName,
            profile.emergencyContactPhone,
            profile.emergencyContactRelation,
          ),
        },
      ]),
      title: 'Contact Information',
    },
    {
      icon: 'briefcase',
      id: 'employment',
      rows: sectionRows([
        { label: 'Joining date', value: profile.joiningDate },
        { label: 'Work experience', value: profile.totalExperience },
        { label: 'Effective date', value: profile.effectiveDate },
        { label: 'Login platform', value: profile.lastLoginPlatform },
        { label: 'Authentication date', value: profile.authenticationDate },
        { label: 'Account status', value: profile.accountStatus },
      ]),
      title: 'Employment Information',
    },
    {
      icon: 'map-pin',
      id: 'address',
      rows: sectionRows([
        { label: 'Address Line 1', value: profile.addressLine },
        { label: 'Address Line 2', value: profile.addressLine2 },
        { label: 'Landmark', value: profile.landmark },
        { label: 'City', value: profile.city },
        { label: 'State', value: profile.state },
        { label: 'Country', value: profile.country },
        { label: 'Pincode', value: profile.postalCode },
      ]),
      title: 'Address Information',
    },
    {
      icon: 'layers',
      id: 'structure',
      rows: sectionRows([
        { label: 'Designation', value: profile.designation },
        { label: 'Grade', value: profile.grade },
        { label: 'Job Level', value: profile.jobLevel },
        { label: 'Job Function', value: profile.jobFunction },
        { label: 'Department', value: profile.department },
        { label: 'Reporting Manager', value: profile.reportingManager },
      ]),
      title: 'Work Structure',
    },
    {
      icon: 'lock',
      id: 'banking',
      rows: sectionRows([
        { label: 'Bank Name', value: profile.bankName },
        { label: 'Branch Name', value: profile.branchName },
        { label: 'Account Type', value: profile.bankAccountType },
        { label: 'IFSC', value: profile.ifscCode },
        { label: 'Masked Account Number', sensitive: true, value: profile.bankAccountNumber },
      ]),
      title: 'Banking Information',
    },
    {
      icon: 'shield',
      id: 'government',
      rows: sectionRows([
        { label: 'PAN', sensitive: true, value: profile.panNumber },
        { label: 'Aadhaar', sensitive: true, value: profile.aadhaarNumber },
        { label: 'UAN', sensitive: true, value: profile.uanNumber },
        { label: 'Voter ID', sensitive: true, value: profile.voterId },
      ]),
      title: 'Government IDs',
    },
    {
      icon: 'award',
      id: 'qualification',
      rows: qualificationRows(qualifications),
      title: 'Qualifications',
    },
    {
      icon: 'file-text',
      id: 'documents',
      rows: documentRows(documents),
      title: 'Documents & Verification',
    },
  ].filter((section) => section.rows.length > 0) as ProfileDetailSectionModel[];

export const ProfileDetailsScreen = ({ navigation }: ProfileDetailsScreenProps) => {
  const drawerNavigation = getDrawerNavigation(navigation);
  const dispatch = useAppDispatch();
  const canViewOrganizationEmployees = usePermission('employee:view:org');
  const errorMessage = useAppSelector(selectHrmsErrorMessage);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const profile = useAppSelector(selectHrmsEmployeeProfile);
  const snapshot = useAppSelector(selectHrmsSelfService);
  const status = useAppSelector(selectHrmsStatus);
  const displayName = useMemo(
    () => displayValue(profile.displayName, 'Employee'),
    [profile.displayName],
  );
  const initials = useMemo(() => getInitials(displayName), [displayName]);
  const sections = useMemo(
    () => buildSections(profile, snapshot.documents, snapshot.qualifications),
    [profile, snapshot.documents, snapshot.qualifications],
  );
  const isRefreshing = status === 'loading';
  const isInitialLoading = status === 'loading' && !profile.id && !errorMessage;
  const tone = verificationTone(profile);

  useScreenTelemetry('ProfileDetails', observabilityEvents.screenProfileViewed);

  useEffect(() => {
    if (!isAuthenticated) {
      drawerNavigation?.getParent()?.dispatch(StackActions.replace(ROUTES.signIn));
    }
  }, [drawerNavigation, isAuthenticated]);

  const refreshProfile = useCallback(() => {
    dispatch(loadHrmsSelfServiceRequested({ canViewOrganizationEmployees }));
  }, [canViewOrganizationEmployees, dispatch]);

  useEffect(() => {
    if (status === 'idle') {
      refreshProfile();
    }
  }, [refreshProfile, status]);

  return (
    <MobileScreenShell
      header={
        <DashboardShellHeader
          initials={initials}
          onNotificationPress={() =>
            drawerNavigation?.navigate(ROUTES.appTabs, {
              params: { screen: ROUTES.notifications },
              screen: ROUTES.tabMyDesk,
            })
          }
          subtitle="Profile"
          title={`Hello ${displayName}`}
        />
      }
      onRefresh={refreshProfile}
      refreshing={isRefreshing}
      scrollBounces
    >
      <ProfileHero
        accountStatus={displayValue(profile.accountStatus)}
        accountStatusTone={statusTone(profile.accountStatus)}
        department={displayValue(profile.department, displayValue(profile.teamName))}
        designation={displayValue(profile.designation, displayValue(profile.role))}
        displayName={displayName}
        employeeNumber={displayValue(profile.employeeNumber, 'Employee number pending')}
        employmentStatus={displayValue(profile.employmentStatus, 'Status pending')}
        employmentStatusTone={statusTone(profile.employmentStatus)}
        employmentType={displayValue(profile.employmentType)}
        grade={displayValue(profile.grade, displayValue(profile.jobLevel, 'Grade pending'))}
        initials={initials}
        verificationLabel={profile.verificationLabel}
        verificationTone={tone}
      />

      <ScrollView
        horizontal
        bounces
        contentContainerStyle={styles.actionRail}
        showsHorizontalScrollIndicator={false}
      >
        <ProfileActionChip
          icon="briefcase"
          label="Work"
          onPress={() => drawerNavigation?.navigate(ROUTES.appTabs, { screen: ROUTES.tabWexa })}
        />
        <ProfileActionChip
          icon="users"
          label="Team"
          onPress={() =>
            drawerNavigation?.navigate(ROUTES.appTabs, {
              params: {
                params: { screen: ROUTES.myTeam },
                screen: ROUTES.myOrganization,
              },
              screen: ROUTES.tabMyDesk,
            })
          }
        />
        <ProfileActionChip
          icon="map-pin"
          label="Location"
          onPress={() =>
            drawerNavigation?.navigate(ROUTES.appTabs, {
              params: {
                params: { screen: ROUTES.myWorkLocation },
                screen: ROUTES.myOrganization,
              },
              screen: ROUTES.tabMyDesk,
            })
          }
        />
      </ScrollView>

      {isInitialLoading ? (
        <ProfileInlineFeedback message="Loading premium employee profile..." tone="loading" />
      ) : errorMessage ? (
        <ProfileInlineFeedback message={errorMessage} tone="error" />
      ) : null}

      <VerificationSummaryCard
        outstanding={profile.verificationSummary.outstandingDocuments.length}
        pending={profile.verificationSummary.pendingCount}
        rejected={profile.verificationSummary.rejectedCount}
        unverified={profile.verificationSummary.unverifiedCount}
        verificationLabel={profile.verificationLabel}
      />

      <View style={styles.sections}>
        {sections.length ? (
          sections.map((section) => (
            <ProfileSection key={section.id} section={section} />
          ))
        ) : (
          <ProfileEmptyState />
        )}
      </View>
    </MobileScreenShell>
  );
};

const styles = StyleSheet.create({
  actionRail: {
    gap: spacing(9),
    paddingHorizontal: spacing(1),
    paddingVertical: spacing(2),
  },
  sections: {
    gap: spacing(12),
  },
});
