/**
 * @flow
 */

import type {Scooter, ScooterStoreInterface} from "./ScooterStoreInterface";
import {observable, action} from "mobx";
import axios from 'axios';

type KickgoingScooter = Scooter & {
    id: number,
    serialNumber: string,
    batteryLevel: number,
}

export class KickgoingScooterStore implements ScooterStoreInterface {
    @observable scooters: KickgoingScooter[] = [];

    fetch(lat: number, lng: number, zoomLevel: number) {
        console.log('fetch', {
            lat,lng,zoomLevel
        });

        return axios.get('https://api.kickgoing.io/v2/kickscooters/ready/list', {
            params: {
                lat,
                lng,
                zoom: zoomLevel
            }
        }).then(resp => {
            console.log('data', resp.data);
            this.setScooters(resp.data.kickscooters.map(item => ({
                serialNumber: item.serial_number,
                batteryLevel: item.battery_rate,
                lat: item.lat,
                lng: item.lng,
                id: item.id
            })));
        });
    }

    @action
    setScooters(scooters) {
        this.scooters = scooters;
    }
}
