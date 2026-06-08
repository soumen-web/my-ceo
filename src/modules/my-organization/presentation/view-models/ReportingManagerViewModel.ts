export interface ReportingManagerInfoRowViewModel {
  label: string;
  value: string;
}

export interface ReportingManagerViewModel {
  rows: ReportingManagerInfoRowViewModel[];
  subtitle: string;
  title: string;
}
