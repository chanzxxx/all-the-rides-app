/**
 * @flow
 */

import type {Scooter, ScooterStoreInterface} from "./ScooterStoreInterface";
import {observable, action} from "mobx";
import axios from "axios";

export class XingxingScooterStore implements ScooterStoreInterface {
    @observable scooters: Scooter[] = [];

    fetch(lat, lng, zoomLevel) {
        return axios.get('https://api.honeybees.co.kr/api-xingxing/v1/scootersforapp', {
            params: {
                latitude: lat,
                longitude: lng
            },
            headers: {
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImF1dGhJZCI6ImhvbmV5YmVlcyIsInVzZXJJZCI6ImhvbmV5YmVlcyIsInJvbGVzIjpbImFwcHhpbmd4aW5nIl19LCJpYXQiOjE1NTUzMzQ3MjMsImV4cCI6ODY1NTU1MzM0NzIzfQ.br5PT0s_vkFFs24Dxv0acPeQizg_TpXtkdEaWRgkSMw',
                'user-agent': 'okhttp/3.12.1',
            }
        }).then(resp => {
            // console.log('resp.data', resp.data);
            this.setScooters(resp.data.scooters.map(raw => ({
                lng: raw.deviceStatus.location.coordinates[0],
                lat: raw.deviceStatus.location.coordinates[1],
                serialNumber: raw._id,
                batteryLevel: raw.deviceStatus.battery
            })));
        });
    }

    @action
    setScooters(scooters) {
        this.scooters.replace(scooters);
    }

    getIdentifier() {
        return 'xingxing';
    }

    getMarkerIcon() {
        return require('../resource/icons/xingxing_resize.png');
    }

    getName() {
        return '씽씽';
    }
}
