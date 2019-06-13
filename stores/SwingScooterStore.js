import type {Scooter, ScooterStoreInterface} from "./ScooterStoreInterface";
import axios from 'axios';
import {observable, action} from "mobx";

export class SwingScooterStore implements ScooterStoreInterface {
    @observable scooters: Scooter[] = [];

    @observable isFetching = false;

    @action setFetching(b = true) {
        this.isFetching = b;
    }

    fetch(lat, lng, zoomLevel) {
        this.setFetching();

        return axios.post('https://restful.theswing.co.kr/ride/scooter_list', {
            range: "80000",
            lat: `${lat}`,
            lng: `${lng}`
        }, {
            headers: {
                'user-agent': 'Dalvik/2.1.0 (Linux; U; Android 7.0; SM-G920K Build/NRD90M)'
            }
        }).then(resp => {
            console.log('swing resp', resp.data);
            this.setScooters(resp.data.data.map(item => ({
                lat: parseFloat(item.lat),
                lng: parseFloat(item.lng),
                serialNumber: item.imei,
                batteryLevel: null
            })));
        }).finally(() => {
            this.setFetching(false);
        });
    }

    @action setScooters(scooters) {
        console.log('swing scooters', scooters);
        this.scooters.replace(scooters);
    }

    getIdentifier() {
        return 'swing';
    }

    getName() {
        return '스윙';
    }

    getMarkerIcon() {
        return require('../resource/icons/marker/swing_resize.png');
    }

    getAppIcon() {
        return require('../resource/icons/app-icons/swing.png');
    }

    getAppInfo() {
        return {
            android: {
                packageName: 'com.co.swing'
            }
        };
    }

}
