export interface WorkLocationInfoRowViewModel {
  label: string;
  value: string;
}

export interface WorkLocationViewModel {
  rows: WorkLocationInfoRowViewModel[];
  subtitle: string;
  title: string;
}
