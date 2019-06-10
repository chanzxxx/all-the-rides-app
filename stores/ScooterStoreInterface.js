/**
 * @flow
 */

export type Scooter = {
    lat: number,
    lng: number,
};

export interface ScooterStoreInterface {
    scooters: Array<Scooter>;
    fetch(lat: number, lng: number, zoomLevel: number): Promise;
    fetch(latSW: number, lngSW: number, latNE: number, lngNE: number): Promise;
}
