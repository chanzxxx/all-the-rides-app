/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Image, SafeAreaView, StatusBar} from 'react-native';
import Map from './Map';
import {InnerSideMenu} from "./components/InnerSideMenu";
import SideMenu from './components/SideMenu';
import {observer, Provider} from "mobx-react";
import {KickgoingScooterStore} from "./stores/KickgoingScooterStore";
import {GogoxingScooterStore} from "./stores/GogoxingScooterStore";
import {CombinedScooterStore} from "./stores/CombinedScooterStore";
import {XingxingScooterStore} from "./stores/XingxingScooterStore";
import {SpatialIndexStore} from "./stores/SpatialIndexStore";
import {observable, action} from "mobx";
import {SwingScooterStore} from "./stores/SwingScooterStore";


const kickgoingScooterStore = new KickgoingScooterStore();
const gogoxingScooterStore = new GogoxingScooterStore();
const xingxingScooterStore = new XingxingScooterStore();
const swingScooterStore = new SwingScooterStore();
const combinedScooterStore = new CombinedScooterStore(kickgoingScooterStore, gogoxingScooterStore, xingxingScooterStore, swingScooterStore);
const spatialIndexStore = new SpatialIndexStore(combinedScooterStore);

type Props = {};



@observer
class App extends Component<Props> {
  @observable isMenuOpen = false;

  componentDidMount() {
    console.disableYellowBox = true;
  }

  toggleMenu = () => {
    this.setMenuOpen(!this.isMenuOpen);
    console.log('isMenuOpen', this.isMenuOpen);
  };

  onChangeSideMenu = b => {
    if (b !== this.isMenuOpen) {
      this.setMenuOpen(b);
    }
  };

  @action
  setMenuOpen = (b) => {
    console.log('setMenuOpen', b);
    this.isMenuOpen = b;
  };

  render() {
    return (
      <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#253746" barStyle="light-content" />
        <Provider combinedScooterStore={combinedScooterStore}
                  kickgoingScooterStore={kickgoingScooterStore}
                  gogoxingScooterStore={gogoxingScooterStore}
                  xingxingScooterStore={xingxingScooterStore}
                  swingScooterStore={swingScooterStore}
                  spatialIndexStore={spatialIndexStore}>
          <SideMenu menu={(<InnerSideMenu/>)}
                    isOpen={this.isMenuOpen}
                    onChange={this.onChangeSideMenu}
                    disableGestures={true} >
            <View style={styles.appContainer}>
              <View style={styles.header}>
                <View style={styles.headerLeft}>
                  <TouchableOpacity onPress={this.toggleMenu}>
                    <Image source={require('./resource/ui/menu.png')} style={styles.menuIcon} />
                  </TouchableOpacity>
                </View>
                <View style={styles.headerCenter}>
                  <Text style={styles.headerText}>공유 킥보드 지도</Text>
                </View>
              </View>
              <View style={styles.mapContainer}>
                <Map/>
              </View>
            </View>
          </SideMenu>
        </Provider>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#253746',
    color: '#ffffff'
  },
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
