export interface WorkLocationInfo {
  businessUnit: string;
  department: string;
  location: string;
  locationCode: string;
  team: string;
}

export const createEmptyWorkLocationInfo = (): WorkLocationInfo => ({
  businessUnit: '',
  department: '',
  location: '',
  locationCode: '',
  team: '',
});
