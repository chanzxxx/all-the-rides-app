import type {Scooter, ScooterStoreInterface} from "./ScooterStoreInterface";
import {observable, action} from "mobx";
import axios from 'axios';

type GogoxingScooter = Scooter & {

};

export class GogoxingScooterStore implements ScooterStoreInterface {
    @observable scooters : GogoxingScooter[] = [];
    @observable isFetching: boolean = false;

    @action setFetching(b) {
        this.isFetching = b;
    }

    fetch(latSW, lngSW, latNE, lngNE) {
        const form = new FormData();

        form.append('type', 'SCOOTER');
        form.append('latSW', latSW);
        form.append('lngSW', lngSW);
        form.append('latNE', latNE);
        form.append('lngNE', lngNE);

        this.setFetching(true);
        // todo: lat, lon, zoomLevel 로 bounding box의 북동쪽 남서쪽 좌표를 구해야함
        return axios.post('https://api.gogo-ssing.com/ss/api/mob/search.do', form, {
            headers: {
                Origin: 'https://api.gogo-ssing.com',
                pkgName: 'com.trianglewide.sbike',
                appVersionName: 'com.trianglewide.sbike',
                referer: 'https://api.gogo-ssing.com/ss/web/main/main.do?',
                Cookie: 'JSESSIONID=95B57098DCA18DECDA95B2B049B87C4A.ggs_apiWAS; _ga=GA1.2.431663274.1559918637; _gid=GA1.2.132423412.1559918637; _gat_gtag_UA_107910027_4=1',
            }
        }).then((resp) => {
            console.log('gogoxxing data', resp.data);
            this.setScooters(resp.data.payload.mobList.map(item => ({
                batteryLevel: item.BATTERY_PER,
                serialNumber: item.SERIAL_NO,
                lat: Number.parseFloat(item.LAT),
                lng: Number.parseFloat(item.LON)
            })));
        }).catch(error => {
            console.log('error', error);
        }).finally(() => {
            this.setFetching(false);
        });
    }

    @action
    setScooters(scooters) {
        this.scooters.replace(scooters);
    }

    getIdentifier() {
        return 'gogoxing';
    }

    getName() {
        return '고고씽';
    }

    getMarkerIcon() {
        return require('../resource/icons/marker/gogoxing_resize.png');
    }

    getAppIcon() {
        return require('../resource/icons/app-icons/gogoxing.png');
    }

    getAppInfo() {
        return {
            android: {
                packageName: 'com.trianglewide.sbike'
            }
        }
    }
}
