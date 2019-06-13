import {CombinedScooterStore} from "./CombinedScooterStore";
import {computed, observable, action} from "mobx";
import type {Scooter} from "./ScooterStoreInterface";

type Boundary = {
    swLat: number,
    swLng: number,
    neLat: number,
    neLng: number,
}

export class SpatialIndexStore {
    // spatialIndex: KDBush;

    combinedScooterStore: CombinedScooterStore;

    @observable
    currentBoundary: Boundary;

    constructor(combinedScooterStore: CombinedScooterStore) {
        this.combinedScooterStore = combinedScooterStore;
        // combinedScooterStore.combinedScooters.observe(() => {
        //     this.spatialIndex = new KDBush(
        //         combinedScooterStore.combinedScooters,
        //         item => item.lat,
        //         item => item.lng,
        //         64,
        //         Float64Array
        //     );
        // });
    }

    @action
    setCurrentBoundary(boundary: Boundary) {
        this.currentBoundary = boundary;
    }

    @computed get scootersInBoundary(): Scooter[] {
        if (!this.currentBoundary) {
            return [];
        }

        return this.combinedScooterStore.combinedScooters.filter(scooter =>
            scooter.lat >= this.currentBoundary.swLat - 0.0001
            && scooter.lat <= this.currentBoundary.neLat + 0.0001
            && scooter.lng >= this.currentBoundary.swLng - 0.0001
            && scooter.lng <= this.currentBoundary.neLng + 0.0001
        );
    }

}
