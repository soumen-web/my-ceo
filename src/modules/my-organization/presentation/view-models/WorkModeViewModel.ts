export interface WorkModeInfoRowViewModel {
  label: string;
  value: string;
}

export interface WorkModeViewModel {
  rows: WorkModeInfoRowViewModel[];
  subtitle: string;
  title: string;
}
