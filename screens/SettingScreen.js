import React, {useEffect, useState} from 'react'
import {View, StyleSheet,ScrollView, TouchableOpacity, TextInput } from 'react-native'
import {Text,   Switch, Modal, Portal } from 'react-native-paper'
import * as FileSystem from 'expo-file-system';
import * as Animatable from 'react-native-animatable';
import { useGlobals } from "../components/contexts/Global";
import { useIsDark } from "../components/hooks/useTheme";
import AsyncStorage from '@react-native-community/async-storage';

const SettingScreen = ({navigation}) => {
    const [{  }, dispatch] = useGlobals();
    const isDark = useIsDark();
    const [dark, setIsDark] = useState(true)
    const [currency, setCurrency] = useState('')
    const [visible, setVisible] = useState(false)
    const [visible2, setVisible2] = useState(false)
    const [groupby, setGroupBy] = useState('Month')
    const [ allCurrency , setAllCurency] = useState([
       '$','€', '¥', '£','₩','₹', '៛',  '฿', '₫', '₽', '₱'
    ])
    const [error, setError] = useState(false)
    const _handleDarkThemeChange = () => {
        dispatch({
          type: "switchTheme",
          theme: isDark ? "light" : "dark",
        });
        let save_theme = isDark ? "light" : "dark"
        AsyncStorage.setItem('@my_theme',save_theme)
        setIsDark(!dark)
    };
    useEffect(()=>{
        getCurrency()
        // deleteFile()
    },[])
    const textInputChange = (val) => {
        setCurrency(val)
    }
    const selectCurrency= (val) => {
        setCurrency(val)
    }
    const deleteFile = async () => {
        const doc = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory);
        if(doc != ''){
            doc.map(async (item)=> {
                await FileSystem.deleteAsync(FileSystem.documentDirectory+item)
            })
        }else{
        
        }
    }
    const getCurrency = async () => {
        let get_currency =  await AsyncStorage.getItem('@my_currency')
        if(get_currency != null){
            setCurrency(get_currency)
        }else{
            setCurrency('$')
        }
    }
    const saveCurrency =  async () => {
        try{
            AsyncStorage.setItem('@my_currency',currency)
            dispatch({
                type: "setCurrency",
                currency: currency
            })
        }catch(e){
            console.log(e.message)
        }
        setVisible(!visible)
    }
    return (
        <View style={styles.container}>
            <ScrollView>
                <Text style={{color: '#8BC34A', fontSize: 17, fontWeight: 'bold',marginBottom: 10}}>General Setting</Text>
                <View>
                    <View style={styles.list}>
                        <View style={{flex: 1, justifyContent: 'space-between', flexDirection: 'row'}}>
                            <View>
                                <Text style={{fontSize: 16}}>Theme</Text>
                                <Text style={{fontSize: 12, marginLeft: 3}}>{ !dark ? "Light" : "Dark"}</Text>
                            </View>
                            <Switch onChange={_handleDarkThemeChange} value={isDark}/>
                        </View>
                    </View>
                    <View style={styles.list}>
                        <TouchableOpacity onPress= {()=>setVisible(!visible)}>
                            <Text style={{fontSize: 16}}>Currency</Text>
                            <Text style={{fontSize: 12, marginLeft: 3}}>{currency}</Text>
                        </TouchableOpacity>
                    </View>
                    {/* <View style={styles.list}>
                        <TouchableOpacity onPress= {()=>setVisible(!visible)}>
                            <Text style={{fontSize: 16}}>Group By</Text>
                            <Text style={{fontSize: 12, marginLeft: 3}}>{groupby}</Text>
                        </TouchableOpacity>
                    </View> */}
                </View>
                <Text style={{color: '#8BC34A', fontSize: 17, fontWeight: 'bold',marginBottom: 10}}>Manage</Text>
                <View>
                    <View style={styles.list}>
                        <TouchableOpacity onPress= {()=>  navigation.navigate('allCategories',{screen: 'Categories'}) }>
                            <Text style={{fontSize: 16}}>Manage Category</Text>
                        </TouchableOpacity>
                    </View>
                    {/* <View style={styles.list}>
                        <TouchableOpacity onPress= {()=>setVisible(!visible)}>
                            <Text style={{fontSize: 16}}>Spreadshet export</Text>
                            <Text style={{fontSize: 12, marginLeft: 3}}>Export your record to a spreadsheet</Text>
                        </TouchableOpacity>
                    </View> */}
                    <View style={styles.list}>
                        <TouchableOpacity onPress= {()=>setVisible2(!visible2)}>
                            <Text style={{fontSize: 16}}>About Us</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            <Modal dismissable={false} visible={visible} onDismiss={() => setVisible(!visible) } contentContainerStyle={styles.modal}>
                    <Text style={{fontSize: 22}}>Set Currency</Text>
                    <View style={{height: 96, marginTop: 10}}>
                        <View style={{flex: 1, flexDirection: 'row', alignContent:'stretch', flexWrap: 'wrap'}}>
                            {
                                allCurrency.map((item,index) => 
                                    (
                                        <TouchableOpacity style={{paddingHorizontal: 18, paddingVertical: 10 ,  backgroundColor: item == currency ? '#4CAF50' : '#616161'}} key={item} onPress={()=>selectCurrency(item)}>
                                            <Text>{item}</Text>
                                        </TouchableOpacity>
                                    )
                                )
                            }
                        </View>
                    </View>
                    <View style={{height: 46}}>
                        <TextInput
                            placeholder="Enter your curreny..."
                            style={styles.textInput}
                            placeholderTextColor="#92D050" 
                            keyboardType="numeric"
                            value={currency}
                            onChangeText={ text => textInputChange(text.trim()) }
                        />
                    </View>
                    {
                        error ?
                        <Animatable.View animation="fadeInLeft" duration={500}>
                        <Text style={{color: 'red'}}>Budget is required*</Text>
                        </Animatable.View>
                        : null
                    }
                    <View style={{height: 30, marginTop: 30}}>
                        <View style={{flex: 1, justifyContent: 'space-between', flexDirection: 'row'}}>
                            <TouchableOpacity onPress={() => setVisible(!visible)}>
                                <Text style={{color: '#4CAF50', fontSize: 18}}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => saveCurrency()}>
                                <Text style={{color: '#4CAF50',fontSize: 18}}>Ok</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <Modal dismissable={false} visible={visible2} onDismiss={() => setVisible2(!visible2) } contentContainerStyle={styles.modal2}>
                    <Text style={{fontSize: 22}}>About</Text>
                    <View style={{height: 3, backgroundColor: '#8BC34A', width:60, marginBottom: 10}}></View>

                    <Text style={{fontSize: 18}}>Expense</Text>
                    <Text style={{paddingVertical: 10}} >Version 1.0.0 </Text>

                    <Text style={{marginTop: 10}} >Created and design by </Text>
                    <Text style={{paddingVertical: 5, fontWeight: 'bold'}} >Chhin Vanchhai</Text>
                    <View style={{height: 3, backgroundColor: '#8BC34A', width:100, marginBottom: 10}}></View>
                    <Text style={{paddingVertical: 10}} >Contact: chhinvanchhai2@gmail.com</Text>
                    <View style={{height: 30, marginTop: 30}}>
                        <View style={{flex: 1, justifyContent: 'flex-end', flexDirection: 'row'}}>
                            <TouchableOpacity onPress={() => setVisible2(!visible2)}>
                                <Text style={{color: '#4CAF50',fontSize: 18}}>Ok</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
        </View>

    )
}
const styles = StyleSheet.create({
    container:{
        flex: 1,
        padding: 14
    },
    list: {
        paddingVertical: 8
    },
    modal: {
        margin: 20,
        padding: 10,
        paddingHorizontal: 20,
        backgroundColor: '#616161',
        height: 300
    },
    modal2: {
        margin: 20,
        padding: 10,
        paddingHorizontal: 20,
        backgroundColor: '#616161',
        height: 300
    },
    textInput: {
        flex: 1,
        borderBottomWidth: 1,
        height: 30,
        paddingBottom:0,
        borderBottomColor: '#f2f2f2',
        fontSize: 16,
        color: '#92D050',
    },
})
export default SettingScreen