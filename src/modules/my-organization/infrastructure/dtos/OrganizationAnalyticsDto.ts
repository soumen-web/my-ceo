export interface OrganizationNodeDto {
  code?: string | null;
  id?: string | null;
  name?: string | null;
}

export interface AnalyticsOrganizationDto {
  businessUnit?: OrganizationNodeDto | null;
  department?: OrganizationNodeDto | null;
  legalEntity?: OrganizationNodeDto | null;
  location?: OrganizationNodeDto | null;
  org?: OrganizationNodeDto | null;
  team?: OrganizationNodeDto | null;
}

export interface AnalyticsReportingManagerDto {
  displayName?: string | null;
  employeeNumber?: string | null;
  employeeRecordId?: string | null;
}

export interface AnalyticsEmployeeDto {
  employeeNumber?: string | null;
  employeeRecordId?: string | null;
  employmentStatus?: string | null;
  preferredName?: string | null;
}

export interface AnalyticsUserDto {
  displayName?: string | null;
  email?: string | null;
  identityId?: string | null;
  status?: string | null;
}

export interface AnalyticsTeamDto extends OrganizationNodeDto {
  department?: OrganizationNodeDto | null;
}

export interface AnalyticsWorkSetupDto {
  holidayCalendar?: OrganizationNodeDto | null;
  shiftCalendar?: OrganizationNodeDto | null;
  workWeek?: OrganizationNodeDto | null;
}

export interface OrganizationAnalyticsResponseDto {
  data?: {
    employee?: AnalyticsEmployeeDto | null;
    employmentType?: OrganizationNodeDto | string | null;
    organization?: AnalyticsOrganizationDto | null;
    reportingManager?: AnalyticsReportingManagerDto | null;
    team?: AnalyticsTeamDto | null;
    user?: AnalyticsUserDto | null;
    workLocation?: OrganizationNodeDto | null;
    workMode?: OrganizationNodeDto | string | null;
    workSetup?: AnalyticsWorkSetupDto | null;
  } | null;
  message?: string;
  statusCode?: number;
  success?: boolean;
}
