/**
 * @format
 * @flow
 */
import React from 'react';
import {StyleSheet, View, TouchableOpacity, Text, Platform, PermissionsAndroid, Image, ActivityIndicator} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from "react-native-maps";
import {inject, observer} from "mobx-react";
import {observable, action} from "mobx";
import Geolocation from 'react-native-geolocation-service';
import {CombinedScooterStore} from "./stores/CombinedScooterStore";
import {KickgoingScooterStore} from "./stores/KickgoingScooterStore";
import {GogoxingScooterStore} from "./stores/GogoxingScooterStore";
import {XingxingScooterStore} from "./stores/XingxingScooterStore";
import {SwingScooterStore} from "./stores/SwingScooterStore";
import {SpatialIndexStore} from "./stores/SpatialIndexStore";
import {crashlytics} from 'react-native-firebase';

type Props = {
    combinedScooterStore: CombinedScooterStore,
    kickgoingScooterStore: KickgoingScooterStore,
    gogoxingScooterStore: GogoxingScooterStore,
    xingxingScooterStore: XingxingScooterStore,
    swingScooterStore: SwingScooterStore,
    spatialIndexStore: SpatialIndexStore,
};

const styles = StyleSheet.create({
    map: {
        flex: 1,
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
        backgroundColor: '#25282A',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    searchButtonText: {
        color: '#ffffff',
    },
    searchButtonContainer: {
        height: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },
    markerImage: {
        width: 30,
        height: 30,
    }
});

@inject(
    'combinedScooterStore',
    'kickgoingScooterStore',
    'gogoxingScooterStore',
    'xingxingScooterStore',
    'swingScooterStore',
    'spatialIndexStore'
)
@observer
class Map extends React.Component<Props> {
    @observable showMap = false;
    @observable initialCamera = {
        center: {
            latitude: 0,
            longitude: 0
        },
        pitch: 0,
        heading: 0,
        zoom: 18,
        altitude: 1000,
    };

    mapView: MapView;
    markerImages = {};

    @observable mapCustomStyle = {
        marginBottom: 1,
    };

    @action setShowMap(b = true) {
        this.showMap = b;
    }

    @action
    setInitialCameraObject(camera) {
        this.initialCamera = {
            center: {
                ...camera.center
            },
            pitch: camera.pitch,
            heading: camera.heading,
            zoom: camera.zoom,
            altitude: 1000,
        };
    }

    async componentDidMount() {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.check( PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION );

            if (!granted) {
                const res = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
                    title: '위치정보 권한 요청',
                    message: '지도를 표시하기 위해 위치정보가 필요합니다.'
                });

                this.setShowMap(true);

                if (res !== "granted") {
                    alert('위치정보 권한이 허용되지 않아 위치를 확인 할 수 없습니다.');
                    return;
                }
            } else {
                this.setShowMap(true);
            }
        }

        Geolocation.watchPosition((coord) => {
            console.log('watchPos', coord);

            if (!this.mapView || !this.initialCamera) {
                this.setInitialCameraObject({
                    center: {
                        latitude: coord.coords.latitude,
                        longitude: coord.coords.longitude,
                    },
                    pitch: 0,
                    zoom: 18,
                    heading: 0,
                });

                if (Platform.OS === 'ios') {
                    this.setShowMap(true);
                }

                return;
            }

            this.mapView.setCamera({
                center: {
                    latitude: coord.coords.latitude,
                    longitude: coord.coords.longitude,
                },
                zoom: 18,
            });
        }, (error) => {
            console.log('error', error);
        }, {
            enableHighAccuracy: true,
            distanceFilter: 10,
            useSignificantChanges: true,
        });

        this.props.combinedScooterStore.scooterStores.forEach(scooterStore => {
            this.markerImages[scooterStore.getIdentifier()] = (<Image source={scooterStore.getMarkerIcon()} style={styles.markerImage} />);
        });
    }

    componentWillUnmount() {
        Geolocation.clearWatch();
    }

    fetch = () => {
        this.mapView.getCamera().then((camera) => {
            console.log('camera', camera);
            this.props.kickgoingScooterStore.fetch(camera.center.latitude, camera.center.longitude, camera.zoom);
            this.props.xingxingScooterStore.fetch(camera.center.latitude, camera.center.longitude, camera.zoom);
            this.props.swingScooterStore.fetch(camera.center.latitude, camera.center.longitude, camera.zoom);
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

    handleRegionChange = async region => {
        // console.log('regionChange');
        // console.log('region', region);
        // console.log('map boundaries', await this.mapView.getMapBoundaries());
        if (this._regionChangeDebounceTimer) {
            clearTimeout(this._regionChangeDebounceTimer);
            this._regionChangeDebounceTimer = null;
        }

        this._regionChangeDebounceTimer = setTimeout(async () => {
            const boundary = await this.mapView.getMapBoundaries();

            this.props.spatialIndexStore.setCurrentBoundary({
                swLat: boundary.southWest.latitude,
                swLng: boundary.southWest.longitude,
                neLat: boundary.northEast.latitude,
                neLng: boundary.northEast.longitude
            });

            this._regionChangeDebounceTimer = null;
        }, 100);

    };

    renderSearchButton() {
        if (!this.props.combinedScooterStore.isFetching) {
            return (
                <TouchableOpacity style={styles.searchButton} onPress={this.fetch}>
                    <Text style={styles.searchButtonText}>여기서 검색</Text>
                </TouchableOpacity>
            )
        } else {
            return (
                <ActivityIndicator size="large" />
            )
        }
    }

    // 맵에 현재 사용자 위치로 찾아가기 버튼과 확대 축소 버튼이 표시 안되는 문제 해결 위해
    // 강제로 재 랜더링 시킴
    // see: https://github.com/react-native-community/react-native-maps/issues/2010
    forceMapRerender() {
        this.setMapCustomStyle();
    }

    setInitialCamera() {
        Geolocation.getCurrentPosition(pos => {
            console.log('pos', pos);
            console.log('this.mapView', this.mapView);

            if (Platform.OS === 'android') {
                this.mapView.setCamera({
                    center: {
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude,
                    },
                    heading: 0,
                    zoom: 18 // initial zoom level
                });
            } else {
                this.mapView.setCamera({
                    center: {
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude
                    },
                    altitude: pos.coords.altitude,
                    heading: pos.coords.heading
                })
            }

        });
    }

    onMapReady = () => {
        console.log('onMapReady');
        this.forceMapRerender();
        // this.setInitialCamera();
    };

    @action setMapCustomStyle() {
        this.mapCustomStyle = {
            marginBottom: 0
        };
    }

    render() {
        // console.log('render', this.props.combinedScooterStore.combinedScooters);
        // console.log('scooters', this.props.kickgoingScooterStore.scooters);
        // console.log('gogoxingScooters', this.props.gogoxingScooterStore.scooters);
        return (
            <View style={styles.container}>
                <View style={styles.mapContainer}>
                    {this.showMap && (
                        <MapView provider={PROVIDER_GOOGLE}
                                 initialCamera={{...this.initialCamera, center: {
                                     ...this.initialCamera.center
                                 }}}
                                 style={[styles.map, {...this.mapCustomStyle}]}
                                 minZoomLevel={15}
                                 maxZoomLevel={20}
                                 showsUserLocation={true}
                                 zoomEnabled={true}
                                 zoomControlEnabled={true}
                                 onRegionChange={this.handleRegionChange}
                                 showsMyLocationButton={true}
                                 onMapReady={this.onMapReady}
                                 ref={ref => this.mapView = ref}>
                                {this.props.spatialIndexStore.scootersInBoundary.map(scooter => (
                                    <Marker title={scooter.providerName}
                                            coordinate={{latitude: scooter.lat, longitude: scooter.lng}}
                                            key={`${scooter.providerIdentifier}-${scooter.serialNumber}`}
                                            image={scooter.markerIcon}
                                            stopPropagation={true} />
                                ))}
                        {/*{this.props.combinedScooterStore.combinedScooters.map((scooter) => (*/}
                        {/*    <Marker title={scooter.providerName}*/}
                        {/*            coordinate={{latitude: scooter.lat, longitude: scooter.lng}}*/}
                        {/*            key={`${scooter.providerIdentifier}-${scooter.serialNumber}`}*/}
                        {/*            stopPropagation={true}>*/}
                        {/*        {this.markerImages[scooter.providerIdentifier]}*/}
                        {/*    </Marker>*/}
                        {/*))}*/}
                            </MapView>
                        )}
                        </View>
                        <View style={styles.searchButtonContainer}>
                            {this.renderSearchButton()}
                        </View>
                    </View>
        );
    }
}

export default Map;

