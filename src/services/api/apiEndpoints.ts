const AUTH_API_ROOT = 'v1/auth';
const ANALYTICS_API_ROOT = 'v1/analytics';
const ATTENDANCE_API_ROOT = 'v1/attendance';
const EMPLOYEE_API_ROOT = 'v1';
const JOB_ARCHITECTURE_API_ROOT = 'v1/job-architecture';
const LEAVE_API_ROOT = 'v1/leave';
const ORGANISATION_API_ROOT = 'v1/organisation';
const PAYROLL_API_ROOT = 'v1/payroll';
const USER_API_ROOT = 'v1/user';

export const API = {
  auth: {
    login: `${AUTH_API_ROOT}/login`,
    otp: {
      request: `${AUTH_API_ROOT}/otp/request`,
      verify: `${AUTH_API_ROOT}/otp/verify`,
    },
    refresh: `${AUTH_API_ROOT}/refresh-token`,
  },
  myOrganization: {
    analytics: `${ANALYTICS_API_ROOT}/my-organization`,
  },
  hrmsSelfService: {
    attendanceReadiness: `${ANALYTICS_API_ROOT}/my-attendance-readiness`,
    documents: `${EMPLOYEE_API_ROOT}/me/employee-documents`,
    employees: `${EMPLOYEE_API_ROOT}/employees`,
    jobDesignations: `${JOB_ARCHITECTURE_API_ROOT}/designations`,
    organizationTeams: `${ORGANISATION_API_ROOT}/teams`,
    profile: `${AUTH_API_ROOT}/me`,
    qualifications: `${EMPLOYEE_API_ROOT}/me/employee-qualifications`,
    requests: `${EMPLOYEE_API_ROOT}/me/employee-requests`,
  },
  hrQuery: {
    requestById: (requestId: string) => `${EMPLOYEE_API_ROOT}/me/employee-requests/${requestId}`,
    requests: `${EMPLOYEE_API_ROOT}/me/employee-requests`,
  },
  attendance: {
    day: (date: string) => `${ATTENDANCE_API_ROOT}/me/days/${date}`,
    history: `${ATTENDANCE_API_ROOT}/me/history`,
    punch: `${ATTENDANCE_API_ROOT}/me/punches`,
    snapshot: `${ATTENDANCE_API_ROOT}/me/overview`,
    sync: `${ATTENDANCE_API_ROOT}/me/sync`,
  },
  leave: {
    apply: `${LEAVE_API_ROOT}/me/applications`,
    calendar: `${LEAVE_API_ROOT}/me/calendar`,
    detail: (leaveId: string) => `${LEAVE_API_ROOT}/me/applications/${leaveId}`,
    history: `${LEAVE_API_ROOT}/me/history`,
    snapshot: `${LEAVE_API_ROOT}/me/overview`,
    sync: `${LEAVE_API_ROOT}/me/sync`,
  },
  payroll: {
    cycle: (cycleId: string) => `${PAYROLL_API_ROOT}/me/cycles/${cycleId}`,
    snapshot: `${PAYROLL_API_ROOT}/me/overview`,
  },
  user: {
    account: USER_API_ROOT,
    profileById: (userId: string) => `${USER_API_ROOT}/${userId}`,
  },
} as const;
