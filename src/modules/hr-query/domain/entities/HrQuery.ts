export const HR_QUERY_CATEGORIES = [
  'Payroll',
  'Attendance',
  'Leave',
  'Reimbursement',
  'Policy',
  'Documents',
  'General HR Support',
] as const;

export const HR_QUERY_PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'] as const;

export const HR_QUERY_STATUSES = [
  'Open',
  'Pending',
  'In Progress',
  'Waiting for Employee',
  'Approved',
  'Resolved',
  'Closed',
  'Reopened',
] as const;

export type HrQueryCategory = (typeof HR_QUERY_CATEGORIES)[number];
export type HrQueryPriority = (typeof HR_QUERY_PRIORITIES)[number];
export type HrQueryStatus = (typeof HR_QUERY_STATUSES)[number];

export interface HrQueryTimelineItem {
  actor?: string;
  createdAt: string;
  id: string;
  label: string;
  message?: string;
}

export interface HrQuery {
  category: HrQueryCategory;
  createdAt: string;
  description: string;
  id: string;
  latestResponse?: string;
  priority: HrQueryPriority;
  resolutionNote?: string;
  status: HrQueryStatus;
  subject: string;
  timeline: HrQueryTimelineItem[];
  updatedAt: string;
}

export interface CreateHrQueryRequest {
  category: HrQueryCategory;
  description: string;
  priority: HrQueryPriority;
  subject: string;
}

export interface HrQuerySnapshot {
  queries: HrQuery[];
}

export const createEmptyHrQuerySnapshot = (): HrQuerySnapshot => ({
  queries: [],
});
