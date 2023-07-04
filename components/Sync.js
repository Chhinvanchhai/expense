import React, {useEffect, useState} from 'react';
import * as FileSystem from 'expo-file-system';
import {  Overlay } from 'react-native-elements';
import axios from 'react-native-axios';
import { View, StyleSheet ,ActivityIndicator,Text } from 'react-native';

const SyncContext = React.createContext();
const  SyncProvider = (props) => {
    const toggleOverlay = () => {
        setVisible(!visible);
    };
    const [visible, setVisible] = React.useState(false);
    const  SyncData = async () => {
        var meter = ''
        setVisible(true);
        await axios.get(`http://192.168.0.48:4000/api/sql/meter`)
        .then(res => {
          meter = res.data
          setVisible(false);
        })
        await FileSystem.writeAsStringAsync(FileSystem.documentDirectory + `meter_temps.json`, JSON.stringify(meter));
      }
    return (
        <SyncContext.Provider
            value={{
                SyncData
            }}
        >
            {props.children}
            <Overlay isVisible={visible} onBackdropPress={toggleOverlay}  fullScreen={true} >
                <View style={styles.overlay}>
                    <Text>Syncing Data!</Text>
                    <ActivityIndicator  size="large" color="#00ff00" />
                </View>
            </Overlay>
        </SyncContext.Provider>
    )
}
const styles = StyleSheet.create({
    overlay: {
        position: "absolute",
        top: 300,
        zIndex: 100,
        left: 130
    },
    box_overly:{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.2)'
    }
});

export {SyncProvider,SyncContext};
