import React from 'react'
import {View , Text, StyleSheet} from 'react-native'
import { BlurView } from "expo-blur";
import Close from '../components/navs/Close'
import {
    Avatar,
    Button,
    Divider,
    Switch,
    Title,
    useTheme,
  } from "react-native-paper";

const Profile = ()=> {
    return(
        <BlurView intensity={300} style={[StyleSheet.absoluteFill, styles.nonBlurredContent]}>
            <View style={{height: 45,backgroundColor: 'blue'}}>
                <Close position="right" />
            </View>
            <View style={styles.headerContainer}>
                <Avatar.Text label={'chhai'} />
                <View style={{ marginLeft: 25 }}>
                <Title>ddd</Title>
                </View>
            </View>
            <View>
                <Text>This Profile scree</Text>
            </View>
        </BlurView>
    )
}
const styles = StyleSheet.create({
    telescope: {
      zIndex: 0,
      position: "absolute",
      top: 50,
      right: 20,
      opacity: 0.1,
    },
    headerContainer: {
      alignItems: "center",
      justifyContent: "flex-start",
      marginTop: 30,
      marginHorizontal: 20,
      flexDirection: "row",
    },
    headerHeadline: {
      fontWeight: "bold",
      fontSize: 30,
    },
    box_abs:{
        position: 'absolute',
        right: 5,
        bottom: 10
      },
    my_btn_round:{
        width: 50,
        height: 50,
        borderRadius: 25,
        padding: 4,
        paddingLeft:15,
        backgroundColor: '#163287',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
   
  });
export default Profile