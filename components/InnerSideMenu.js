import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, Platform, Linking} from 'react-native';
import {inject} from "mobx-react";
import {CombinedScooterStore} from "../stores/CombinedScooterStore";
import type {AndroidAppInfo, AppInfo} from "../stores/ScooterStoreInterface";
import SendIntentAndroid from 'react-native-send-intent';

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#eeeeee',
        display: 'flex',
        flex: 1
    },

    header: {
        height: 40,
        justifyContent: 'center',
        paddingLeft: 10
    },

    headerText: {
        fontWeight: 'bold'
    },

    linkContainer: {
        flex: 1
    },

    linkItem: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10
    },

    appIconBox: {
        width: 60,
        paddingLeft: 10,
    },

    appNameBox: {
        flex: 1,
    },

    appIcon: {
        width: 40,
        height: 40
    }
});

type Props = {
    combinedScooterStore: CombinedScooterStore
}

@inject('combinedScooterStore')
class InnerSideMenu extends React.Component<Props> {
    async openAndroidAppOrPlaystore(androidAppInfo: AndroidAppInfo) {
        if (await SendIntentAndroid.isAppInstalled(androidAppInfo.packageName)) {
            await SendIntentAndroid.openApp(androidAppInfo.packageName);
        } else {
            Linking.openURL(
                `https://play.google.com/store/apps/details?id=${androidAppInfo.packageName}`
            );
        }
    }

    openAppOrAppStore(appInfo: AppInfo) {
        if (Platform.OS === 'android') {
            this.openAndroidAppOrPlaystore(appInfo.android);
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>앱 바로가기</Text>
                </View>
                <View style={styles.linkContainer}>
                    {
                        this.props.combinedScooterStore.scooterStores.map(store => (
                            <View key={store.getIdentifier()}>
                                <TouchableOpacity style={styles.linkItem} onPress={() => this.openAppOrAppStore(store.getAppInfo())}>
                                    <View style={styles.appIconBox}>
                                        <Image source={store.getAppIcon()}
                                               style={styles.appIcon} />
                                    </View>
                                    <View style={styles.appNameBox}>
                                        <Text>{store.getName()}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        ))
                    }

                </View>
            </View>
        )
    }
}

export { InnerSideMenu };
