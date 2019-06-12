import type {Scooter, ScooterStoreInterface} from "./ScooterStoreInterface";
import {observable, observe, action} from "mobx";
import KDBush from 'kdbush';

type CombinedScooter = Scooter & {
    providerIdentifier: string,
    providerName: string,
    markerIcon: any
}

export class CombinedScooterStore {
    scooterStores: ScooterStoreInterface[];

    @observable combinedScooters: CombinedScooter[] = [];

    debounceTimer = null;

    constructor(...scooterStores: ScooterStoreInterface[]) {
        this.scooterStores = scooterStores;
        console.log('this.scooterStores', this.scooterStores);

        this.computeScooters();

        this.scooterStores.forEach(scooterStore => {
            scooterStore.scooters.observe((change) => {
                if (this.debounceTimer) {
                    clearTimeout(this.debounceTimer);
                    this.debounceTimer = null;
                }

                this.debounceTimer = setTimeout(() => {
                    this.computeScooters();
                    this.debounceTimer = null;
                }, 200);
            });
        });
    }

    combineScooters() {
        let arr = [];

        this.scooterStores.forEach(scooterStore => {
            arr = arr.concat(scooterStore.scooters.map(scooter => ({
                ...scooter,
                providerIdentifier: scooterStore.getIdentifier(),
                providerName: scooterStore.getName(),
                markerIcon: scooterStore.getMarkerIcon()
            })));
        });

        return arr;
    }

    @action
    computeScooters() {
        this.combinedScooters.replace(this.combineScooters());
    }


}

