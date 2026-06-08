import * as ExpoLocation from 'expo-location';

import type { LoginLocationResult } from './types';

const unavailableLocationResult: LoginLocationResult = {
  coordinates: null,
  permissionState: 'unavailable',
};

const mapPermissionStatus = (
  status: ExpoLocation.PermissionStatus,
): LoginLocationResult['permissionState'] => {
  if (status === ExpoLocation.PermissionStatus.GRANTED) {
    return 'granted';
  }

  if (status === ExpoLocation.PermissionStatus.DENIED) {
    return 'denied';
  }

  return 'undetermined';
};

const getForegroundPermissionStatus = async (): Promise<
  LoginLocationResult['permissionState']
> => {
  const existingPermission = await ExpoLocation.getForegroundPermissionsAsync();

  return mapPermissionStatus(existingPermission.status);
};

const requestForegroundPermissionStatus = async (): Promise<
  LoginLocationResult['permissionState']
> => {
  const currentStatus = await getForegroundPermissionStatus();

  if (currentStatus !== 'undetermined') {
    return currentStatus;
  }

  const requestedPermission = await ExpoLocation.requestForegroundPermissionsAsync();

  return mapPermissionStatus(requestedPermission.status);
};

export const locationService = {
  async requestLoginLocationPermission(): Promise<
    LoginLocationResult['permissionState']
  > {
    return requestForegroundPermissionStatus();
  },
  async captureLoginLocation(): Promise<LoginLocationResult> {
    const servicesEnabled = await ExpoLocation.hasServicesEnabledAsync();

    if (!servicesEnabled) {
      return unavailableLocationResult;
    }

    const permissionState = await getForegroundPermissionStatus();

    if (permissionState !== 'granted') {
      return {
        coordinates: null,
        permissionState,
      };
    }

    const currentLocation = await ExpoLocation.getCurrentPositionAsync({
      accuracy: ExpoLocation.Accuracy.Balanced,
    });

    return {
      coordinates: {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      },
      permissionState: 'granted',
    };
  },
};
