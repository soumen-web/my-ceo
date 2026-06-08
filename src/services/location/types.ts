export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export type LocationPermissionState =
  | 'denied'
  | 'granted'
  | 'unavailable'
  | 'undetermined';

export interface LoginLocationResult {
  coordinates: LocationCoordinates | null;
  permissionState: LocationPermissionState;
}
