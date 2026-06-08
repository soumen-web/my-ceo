export type HrmsStatusTone = 'danger' | 'neutral' | 'success' | 'warning';

export const HRMS_SELF_SERVICE_SECTIONS = [
  'attendance',
  'documents',
  'jobs',
  'organization',
  'people',
  'profile',
  'qualifications',
  'requests',
] as const;

export type HrmsSelfServiceSection = (typeof HRMS_SELF_SERVICE_SECTIONS)[number];

export const isHrmsSelfServiceSection = (
  value: unknown,
): value is HrmsSelfServiceSection =>
  typeof value === 'string' &&
  HRMS_SELF_SERVICE_SECTIONS.includes(value as HrmsSelfServiceSection);

export interface HrmsDetailRow {
  label: string;
  value: string;
}

export interface HrmsVerificationSummary {
  outstandingDocuments: string[];
  pendingCount: number;
  rejectedCount: number;
  unverifiedCount: number;
}

export interface HrmsEmployeeProfile {
  accountStatus: string;
  addressLine: string;
  addressLine2: string;
  aadhaarNumber: string;
  alternatePhoneNumber: string;
  authenticationDate: string;
  bankAccountType: string;
  bankAccountNumber: string;
  bankName: string;
  branchName: string;
  city: string;
  country: string;
  createdAt: string;
  dateOfBirth: string;
  dataClassification: string;
  department: string;
  designation: string;
  effectiveDate: string;
  effectiveTo: string;
  displayName: string;
  employeeNumber: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  employmentType: string;
  employmentStatus: string;
  externalProvider: string;
  firstName: string;
  gender: string;
  grade: string;
  id: string;
  ifscCode: string;
  jobFunction: string;
  jobLevel: string;
  landmark: string;
  lastName: string;
  joiningDate: string;
  lastLoginPlatform: string;
  panNumber: string;
  pendingVerificationCount: number;
  personalEmail: string;
  phoneNumber: string;
  postalCode: string;
  preferredName: string;
  reportingManager: string;
  role: string;
  state: string;
  teamName: string;
  totalExperience: string;
  uanNumber: string;
  updatedAt: string;
  verificationLabel: string;
  verificationSummary: HrmsVerificationSummary;
  voterId: string;
  workEmail: string;
  workLocation: string;
  workMode: string;
  workPhoneNumber: string;
}

export interface HrmsSelfServiceItem {
  detailRows: HrmsDetailRow[];
  id: string;
  meta: string;
  statusLabel: string;
  statusTone: HrmsStatusTone;
  subtitle: string;
  title: string;
}

export interface HrmsSelfServiceSummary {
  completed: number;
  label: string;
  total: number;
}

export interface HrmsSelfServiceSnapshot {
  attendance: HrmsSelfServiceItem[];
  documents: HrmsSelfServiceItem[];
  jobs: HrmsSelfServiceItem[];
  organization: HrmsSelfServiceItem[];
  people: HrmsSelfServiceItem[];
  profile: HrmsEmployeeProfile;
  qualifications: HrmsSelfServiceItem[];
  requests: HrmsSelfServiceItem[];
  summaries: HrmsSelfServiceSummary[];
}

export const createEmptyHrmsEmployeeProfile = (): HrmsEmployeeProfile => ({
  accountStatus: 'Not available',
  addressLine: 'Not available',
  addressLine2: 'Not available',
  aadhaarNumber: 'Not available',
  alternatePhoneNumber: 'Not available',
  authenticationDate: 'Not available',
  bankAccountNumber: 'Not available',
  bankAccountType: 'Not available',
  bankName: 'Not available',
  branchName: 'Not available',
  city: 'Not available',
  country: 'Not available',
  createdAt: 'Not available',
  dateOfBirth: 'Not available',
  dataClassification: 'Not available',
  department: 'Not available',
  designation: 'Not available',
  effectiveDate: 'Not available',
  effectiveTo: 'Not available',
  displayName: 'Employee',
  employeeNumber: 'Not assigned',
  emergencyContactName: 'Not available',
  emergencyContactPhone: 'Not available',
  emergencyContactRelation: 'Not available',
  employmentType: 'Not available',
  employmentStatus: 'Not available',
  externalProvider: 'Not available',
  firstName: 'Not available',
  gender: 'Not available',
  grade: 'Not available',
  id: '',
  ifscCode: 'Not available',
  jobFunction: 'Not available',
  jobLevel: 'Not available',
  landmark: 'Not available',
  lastName: 'Not available',
  joiningDate: 'Not available',
  lastLoginPlatform: 'Not available',
  panNumber: 'Not available',
  pendingVerificationCount: 0,
  personalEmail: 'Not available',
  phoneNumber: 'Not available',
  postalCode: 'Not available',
  preferredName: 'Not available',
  reportingManager: 'Not available',
  role: 'Employee',
  state: 'Not available',
  teamName: 'Workspace team',
  totalExperience: 'Not available',
  uanNumber: 'Not available',
  updatedAt: 'Not available',
  verificationLabel: 'Not verified',
  verificationSummary: {
    outstandingDocuments: [],
    pendingCount: 0,
    rejectedCount: 0,
    unverifiedCount: 0,
  },
  voterId: 'Not available',
  workEmail: 'Not available',
  workLocation: 'Not available',
  workMode: 'Not available',
  workPhoneNumber: 'Not available',
});

export const createEmptyHrmsSelfServiceSnapshot = (): HrmsSelfServiceSnapshot => ({
  attendance: [],
  documents: [],
  jobs: [],
  organization: [],
  people: [],
  profile: createEmptyHrmsEmployeeProfile(),
  qualifications: [],
  requests: [],
  summaries: [
    { completed: 0, label: 'Attendance', total: 0 },
    { completed: 0, label: 'People', total: 0 },
    { completed: 0, label: 'Teams', total: 0 },
    { completed: 0, label: 'Jobs', total: 0 },
    { completed: 0, label: 'Documents', total: 0 },
    { completed: 0, label: 'Qualifications', total: 0 },
    { completed: 0, label: 'Requests', total: 0 },
  ],
});
