/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';
import Map from './Map';
import {Provider} from "mobx-react";
import {KickgoingScooterStore} from "./stores/KickgoingScooterStore";
import {GogoxingScooterStore} from "./stores/GogoxingScooterStore";
import {CombinedScooterStore} from "./stores/CombinedScooterStore";
import {XingxingScooterStore} from "./stores/XingxingScooterStore";
import {SpatialIndexStore} from "./stores/SpatialIndexStore";


const kickgoingScooterStore = new KickgoingScooterStore();
const gogoxingScooterStore = new GogoxingScooterStore();
const xingxingScooterStore = new XingxingScooterStore();
const combinedScooterStore = new CombinedScooterStore(kickgoingScooterStore, gogoxingScooterStore, xingxingScooterStore);
const spatialIndexStore = new SpatialIndexStore(combinedScooterStore);

type Props = {};

export default class App extends Component<Props> {
  render() {
    return (
        <Provider combinedScooterStore={combinedScooterStore}
                  kickgoingScooterStore={kickgoingScooterStore}
                  gogoxingScooterStore={gogoxingScooterStore}
                  xingxingScooterStore={xingxingScooterStore}
                  spatialIndexStore={spatialIndexStore}>
          <View style={styles.appContainer}>
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <TouchableOpacity>
                  <Image source={require('./resource/ui/menu.png')} style={styles.menuIcon} />
                </TouchableOpacity>
              </View>
              <View style={styles.headerCenter}>
                <Text style={styles.headerText}>전국 킥보드 지도</Text>
              </View>
            </View>
            <View style={styles.mapContainer}>
              <Map/>
            </View>
          </View>
        </Provider>
    );
  }
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    display: 'flex',
  },
  header: {
    height: 40,
    backgroundColor: '#253746',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10
  },
  headerLeft: {
    width: 30,
    marginRight: 10
  },
  headerCenter: {
    // alignItems: 'center',
    justifyContent: 'center'
  },
  headerText: {
    color: '#ffffff',
  },
  menuIcon: {
    width: 30,
    height: 30
  },
  mapContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
