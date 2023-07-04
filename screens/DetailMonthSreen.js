import React, {useEffect, useState} from 'react'
import {View, StyleSheet, TouchableOpacity, FlatList} from 'react-native'
import {Text, useTheme} from 'react-native-paper'
import { createIconSetFromIcoMoon } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import * as FileSystem from 'expo-file-system';
import { useGlobals } from "../components/contexts/Global";
import {format2} from '../helpers/Helps'
const Icon = createIconSetFromIcoMoon(
    require('../assets/fonts/selection.json'),
    'IcoMoon',
    'icomoon.ttf'
);
const monthNames = ["January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"
];

const DetailMonthSreen = ({navigation,route}) => {
    const {colors} = useTheme()
    const [{currency}] = useGlobals()
    const [Transaction, setTransaction] = useState([])
    const [total, setTotal] = useState(0)
    const [montName , setMonthName] = useState('This Month')
    const data = route.params.data
    const num_month = new Date().getMonth()
    const yearNow = new Date().getFullYear().toString().substr(-2)
    const thisMonth = num_month < 10 ? '0'+ (num_month+1) : (num_month+1)
    const thisMonthOf = thisMonth+'-'+yearNow
    const num_prv_month = num_month === 0 ? 11 : num_month-1

    useEffect(()=>{
        // getTransaction(data.type, data.monthOf, data.category.name)
        // if(thisMonthOf != data.monthOf){
            // setMonthName(monthNames[num_prv_month])
        // }
        setTransaction(data.data)

    },[])
    const getTransaction = async (type, monthOf = '', category) => {
        // let file_name = "transactions.json"
        // var isExist = await FileSystem.getInfoAsync(FileSystem.documentDirectory + file_name);
        // if(isExist.exists){
        //     let queue =  await FileSystem.readAsStringAsync(FileSystem.documentDirectory + file_name);
        //     let getType = ''
        //     let all_data = JSON.parse(queue)
        //     let total_ = 0
        //     if(monthOf != ''){
        //         getType = all_data.filter(item =>{ 
        //             if(item.type === type && item.monthOf === monthOf && item.category.name === category){
        //                 total_ = total_ + parseFloat(item.amount)
        //                 return item
        //             }
        //         })
        //     }else{
        //         getType = all_data.filter(item =>{
        //             if(item.type === type){
        //                 total_ = total_ + parseFloat(item.amount)
        //                 return item
        //             }
        //         })
        //     }
        //     setTotal(total_)
            // setTransaction(getType)
        // }
    }
    const _renderItem = ({item,index})=>{
        return (
            <View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent:'space-between', borderBottomColor: '#f0eded', borderBottomWidth: 1, padding: 4}}>
                    <View>
                        <View style={{flex: 1, flexDirection: 'row'}}>
                            <Icon name={item.category.icon} style={{marginTop: 4}} size={24}  color={item.category.color} />
                            <View>
                                <Text style={{marginLeft: 12, fontSize:16}}>{item.category.name}</Text>
                                <Text style={{marginLeft: 12, fontSize:12}}>{item.date}</Text>
                                {
                                    item.note != '' ?  <Text style={{marginLeft: 12, fontSize:12}}>{item.note}</Text> : null
                                }
                                <Text style={{marginLeft: 12, fontSize:12}}>{item.type}</Text>
                            </View>
                        </View>
                    </View>
                    <Text style={{marginRight: 10, fontSize:16, marginTop: 6}}>{format2(parseFloat(item.amount))}{currency}</Text>
                </View>
            </View>
        );
    }
    return(
        <View style={[styles.container,{backgroundColor: colors.text + "1 D"}]}>
            <View style={[styles.header,  {backgroundColor: colors.text + "3D",}]}>
                <View>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon style={{textAlign: 'left',}} name="chevron-left" size={34} color={colors.text} />
                    </TouchableOpacity>
                </View>
                <View style={{marginTop: 20, flex: 1, flexDirection: 'row'}}>
                    <Animatable.View>
                        <Animatable.Text 
                        animation="fadeInUpBig"
                        style={{marginTop: 5}} 
                        duration={500}
                        >
                            <Icon name='calender' size={50}  color="#8BC34A" />
                        </Animatable.Text>
                    </Animatable.View> 
                    <View>
                        <View>
                            <Text style={{fontSize: 30}}>{data.monthOf ?  monthNames[ data.monthOf < 10 ?   data.monthOf.split("-")[0].substr(1)-1 :  data.monthOf.split("-")[0]-1]  : ''}</Text>
                            <Text style={{fontSize: 14}}>{data.monthOf}</Text>
                            <Text style={{fontSize: 20, marginTop: 8}}>Total: <Text style={{color: '#FF9800',fontSize:18, fontWeight: 'bold'}}>{data.total}</Text>{currency}</Text>
                        </View>
                    </View>
                </View>

            </View>
            <View style={{flex: 1, marginBottom: 20}}>
                <FlatList
                    data={Transaction}
                    renderItem={_renderItem}
                    
                    showsHorizontalScrollIndicator={false }
                    keyExtractor={item => item.id.toString()}
                />
            </View>
        </View>
    )
}

const styles= StyleSheet.create({
    container:{
        flex: 1,
    },
    header: {
       height: 200,
       paddingVertical: 10,
       paddingHorizontal: 10
    }
})
export default DetailMonthSreen
