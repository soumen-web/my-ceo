export interface TeamInfoRowViewModel {
  label: string;
  value: string;
}

export interface TeamViewModel {
  rows: TeamInfoRowViewModel[];
  subtitle: string;
  title: string;
}
