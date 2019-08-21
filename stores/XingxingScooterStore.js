/**
 * @flow
 */

import type {AppInfo, Scooter, ScooterStoreInterface} from "./ScooterStoreInterface";
import {observable, action} from "mobx";
import axios from "axios";

export class XingxingScooterStore implements ScooterStoreInterface {
    @observable scooters: Scooter[] = [];
    @observable isFetching = false;

    @action setFetching(b) {
        this.isFetching = b;
    }

    fetch(lat, lng, zoomLevel) {
        this.setFetching(true);
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

            return true;
        }).catch(error => {
            return false;
        }).finally(() => {
            this.setFetching(false);
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
        return require('../resource/icons/marker/xingxing_resize.png');
    }

    getName() {
        return '씽씽';
    }

    getAppIcon() {
        return require('../resource/icons/app-icons/xingxing.png');
    }

    getAppInfo(): AppInfo {
        return {
            ios: {
                appName: '씽씽-라이프-모빌리티',
                appStoreId: 1460221520,
                appStoreLocale: 'kr',
                bundleIdentifier: ''
            },
            android: {
                packageName: 'com.xingxingapp'
            }
        }
    }
}
