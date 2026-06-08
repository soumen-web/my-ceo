export interface OrganizationInfoRowViewModel {
  label: string;
  value: string;
}

export interface OrganizationInfoViewModel {
  rows: OrganizationInfoRowViewModel[];
  subtitle: string;
  title: string;
}
