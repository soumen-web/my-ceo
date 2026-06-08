import { useCallback, useEffect, useMemo } from 'react';

import type {
  HrmsSelfServiceItem,
  HrmsSelfServiceSection,
} from '@/modules/hrms/domain/entities/HrmsSelfService';
import { usePermission } from '@/services/access-control/usePermission';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  loadHrmsSelfServiceRequested,
  selectHrmsErrorMessage,
  selectHrmsSelfService,
  selectHrmsStatus,
} from '@/store/slices/hrmsSlice';

interface HrmsSectionCard {
  count: number;
  description: string;
  section: HrmsSelfServiceSection;
  statusLabel: string;
  title: string;
}

const sectionDescriptions: Record<HrmsSelfServiceSection, string> = {
  attendance: 'Daily attendance readiness and setup coverage.',
  documents: 'Verification-ready employment and education files.',
  jobs: 'Designations and role architecture for the workforce.',
  organization: 'Teams and operating groups across the tenant.',
  people: 'Employee directory for quick mobile lookup.',
  profile: 'Personal, work, and identity information.',
  qualifications: 'Education history and highest qualification.',
  requests: 'Self-service requests and approval status.',
};

const sectionTitles: Record<HrmsSelfServiceSection, string> = {
  attendance: 'Attendance',
  documents: 'Documents',
  jobs: 'Job Catalog',
  organization: 'Organization',
  people: 'People',
  profile: 'Employee Profile',
  qualifications: 'Qualifications',
  requests: 'Requests',
};

export const useHrmsSelfServiceScreenModel = () => {
  const dispatch = useAppDispatch();
  const errorMessage = useAppSelector(selectHrmsErrorMessage);
  const snapshot = useAppSelector(selectHrmsSelfService);
  const status = useAppSelector(selectHrmsStatus);
  const canViewOrganizationEmployees = usePermission('employee:view:org');
  const isRefreshing = status === 'loading';
  const summaryByLabel = useMemo(
    () =>
      new Map(
        snapshot.summaries.map((summary) => [
          summary.label,
          summary,
        ]),
      ),
    [snapshot.summaries],
  );

  const refresh = useCallback(() => {
    dispatch(loadHrmsSelfServiceRequested({ canViewOrganizationEmployees }));
  }, [canViewOrganizationEmployees, dispatch]);

  useEffect(() => {
    if (status === 'idle') {
      refresh();
    }
  }, [refresh, status]);

  const sectionCards = useMemo<HrmsSectionCard[]>(() => {
    const cards: HrmsSectionCard[] = [
      {
        count: snapshot.profile.id ? 1 : 0,
        description: sectionDescriptions.profile,
        section: 'profile',
        statusLabel: snapshot.profile.verificationLabel,
        title: sectionTitles.profile,
      },
      {
        count: snapshot.attendance.length,
        description: sectionDescriptions.attendance,
        section: 'attendance',
        statusLabel: `${summaryByLabel.get('Attendance')?.completed ?? 0} ready`,
        title: sectionTitles.attendance,
      },
      ...(canViewOrganizationEmployees
        ? [
            {
              count: snapshot.people.length,
              description: sectionDescriptions.people,
              section: 'people' as const,
              statusLabel: `${summaryByLabel.get('People')?.total ?? 0} people`,
              title: sectionTitles.people,
            },
          ]
        : []),
      {
        count: snapshot.organization.length,
        description: sectionDescriptions.organization,
        section: 'organization',
        statusLabel: `${summaryByLabel.get('Teams')?.total ?? 0} teams`,
        title: sectionTitles.organization,
      },
      {
        count: snapshot.jobs.length,
        description: sectionDescriptions.jobs,
        section: 'jobs',
        statusLabel: `${summaryByLabel.get('Jobs')?.total ?? 0} roles`,
        title: sectionTitles.jobs,
      },
      {
        count: snapshot.documents.length,
        description: sectionDescriptions.documents,
        section: 'documents',
        statusLabel: `${summaryByLabel.get('Documents')?.completed ?? 0} verified`,
        title: sectionTitles.documents,
      },
      {
        count: snapshot.qualifications.length,
        description: sectionDescriptions.qualifications,
        section: 'qualifications',
        statusLabel: `${summaryByLabel.get('Qualifications')?.completed ?? 0} highlighted`,
        title: sectionTitles.qualifications,
      },
      {
        count: snapshot.requests.length,
        description: sectionDescriptions.requests,
        section: 'requests',
        statusLabel: `${summaryByLabel.get('Requests')?.completed ?? 0} completed`,
        title: sectionTitles.requests,
      },
    ];

    return cards;
  }, [canViewOrganizationEmployees, snapshot, summaryByLabel]);

  const getItemsForSection = useCallback(
    (section: HrmsSelfServiceSection): HrmsSelfServiceItem[] => {
      if (section === 'documents') {
        return snapshot.documents;
      }

      if (section === 'attendance') {
        return snapshot.attendance;
      }

      if (section === 'people') {
        return canViewOrganizationEmployees ? snapshot.people : [];
      }

      if (section === 'organization') {
        return snapshot.organization;
      }

      if (section === 'jobs') {
        return snapshot.jobs;
      }

      if (section === 'qualifications') {
        return snapshot.qualifications;
      }

      if (section === 'requests') {
        return snapshot.requests;
      }

      return [
        {
          detailRows: [
            { label: 'Employee number', value: snapshot.profile.employeeNumber },
            { label: 'Work email', value: snapshot.profile.workEmail },
            { label: 'Phone', value: snapshot.profile.phoneNumber },
            { label: 'Team', value: snapshot.profile.teamName },
            { label: 'Role', value: snapshot.profile.role },
            { label: 'Joining date', value: snapshot.profile.joiningDate },
          ],
          id: snapshot.profile.id || 'employee-profile',
          meta: snapshot.profile.employeeNumber,
          statusLabel: snapshot.profile.verificationLabel,
          statusTone: snapshot.profile.pendingVerificationCount > 0 ? 'warning' : 'success',
          subtitle: snapshot.profile.workEmail,
          title: snapshot.profile.displayName,
        },
      ];
    },
    [canViewOrganizationEmployees, snapshot],
  );

  return {
    canViewOrganizationEmployees,
    errorMessage,
    getItemsForSection,
    isRefreshing,
    refresh,
    sectionCards,
    sectionTitles,
    snapshot,
    status,
  };
};
