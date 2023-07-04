import React, {useEffect, useState, useRef,useMemo, useCallback} from 'react'
import {View, StyleSheet ,FlatList, ScrollView, Button} from 'react-native'
import {Text, useTheme} from 'react-native-paper'
import { createIconSetFromIcoMoon } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Animatable from 'react-native-animatable';
import { GroupBy, GroupBy2, format2 } from '../helpers/Helps'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useIsFocused } from "@react-navigation/native";
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useGlobals } from "../components/contexts/Global";
const Icon = createIconSetFromIcoMoon(
    require('../assets/fonts/selection.json'),
    'IcoMoon',
    'icomoon.ttf'
);

const HistoryScreen = ({navigation}) => {
    const [{currency}] = useGlobals()
    const {colors} = useTheme()
    const [category, setCategory] = useState([])
    const [Transaction, setTransaction] = useState([])
    // variables
     const sheetRef = useRef(null);
     const snapPoints = useMemo(() => [-1,'25%', '50%'], []);
     const [closeBotton, setCloseBotton] = useState(false)
     const isFocuse = useIsFocused()
    useEffect(()=>{
        // getCategory()
        getTransaction()
    },[])
    const getTransaction = async (cat_id = '') => {
        let file_name = "transactions.json"
        var isExist = await FileSystem.getInfoAsync(FileSystem.documentDirectory + file_name);
        if(isExist.exists){
            let queue =  await FileSystem.readAsStringAsync(FileSystem.documentDirectory + file_name);
            let all_data = JSON.parse(queue)
            let queue_cat =  await FileSystem.readAsStringAsync(FileSystem.documentDirectory + 'categories.json');
            let cat_json = JSON.parse(queue_cat)
            const monthOfGroup = GroupBy2(all_data, cat_id, cat_json)
            setTransaction(monthOfGroup)
            setCategory(cat_json)

        }
    }
    const getCategory = async()=>{
        let file_name = "categories.json"
        var isExist = await FileSystem.getInfoAsync(FileSystem.documentDirectory + file_name);
        let all_data = []
        if(isExist.exists){
            let queue =  await FileSystem.readAsStringAsync(FileSystem.documentDirectory + file_name);
            setCategory(JSON.parse(queue))
        }
    }
    const selectCategory =(item)  =>{
        getTransaction(item.id)
        setCloseBotton(false)
    }
    const filter = () => {
        setCloseBotton(true)
        sheetRef.current?.snapTo(1);
    }
    const filterAll = () => {
        getTransaction()
    }
    const _renderItem = ({item,index})=>{
        return (
            <TouchableOpacity onPress={()=> navigation.navigate('DetailMonthSreen', {data: item})}>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent:'space-between', borderBottomColor: '#f0eded', borderBottomWidth: 1, padding: 4}}>
                    <Text style={{ marginLeft: 12, fontSize:16}}>{item.monthOf}</Text>
                    <Text style={{marginRight: 10, fontSize:16, marginTop: 6 , color: item.total_result< 0 ? 'red': '#8BC34A'}}>{format2(item.total_result)}{currency}</Text>
                </View>
            </TouchableOpacity>
        );
    }
 
    const renderItemBottom = useCallback(
        ({ item }) => (
            <View>
                <TouchableOpacity style={{flex: 1, flexDirection: 'row', paddingVertical: 5}} key={item.id.toString()} onPress={()=>selectCategory(item)}>
                    <Icon style={{ marginRight: 20}} name={item.icon} size={24} color={item.color} />
                    <Text style={{color: '#fff', fontSize: 16,marginTop: 4}}>{item.name}</Text>
                </TouchableOpacity>
            </View>
        ),
        []
      );
   

    return (
        <View style={styles.container}>
            <View style={[styles.header,  {backgroundColor: colors.text + "1D",}]}>
                <View style={styles.flexRight}>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
                        <Icon style={{padding: 10}} name="search" size={24} color={colors.text} onPress={() => navigation.navigate('Search')} />
                        <Icon style={{marginLeft: 2, padding: 10}} name="sort-amount-desc" size={24} color={colors.text} onPress={()=> filter()} />
                        <Icon style={{marginLeft: 2, padding: 10}} name="refresh1" size={26} color={colors.text} onPress={()=> filterAll()} />
                    </View>
                </View>
            </View>
            <View>
            <FlatList
                    data={Transaction}
                    renderItem={_renderItem}
                    showsHorizontalScrollIndicator={false }
                    keyExtractor={item => item.monthOf}
                />
            </View>
            {
                closeBotton &&    
                <BottomSheet
                    ref={sheetRef}
                    snapPoints={snapPoints}
                    index={1}
                >
                    <BottomSheetFlatList
                    data={category}
                    keyExtractor={i => i.id.toString()}
                    renderItem={renderItemBottom}
                    contentContainerStyle={styles.contentContainer}
                    />
                </BottomSheet>
            }
         
        </View>

    )
}
const styles= StyleSheet.create({
    container:{
        flex: 1,
    },
    header: {
       height: 50,
    
    },
    flexRight:{
        justifyContent: 'flex-end',
        flexDirection: 'row',
        flex: 1,
    },
    contentContainer: {
        backgroundColor: '#808080',
        padding: 20
      },
      itemContainer: {
        padding: 6,
        margin: 6,
        backgroundColor: '#eee',
      },
})
export default HistoryScreen