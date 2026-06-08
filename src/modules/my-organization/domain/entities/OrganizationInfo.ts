export interface OrganizationInfo {
  businessUnit: string;
  department: string;
  email: string;
  employeeName: string;
  employeeNumber: string;
  employmentStatus: string;
  legalEntity: string;
  location: string;
  organization: string;
  role: string;
  team: string;
}

export const createEmptyOrganizationInfo = (): OrganizationInfo => ({
  businessUnit: '',
  department: '',
  email: '',
  employeeName: '',
  employeeNumber: '',
  employmentStatus: '',
  legalEntity: '',
  location: '',
  organization: '',
  role: '',
  team: '',
});
