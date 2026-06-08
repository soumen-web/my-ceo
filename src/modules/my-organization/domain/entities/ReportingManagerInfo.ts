export interface ReportingManagerInfo {
  displayName: string;
  employeeNumber: string;
  employeeRecordId: string;
}

export const createEmptyReportingManagerInfo = (): ReportingManagerInfo => ({
  displayName: '',
  employeeNumber: '',
  employeeRecordId: '',
});
