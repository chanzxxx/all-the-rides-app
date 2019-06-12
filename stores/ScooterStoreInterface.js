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

export interface ScooterStoreInterface {
    getIdentifier(): string;
    getName(): string;
    getMarkerIcon(): ImageSource;

    scooters: Array<Scooter>;
    fetch(lat: number, lng: number, zoomLevel: number): Promise;
    fetch(latSW: number, lngSW: number, latNE: number, lngNE: number): Promise;
}
