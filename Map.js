/**
 * @format
 * @flow
 */
import React from 'react';
import {StyleSheet, View, TouchableOpacity, Text, Platform, PermissionsAndroid, Image} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from "react-native-maps";
import {inject, observer} from "mobx-react";
import {KickgoingScooterStore} from "./stores/KickgoingScooterStore";
import {GogoxingScooterStore} from "./stores/GogoxingScooterStore";
import Geolocation from 'react-native-geolocation-service';

type Props = {
    kickgoingScooterStore: KickgoingScooterStore,
    gogoxingScooterStore: GogoxingScooterStore,
};

const styles = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject
    },
    container: {
        display: 'flex',
        flex: 1,
        width: '100%'
    },
    mapContainer: {
        flex: 1,
    },
    searchButton: {
        width: '100%',
        backgroundColor: '#000000',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    searchButtonText: {
        color: '#ffffff',
    },
    searchButtonContainer: {
        height: 40
    },
    markerImage: {
        width: 30,
        height: 30,
    }
});

@inject('kickgoingScooterStore', 'gogoxingScooterStore')
@observer
class Map extends React.Component<Props> {
    mapView: MapView;
    isLoaded = false;

    async componentDidMount() {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.check( PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION );

            if (!granted) {
                const res = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
                    title: '위치정보 권한 요청',
                    message: '지도를 표시하기 위해 위치정보가 필요합니다.'
                });

                if (res !== "granted") {
                    alert('위치정보 권한이 허용되지 않아 위치를 확인 할 수 없습니다.');
                    return;
                }
            }
        }

        Geolocation.watchPosition((coord) => {
            console.log('watchPos', coord);
            this.mapView.setCamera({
                center: {
                    latitude: coord.coords.latitude,
                    longitude: coord.coords.longitude,
                }
            });

            if (!this.isLoaded) {
                this.fetch();
            }
        }, (error) => {
            console.log('error', error);
        }, {
            enableHighAccuracy: true,
            distanceFilter: 10,
            useSignificantChanges: true,
        });
    }

    componentWillDestroy() {
        Geolocation.clearWatch();
    }

    fetch = () => {
        this.mapView.getCamera().then((camera) => {
            console.log('camera', camera);
            this.props.kickgoingScooterStore.fetch(camera.center.latitude, camera.center.longitude, camera.zoom);
        });

        this.mapView.getMapBoundaries().then(boundaries => {
            console.log('boundaries', boundaries);
            this.props.gogoxingScooterStore.fetch(
                boundaries.southWest.latitude,
                boundaries.southWest.longitude,
                boundaries.northEast.latitude,
                boundaries.northEast.longitude
            );
        });
    };

    render() {
        // console.log('scooters', this.props.kickgoingScooterStore.scooters);
        // console.log('gogoxingScooters', this.props.gogoxingScooterStore.scooters);
        return (
            <View style={styles.container}>
                <View style={styles.mapContainer}>
                    <MapView provider={PROVIDER_GOOGLE}
                             style={styles.map}
                             minZoomLevel={15}
                             maxZoomLevel={20}
                             showsUserLocation={true}
                             zoomEnabled={true}
                             ref={ref => this.mapView = ref}>
                        {this.props.kickgoingScooterStore.scooters.map((scooter, index) => (
                            <Marker title="kickgoing"
                                    coordinate={{latitude: scooter.lat, longitude: scooter.lng}}
                                    key={`kickgoing-${index}`}>
                                <Image source={require('./resource/icons/kickgoing_small.png')}
                                       style={styles.markerImage}/>
                            </Marker>
                        ))}
                        {this.props.gogoxingScooterStore.scooters.map((scooter, index) => (
                            <Marker title="gogossing"
                                    coordinate={{latitude: scooter.lat, longitude: scooter.lng}}
                                    key={`gogoxing-${index}`}>
                                <Image source={require('./resource/icons/gogoxing_created.png')}
                                       style={styles.markerImage} />
                            </Marker>
                        ))}
                    </MapView>
                </View>
                <View style={styles.searchButtonContainer}>
                    <TouchableOpacity style={styles.searchButton} onPress={this.fetch}>
                        <Text style={styles.searchButtonText}>여기서 검색</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

export default Map;

