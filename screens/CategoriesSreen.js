import React ,{useState, useEffect} from 'react'
import {View, FlatList, StyleSheet, TouchableOpacity} from 'react-native'
import {
    useTheme,
    Text,
    Switch
} from 'react-native-paper';
import Close from '../components/navs/Close'
import Rotation from '../components/animations/Rotation'
import * as FileSystem from 'expo-file-system';
import { useIsFocused } from "@react-navigation/native";

import { createIconSetFromIcoMoon } from '@expo/vector-icons';
const Icon = createIconSetFromIcoMoon(
    require('../assets/fonts/selection.json'),
    'IcoMoon',
    'icomoon.ttf'
);

const CategoryScreen = ({navigation,route}) => {
    const isFocused = useIsFocused();
    const add = route.params ? route.params.add : 'one'
    const [refresh, setRefresh] = useState()
    useEffect(()=>{
        getCategory()
    },[add])
    const { colors } = useTheme();
    const [category, setCategory] = useState([])
    const getCategory = async()=>{
        let file_name = "categories.json"
        var isExist = await FileSystem.getInfoAsync(FileSystem.documentDirectory + file_name);
        let all_data = []
        if(isExist.exists){
            let queue =  await FileSystem.readAsStringAsync(FileSystem.documentDirectory + file_name);
            setCategory(JSON.parse(queue))
        }
    }
    const _renderItem = ({item,index})=>{
        return (
            <View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent:'space-between', borderBottomColor: '#f0eded', borderBottomWidth: 1, padding: 8}}>
                    <View style={{ flex: 1, flexDirection: 'row'}}>
                        <Icon style={{textAlign: 'center'}} name={item.icon} size={24} color={item.color} />
                        <Text style={{marginLeft: 12, fontSize:16}}>{item.name}</Text>
                    </View>
                    <TouchableOpacity onPress={()=> navigation.navigate('allCategories',{screen: 'EditCategory',params: {item: item}})}>
                        <Icon  style={{textAlign: 'right',padding: 4}} name='pencil1' size={18} color={colors.text} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
    return (
        <View style={styles.container}>
            <FlatList
                data={category}
                renderItem={_renderItem}
                showsHorizontalScrollIndicator={false }
                keyExtractor={item => item.id.toString()}
            />
            <View style={styles.box_abs}>
                    <TouchableOpacity style={styles.my_btn_round} onPress={() =>  navigation.navigate('allCategories',{screen: 'EditCategory',params: []})}>
                        <Icon 
                            name="plus-outline" 
                            style={{marginTop: 9, marginRight: 7}}
                            color={'#fff'}
                            size={22}
                        />
                </TouchableOpacity>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container:{
        flex: 1,
        padding: 10
    },
    box_abs:{
        position: 'absolute',
        right: 10,
        bottom: 20
    },
    my_btn_round:{
        width: 50,
        height: 50,
        borderRadius: 25,
        padding: 2,
        paddingLeft:14,
        backgroundColor: '#92D050',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
})
export default CategoryScreen
