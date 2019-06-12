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
import {InnerSideMenu} from "./components/InnerSideMenu";
import SideMenu from 'react-native-side-menu';
import {observer, Provider} from "mobx-react";
import {KickgoingScooterStore} from "./stores/KickgoingScooterStore";
import {GogoxingScooterStore} from "./stores/GogoxingScooterStore";
import {CombinedScooterStore} from "./stores/CombinedScooterStore";
import {XingxingScooterStore} from "./stores/XingxingScooterStore";
import {SpatialIndexStore} from "./stores/SpatialIndexStore";
import {observable, action} from "mobx";


const kickgoingScooterStore = new KickgoingScooterStore();
const gogoxingScooterStore = new GogoxingScooterStore();
const xingxingScooterStore = new XingxingScooterStore();
const combinedScooterStore = new CombinedScooterStore(kickgoingScooterStore, gogoxingScooterStore, xingxingScooterStore);
const spatialIndexStore = new SpatialIndexStore(combinedScooterStore);

type Props = {};



@observer
class App extends Component<Props> {
  @observable isMenuOpen = false;

  @action
  toggleMenu = () => {
    this.isMenuOpen = !this.isMenuOpen;
    console.log('isMenuOpen', this.isMenuOpen);
  };

  @action
  setMenuOpen = (b) => {
    this.isMenuOpen = b;
  };

  render() {
    return (
        <Provider combinedScooterStore={combinedScooterStore}
                  kickgoingScooterStore={kickgoingScooterStore}
                  gogoxingScooterStore={gogoxingScooterStore}
                  xingxingScooterStore={xingxingScooterStore}
                  spatialIndexStore={spatialIndexStore}>
          <SideMenu menu={(<InnerSideMenu/>)}
                    isOpen={this.isMenuOpen}
                    onChange={this.setMenuOpen}
                    disableGestures={true} >
            <View style={styles.appContainer}>
              <View style={styles.header}>
                <View style={styles.headerLeft}>
                  <TouchableOpacity onPress={this.toggleMenu}>
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
          </SideMenu>
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

export default App;
