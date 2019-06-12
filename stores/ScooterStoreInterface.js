/**
 * @flow
 */

import type {ImageSource} from "react-native/Libraries/Image/ImageSource";

export type Scooter = {
    lat: number,
    lng: number,
    serialNumber: any,
    batteryLevel: number,
};

export type AndroidAppInfo = {
    packageName: string
}

export type AppInfo = {
    ios: {
        appName: string,
        appStoreId: string,
        appStoreLocale: string,
        bundleIdentifier: string,
    }
    android: AndroidAppInfo
}

export interface ScooterStoreInterface {
    getIdentifier(): string;
    getName(): string;
    getMarkerIcon(): ImageSource;
    getAppIcon(): ImageSource;

    scooters: Array<Scooter>;
    isFetching: boolean;

    fetch(lat: number, lng: number, zoomLevel: number): Promise;
    fetch(latSW: number, lngSW: number, latNE: number, lngNE: number): Promise;

    getAppInfo(): AppInfo;
}
