/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import Map from './Map';
import {Provider} from "mobx-react";
import {KickgoingScooterStore} from "./stores/KickgoingScooterStore";
import {GogoxingScooterStore} from "./stores/GogoxingScooterStore";

const kickgoingScooterStore = new KickgoingScooterStore();
const gogoxingScooterStore = new GogoxingScooterStore();

type Props = {};

export default class App extends Component<Props> {
  render() {
    return (
        <Provider kickgoingScooterStore={kickgoingScooterStore} gogoxingScooterStore={gogoxingScooterStore}>
          <View style={styles.container}>
            <Map/>
          </View>
        </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
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
