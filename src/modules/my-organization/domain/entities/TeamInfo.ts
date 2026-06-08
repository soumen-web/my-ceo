export interface TeamInfo {
  businessUnit: string;
  department: string;
  legalEntity: string;
  organization: string;
  team: string;
}

export const createEmptyTeamInfo = (): TeamInfo => ({
  businessUnit: '',
  department: '',
  legalEntity: '',
  organization: '',
  team: '',
});
