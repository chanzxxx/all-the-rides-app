/**
 * @flow
 */

import type {Scooter, ScooterStoreInterface} from "./ScooterStoreInterface";
import {observable, action} from "mobx";
import axios from 'axios';

type KickgoingScooter = Scooter & {
}

export class KickgoingScooterStore implements ScooterStoreInterface {
    @observable scooters: KickgoingScooter[] = [];
    @observable isFetching = false;

    @action
    setFetching(b) {
        this.isFetching = b;
    }

    fetch(lat: number, lng: number, zoomLevel: number) {
        console.log('fetch', {
            lat,lng,zoomLevel
        });

        this.setFetching(true);

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
                // id: item.id
            })));
            return true;
        }).catch(error => {
            return false;
        }).finally(() => {
            this.setFetching(false);
        });
    }

    @action
    setScooters(scooters) {
        console.log('setScooters');
        this.scooters.replace(scooters);
    }

    getIdentifier() {
        return 'kickgoing';
    }

    getName() {
        return '킥고잉';
    }

    getMarkerIcon() {
        return require('../resource/icons/marker/kickgoing_resize.png');
    }

    getAppIcon() {
        return require('../resource/icons/app-icons/kickgoing.png');
    }

    getAppInfo() {
        return {
            android: {
                packageName: 'com.olulo.kickgoing'
            }
        }
    }
}
