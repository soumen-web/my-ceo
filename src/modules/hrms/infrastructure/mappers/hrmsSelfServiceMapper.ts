import {
  createEmptyHrmsEmployeeProfile,
  type HrmsEmployeeProfile,
  type HrmsSelfServiceItem,
  type HrmsSelfServiceSnapshot,
  type HrmsStatusTone,
} from '@/modules/hrms/domain/entities/HrmsSelfService';

import type {
  HrmsEnvelopeDto,
  HrmsListEnvelopeDto,
  HrmsRecordDto,
  HrmsSelfServiceSnapshotDto,
} from '../dtos/HrmsSelfServiceDto';

const asRecord = (value: unknown): HrmsRecordDto =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? (value as HrmsRecordDto)
    : {};

const asString = (value: unknown, fallback = 'Not available'): string => {
  if (typeof value === 'string' && value.trim()) {
    return value.trim();
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value);
  }

  return fallback;
};

const asNumber = (value: unknown, fallback = 0): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;

const asBoolean = (value: unknown): boolean => value === true;

const looksLikeOpaqueId = (value: string): boolean =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value) ||
  /^[0-9a-f]{24}$/i.test(value);

const readableString = (value: unknown, fallback = 'Not available'): string => {
  const rawValue = asString(value, '');

  if (!rawValue || looksLikeOpaqueId(rawValue)) {
    return fallback;
  }

  return rawValue;
};

const nodeName = (value: unknown, fallback = 'Not available'): string => {
  if (typeof value === 'string') {
    return readableString(value, fallback);
  }

  const record = asRecord(value);

  return readableString(
    record.name ??
      record.displayName ??
      record.fullName ??
      record.label ??
      record.title ??
      record.value ??
      record.departmentName ??
      record.designationName ??
      record.gradeName ??
      record.jobLevelName ??
      record.stateName ??
      record.countryName,
    fallback,
  );
};

const maskedValue = (value: unknown, fallback = 'Not available'): string => {
  const rawValue = asString(value, '');

  if (!rawValue) {
    return fallback;
  }

  if (/[•*]/.test(rawValue)) {
    return rawValue;
  }

  const visibleSuffix = rawValue.slice(-4);

  return visibleSuffix ? `•••• ${visibleSuffix}` : fallback;
};

const humanize = (value: unknown, fallback = 'Not available'): string => {
  const rawValue = asString(value, '');

  if (!rawValue) {
    return fallback;
  }

  return rawValue
    .toLowerCase()
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(' ');
};

const asStringArray = (value: unknown): string[] =>
  Array.isArray(value)
    ? value
        .map((item) => {
          if (typeof item === 'string') {
            return humanize(item);
          }

          const record = asRecord(item);

          return humanize(
            record.documentType ??
              record.documentCategory ??
              record.name ??
              record.title ??
              record.label,
            '',
          );
        })
        .filter(Boolean)
    : [];

const formatDate = (value: unknown): string => {
  const rawValue = asString(value, '');

  if (!rawValue) {
    return 'Not available';
  }

  const date = new Date(rawValue);

  if (Number.isNaN(date.getTime())) {
    return rawValue;
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

const formatExperienceMonths = (value: unknown): string => {
  const months = asNumber(value, -1);

  if (months < 0) {
    return asString(value);
  }

  if (months < 12) {
    return `${months} ${months === 1 ? 'month' : 'months'}`;
  }

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  return remainingMonths
    ? `${years} ${years === 1 ? 'year' : 'years'} ${remainingMonths} ${
        remainingMonths === 1 ? 'month' : 'months'
      }`
    : `${years} ${years === 1 ? 'year' : 'years'}`;
};

const listData = (envelope: HrmsListEnvelopeDto): HrmsRecordDto[] => {
  if (Array.isArray(envelope.data)) {
    return envelope.data.map(asRecord);
  }

  const data = asRecord(envelope.data);
  const items = data.items;

  return Array.isArray(items) ? items.map(asRecord) : [];
};

const employeePayload = (envelope: HrmsEnvelopeDto): HrmsRecordDto => {
  const data = asRecord(envelope.data);
  const employee = asRecord(data.employee);
  const profile = asRecord(data.profile);
  const user = asRecord(data.user);

  return {
    ...data,
    ...profile,
    ...employee,
    user: Object.keys(user).length ? user : asRecord(employee.user),
  };
};

const userAssignment = (record: HrmsRecordDto): HrmsRecordDto =>
  asRecord(record.userAssignment);

const mappedUser = (record: HrmsRecordDto): HrmsRecordDto =>
  asRecord(userAssignment(record).user ?? record.user);

const mappedTeam = (record: HrmsRecordDto): HrmsRecordDto =>
  asRecord(userAssignment(record).team ?? record.team);

const firstRoleName = (record: HrmsRecordDto): string => {
  const roles = userAssignment(record).roles ?? record.roles;

  if (Array.isArray(roles) && roles.length) {
    const role = asRecord(roles[0]);

    return readableString(role.roleDisplayName ?? role.roleName ?? role.name ?? role.role, 'Employee');
  }

  const role = asRecord(record.role);

  return readableString(
    role.roleDisplayName ?? role.roleName ?? role.name ?? role.role ?? record.designation,
    'Employee',
  );
};

const statusTone = (status: unknown): HrmsStatusTone => {
  const normalizedStatus = asString(status, '').toLowerCase();

  if (normalizedStatus.includes('verified') || normalizedStatus.includes('approved')) {
    return 'success';
  }

  if (normalizedStatus.includes('reject')) {
    return 'danger';
  }

  if (normalizedStatus.includes('pending') || normalizedStatus.includes('inactive')) {
    return 'warning';
  }

  return 'neutral';
};

const mapProfile = (envelope: HrmsEnvelopeDto): HrmsEmployeeProfile => {
  const record = employeePayload(envelope);
  const verificationSummary = asRecord(record.verificationSummary);
  const address = asRecord(record.address ?? record.currentAddress ?? record.permanentAddress);
  const bankDetails = asRecord(record.bankingDetails ?? record.bankDetails ?? record.bankAccount);
  const emergencyContact = asRecord(record.emergencyContact);
  const governmentIds = asRecord(record.governmentIds ?? record.governmentIdentifiers);
  const workDetails = asRecord(record.workDetails ?? record.employmentDetails);
  const team = mappedTeam(record);
  const department =
    workDetails.department ?? record.department ?? team.department ?? record.departmentDetails;
  const designation = workDetails.designation ?? record.designation ?? record.jobDesignation;
  const grade = workDetails.grade ?? record.grade ?? record.payGrade;
  const jobLevel = workDetails.jobLevel ?? record.jobLevel ?? record.level;
  const jobFunction = workDetails.jobFunction ?? record.jobFunction;
  const reportingManager =
    workDetails.reportingManager ??
      record.reportingManager ??
      record.manager ??
      record.supervisor;
  const user = mappedUser(record);
  const pendingCount = asNumber(verificationSummary.pendingCount);
  const rejectedCount = asNumber(verificationSummary.rejectedCount);
  const unverifiedCount = asNumber(verificationSummary.unverifiedCount);
  const outstandingDocuments = asStringArray(verificationSummary.outstandingDocuments);
  const outstandingCount = outstandingDocuments.length;
  const verificationLabel = asBoolean(record.isVerified)
    ? 'Verified'
    : rejectedCount > 0
      ? 'Rejected'
      : pendingCount + unverifiedCount + outstandingCount > 0
        ? 'Pending'
        : 'Protected';
  const displayName =
    asString(record.preferredName, '') ||
    asString(record.displayName, '') ||
    asString(user.displayName ?? user.fullName, '') ||
    [asString(record.firstName, ''), asString(record.lastName, '')]
      .filter(Boolean)
      .join(' ') ||
    'Employee';

  return {
    ...createEmptyHrmsEmployeeProfile(),
    accountStatus: humanize(user.status ?? record.status ?? record.accountStatus),
    addressLine: readableString(
      address.line1 ?? address.addressLine1 ?? record.addressLine1 ?? record.addressLine,
    ),
    addressLine2: readableString(address.line2 ?? address.addressLine2 ?? record.addressLine2),
    aadhaarNumber: maskedValue(
      governmentIds.aadhaarNumber ??
        governmentIds.aadharNumber ??
        record.aadhaarNumber ??
        record.aadhaarCard,
    ),
    alternatePhoneNumber: asString(record.alternatePhoneNumber ?? record.secondaryPhoneNumber),
    authenticationDate: formatDate(
      user.lastAuthenticatedAt ?? user.last_authenticated_at ?? record.lastAuthenticatedAt,
    ),
    bankAccountNumber: maskedValue(
      bankDetails.bankAccount ??
        bankDetails.accountNumber ??
        bankDetails.bankAccountNumber ??
        record.bankAccount ??
        record.bankAccountNumber,
    ),
    bankAccountType: humanize(bankDetails.accountType ?? record.bankAccountType),
    bankName: readableString(bankDetails.bankName ?? record.bankName),
    branchName: readableString(bankDetails.branchName ?? record.branchName),
    city: nodeName(address.cityName ?? record.cityName ?? address.city ?? record.city),
    country: nodeName(
      address.countryName ??
        record.countryName ??
        address.country ??
        record.countryId,
    ),
    createdAt: formatDate(record.createdAt ?? user.createdAt ?? user.created_at),
    dateOfBirth: formatDate(record.dateOfBirth ?? record.dob),
    dataClassification: humanize(record.dataClassification),
    department: nodeName(
      department,
      readableString(record.departmentName ?? team.departmentName ?? team.name),
    ),
    designation: nodeName(designation, readableString(record.designationName)),
    effectiveDate: formatDate(workDetails.effectiveDate ?? record.effectiveDate ?? record.effectiveFrom),
    effectiveTo: formatDate(workDetails.effectiveTo ?? record.effectiveTo),
    displayName,
    employeeNumber: readableString(
      record.employeeNumber ?? record.employeeCode ?? record.employeeIdNumber,
      'Not assigned',
    ),
    emergencyContactName: asString(emergencyContact.name ?? record.emergencyContactName),
    emergencyContactPhone: asString(
      emergencyContact.phoneNumber ?? record.emergencyContactPhone ?? record.emergencyNumber,
    ),
    emergencyContactRelation: asString(
      emergencyContact.relation ?? record.emergencyContactRelation,
    ),
    employmentType: humanize(workDetails.employmentType ?? record.employmentType),
    employmentStatus: humanize(
      workDetails.employmentStatus ?? record.employmentStatus ?? record.employeeStatus,
    ),
    externalProvider: humanize(record.externalProvider),
    firstName: readableString(record.firstName ?? user.firstName ?? user.first_name),
    gender: humanize(record.gender),
    grade: nodeName(grade, readableString(record.gradeName ?? record.payGradeName)),
    id: asString(record.id, ''),
    ifscCode: readableString(bankDetails.ifsc ?? bankDetails.ifscCode ?? record.ifscCode),
    jobFunction: nodeName(jobFunction, readableString(record.jobFunctionName)),
    jobLevel: nodeName(jobLevel, nodeName(grade, readableString(record.jobLevelName))),
    landmark: readableString(address.landmark ?? record.landmark),
    lastName: readableString(record.lastName ?? user.lastName ?? user.last_name),
    joiningDate: formatDate(record.joiningDate),
    lastLoginPlatform: humanize(
      user.lastLoginPlatform ?? user.last_login_platform ?? record.lastLoginPlatform,
    ),
    panNumber: maskedValue(governmentIds.panNumber ?? record.panNumber ?? record.panCard),
    pendingVerificationCount:
      pendingCount + rejectedCount + unverifiedCount + outstandingCount,
    personalEmail: asString(record.personalEmail),
    phoneNumber: asString(record.phoneNumber),
    postalCode: readableString(
      address.postalCode ?? address.pincode ?? address.zipCode ?? record.postalCode ?? record.pincode,
    ),
    preferredName: readableString(
      record.preferredName ??
        record.nickName ??
        record.nickname ??
        record.displayName ??
        user.displayName ??
        user.fullName,
    ),
    reportingManager: nodeName(
      reportingManager,
      readableString(record.reportingManagerName ?? record.managerName ?? record.supervisorName),
    ),
    role: firstRoleName(record),
    state: nodeName(
      address.stateName ?? record.stateName ?? address.state ?? record.state ?? record.stateId,
    ),
    teamName: readableString(team.name ?? team.teamName, 'Workspace team'),
    totalExperience: formatExperienceMonths(
      workDetails.totalExperience ?? record.totalExperience ?? record.workExperienceMonths,
    ),
    uanNumber: maskedValue(governmentIds.uanNumber ?? record.uanNumber ?? record.uan),
    updatedAt: formatDate(record.updatedAt ?? user.updatedAt ?? user.updated_at),
    verificationLabel,
    verificationSummary: {
      outstandingDocuments,
      pendingCount,
      rejectedCount,
      unverifiedCount,
    },
    voterId: maskedValue(governmentIds.voterId ?? record.voterId ?? record.voterCard),
    workEmail: asString(record.workEmail ?? user.email ?? record.email ?? record.personalEmail),
    workLocation: nodeName(workDetails.workLocation ?? record.workLocation),
    workMode: humanize(workDetails.workMode ?? record.workMode),
    workPhoneNumber: asString(record.workPhoneNumber),
  };
};

const mapDocument = (record: HrmsRecordDto): HrmsSelfServiceItem => ({
  detailRows: [
    { label: 'Category', value: humanize(readableString(record.documentCategory, '')) },
    { label: 'File ID', value: asString(record.fileId) },
    { label: 'Uploaded', value: formatDate(record.createdAt) },
    {
      label: 'Verification date',
      value: formatDate(record.verifiedAt ?? record.verifiedOn ?? record.verificationDate),
    },
    { label: 'Notes', value: asString(record.verificationNotes) },
  ],
  id: asString(record.id, `${record.documentType ?? 'document'}`),
  meta: humanize(readableString(record.documentCategory, '')),
  statusLabel: humanize(record.verificationStatus, 'Pending'),
  statusTone: statusTone(record.verificationStatus),
  subtitle: `Uploaded ${formatDate(record.createdAt)}`,
  title: humanize(readableString(record.documentType, 'Employee document'), 'Employee document'),
});

const mapEmployee = (record: HrmsRecordDto): HrmsSelfServiceItem => {
  const assignment = userAssignment(record);
  const team = mappedTeam(record);
  const user = mappedUser(record);
  const displayName =
    asString(record.preferredName, '') ||
    asString(user.displayName, '') ||
    [asString(record.firstName, ''), asString(record.lastName, '')]
      .filter(Boolean)
      .join(' ') ||
    'Employee';

  return {
    detailRows: [
      { label: 'Employee number', value: asString(record.employeeNumber, 'Not assigned') },
      { label: 'Work email', value: asString(record.workEmail ?? user.email) },
      { label: 'Team', value: asString(team.name, 'Not mapped') },
      { label: 'Role', value: firstRoleName(record) },
      { label: 'Status', value: humanize(record.employmentStatus) },
      { label: 'Joining date', value: formatDate(record.joiningDate) },
    ],
    id: asString(record.id, displayName),
    meta: asString(record.employeeNumber, 'Employee'),
    statusLabel: humanize(record.employmentStatus, 'Active'),
    statusTone: statusTone(record.employmentStatus),
    subtitle: asString(assignment.loginEligible) === 'Not available'
      ? asString(record.workEmail ?? user.email)
      : `${asString(record.workEmail ?? user.email)} • Login ready`,
    title: displayName,
  };
};

const mapOrganizationTeam = (record: HrmsRecordDto): HrmsSelfServiceItem => ({
  detailRows: [
    { label: 'Team code', value: asString(record.teamCode ?? record.code) },
    { label: 'Department', value: asString(asRecord(record.department).name) },
    { label: 'Lead', value: asString(record.leadUserId) },
    { label: 'Status', value: record.isActive === false ? 'Inactive' : 'Active' },
  ],
  id: asString(record.id, `${record.teamName ?? record.name ?? 'team'}`),
  meta: asString(record.teamCode ?? record.code, 'Team'),
  statusLabel: record.isActive === false ? 'Inactive' : 'Active',
  statusTone: record.isActive === false ? 'warning' : 'success',
  subtitle: asString(asRecord(record.department).name, 'Organisation team'),
  title: asString(record.teamName ?? record.name, 'Organisation team'),
});

const mapJobDesignation = (record: HrmsRecordDto): HrmsSelfServiceItem => ({
  detailRows: [
    { label: 'Code', value: asString(record.designationCode ?? record.code) },
    { label: 'Grade', value: asString(asRecord(record.grade).name ?? record.gradeId) },
    { label: 'Function', value: asString(asRecord(record.jobFunction).name ?? record.jobFunctionId) },
    { label: 'Status', value: record.isActive === false ? 'Inactive' : 'Active' },
  ],
  id: asString(record.id, `${record.designationName ?? record.name ?? 'designation'}`),
  meta: asString(record.designationCode ?? record.code, 'Designation'),
  statusLabel: record.isActive === false ? 'Inactive' : 'Active',
  statusTone: record.isActive === false ? 'warning' : 'success',
  subtitle: asString(record.description, 'Job architecture'),
  title: asString(record.designationName ?? record.name, 'Designation'),
});

const mapQualification = (record: HrmsRecordDto): HrmsSelfServiceItem => ({
  detailRows: [
    { label: 'Level', value: humanize(record.qualificationLevel) },
    { label: 'Specialization', value: asString(record.specialization) },
    { label: 'Institution', value: asString(record.institutionName) },
    { label: 'Board / University', value: asString(record.boardOrUniversity) },
    { label: 'Passing year', value: asString(record.passingYear) },
    { label: 'Grade', value: asString(record.gradeOrPercentage) },
  ],
  id: asString(record.id, `${record.courseName ?? 'qualification'}`),
  meta: humanize(record.qualificationLevel),
  statusLabel: asBoolean(record.isHighestQualification) ? 'Highest' : 'Saved',
  statusTone: asBoolean(record.isHighestQualification) ? 'success' : 'neutral',
  subtitle: asString(record.institutionName),
  title: asString(record.courseName, 'Qualification'),
});

const mapRequest = (record: HrmsRecordDto): HrmsSelfServiceItem => ({
  detailRows: [
    { label: 'Ticket', value: asString(record.requestTicketNumber) },
    { label: 'Description', value: asString(record.description) },
    { label: 'Created', value: formatDate(record.createdAt) },
    { label: 'Remarks', value: asString(record.actionRemarks) },
  ],
  id: asString(record.id, `${record.requestTicketNumber ?? 'request'}`),
  meta: asString(record.requestTicketNumber, 'Employee request'),
  statusLabel: humanize(record.status, 'Pending'),
  statusTone: statusTone(record.status),
  subtitle: asString(record.description, 'No description provided'),
  title: asString(record.title, 'Employee request'),
});

const mapAttendanceReadiness = (envelope: HrmsEnvelopeDto): HrmsSelfServiceItem[] => {
  const data = asRecord(envelope.data);
  const readiness = asRecord(data.readiness);
  const organization = asRecord(data.organization);
  const location = asRecord(organization.location);
  const workWeek = asRecord(data.workWeek);
  const holidayCalendar = asRecord(data.holidayCalendar);
  const shiftCalendar = asRecord(data.shiftCalendar);
  const missing = readiness.missing;
  const missingItems = Array.isArray(missing) ? missing.map((item) => humanize(item)) : [];
  const isReady = readiness.isReady === true;

  return [
    {
      detailRows: [
        { label: 'Location', value: asString(location.name, 'Not mapped') },
        { label: 'Work week', value: asString(workWeek.name, 'Not mapped') },
        { label: 'Holiday calendar', value: asString(holidayCalendar.name, 'Not mapped') },
        { label: 'Shift calendar', value: asString(shiftCalendar.name, 'Not mapped') },
        {
          label: 'Missing setup',
          value: missingItems.length ? missingItems.join(', ') : 'None',
        },
      ],
      id: 'attendance-readiness',
      meta: 'Attendance setup',
      statusLabel: isReady ? 'Ready' : 'Needs setup',
      statusTone: isReady ? 'success' : 'warning',
      subtitle: isReady
        ? 'Your attendance setup is ready for daily use.'
        : 'Some attendance setup is missing.',
      title: 'Attendance readiness',
    },
  ];
};

const completedCount = (items: HrmsSelfServiceItem[]): number =>
  items.filter((item) => item.statusTone === 'success').length;

export const hrmsSelfServiceMapper = {
  toDomain(snapshot: HrmsSelfServiceSnapshotDto): HrmsSelfServiceSnapshot {
    const attendance = mapAttendanceReadiness(snapshot.attendanceReadiness);
    const documents = listData(snapshot.documents).map(mapDocument);
    const jobs = listData(snapshot.jobDesignations).map(mapJobDesignation);
    const organization = listData(snapshot.organizationTeams).map(mapOrganizationTeam);
    const people = listData(snapshot.employees).map(mapEmployee);
    const qualifications = listData(snapshot.qualifications).map(mapQualification);
    const requests = listData(snapshot.requests).map(mapRequest);

    return {
      attendance,
      documents,
      jobs,
      organization,
      people,
      profile: mapProfile(snapshot.profile),
      qualifications,
      requests,
      summaries: [
        {
          completed: completedCount(attendance),
          label: 'Attendance',
          total: attendance.length,
        },
        {
          completed: completedCount(people),
          label: 'People',
          total: people.length,
        },
        {
          completed: completedCount(organization),
          label: 'Teams',
          total: organization.length,
        },
        {
          completed: completedCount(jobs),
          label: 'Jobs',
          total: jobs.length,
        },
        {
          completed: completedCount(documents),
          label: 'Documents',
          total: documents.length,
        },
        {
          completed: completedCount(qualifications),
          label: 'Qualifications',
          total: qualifications.length,
        },
        {
          completed: completedCount(requests),
          label: 'Requests',
          total: requests.length,
        },
      ],
    };
  },
};
