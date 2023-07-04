import React, {useState, useEffect} from 'react'
import {View,StyleSheet,Dimensions, TouchableOpacity, FlatList, Animated} from 'react-native'
import { MaterialCommunityIcons,FontAwesome5, Feather,Fontisto } from '@expo/vector-icons'; 
import DropDownPicker from 'react-native-dropdown-picker';
import ScrollViewFadeFirst from '../components/containers/ScrollViewFadeFirst'
import ShadowHeadline from "../components/paper/ShadowHeadline";
import {
    Divider,
    ProgressBar,
    Subheading,
    useTheme,
    Text
} from "react-native-paper";
import MainNav from '../components/navs/MainNav'
import { SafeAreaView } from 'react-native';
import * as FileSystem from 'expo-file-system';
import {Picker} from '@react-native-picker/picker';
import { GroupByCategory , format2} from '../helpers/Helps'

import { createIconSetFromIcoMoon } from '@expo/vector-icons';
const Icon = createIconSetFromIcoMoon(
    require('../assets/fonts/selection.json'),
    'IcoMoon',
    'icomoon.ttf'
  );
const width = Dimensions.get('window').width;
const monthNames = ["January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"
];
import {AdMobInterstitial} from "expo-ads-admob";

import { useGlobals } from "../components/contexts/Global";



const Overviews = ({navigation,route}) => {
    const { colors } = useTheme();
    const [{currency}] = useGlobals()
    const [selecedMonth, setSelecedMonth] = useState('')

    const num_month = new Date().getMonth()
    const yearNow = new Date().getFullYear().toString().substr(-2)
    const thisMonth = num_month < 10 ? '0'+ (num_month+1) : (num_month+1)
    const thisMonthOf = thisMonth+'-'+yearNow
    const [monthOf, setMonthOf] = useState(thisMonthOf)
    
    const num_prv_month = num_month === 0 ? 11 : num_month-1
    const [month, setMonth] = useState(monthNames[num_month])
    const [prvMonth, setPrvMount] = useState(monthNames[num_prv_month])
    const [isBack , setIsBack] = React.useState(true)
    const [flipAnimate] = React.useState(new Animated.Value(0))
    const [type , setType] = useState('expense')
    const [maxNumber , setMaxAmount] = useState(10)
    const [ads, setAds] = useState(false)
  
   
    const [mostExpense, setMostExpense] = useState('')
    const [total, setTotal] = useState(0)

    const [Transaction, setTransaction] = useState([])
    const ex = route.params ? route.params.ex : 'one'
    useEffect(()=>{
        getTransaction(type,monthOf)
        if(!ads){
            Ads()
        }
    },[ex])
    const Ads = async()=>{
        await AdMobInterstitial.setAdUnitID('ca-app-pub-9760921990958190/6288563216'); // Test ID, Replace with your-admob-unit-id
        await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true});
        await AdMobInterstitial.showAdAsync();
        setAds(true)
    }

    const getTransaction = async (type, monthOf = '') => {
            let file_name = "transactions.json"
            var isExist = await FileSystem.getInfoAsync(FileSystem.documentDirectory + file_name);
            if(isExist.exists){
                let queue =  await FileSystem.readAsStringAsync(FileSystem.documentDirectory + file_name);
                let queue_cat =  await FileSystem.readAsStringAsync(FileSystem.documentDirectory + "categories.json");
                let all_data = JSON.parse(queue)
                const categoryGroup = GroupByCategory(all_data, monthOf, type, queue_cat)
                setTransaction(categoryGroup)
                setMaxAmount(categoryGroup.maxNum)
                setTotal(categoryGroup.allTotal)
            }
    }
    const CardClick = ()=> {       
        if(isBack == true){
            Animated.spring(flipAnimate,{
                toValue: 0,
                useNativeDriver: true,
                friction: 8,
                tension: 10
            }).start()
            getTransaction('expense',monthOf)
            setType('expense')
        }else{
            Animated.spring(flipAnimate,{
                toValue: 180,
                useNativeDriver: true,
                friction: 8,
                tension: 10
            }).start()
            getTransaction('income',monthOf)
            setType('income')
        }
        setIsBack(!isBack)
    
    }
    const fontInterpolate = flipAnimate.interpolate({
        inputRange: [0, 180],
        outputRange: ["0deg", "180deg"],
    });
    const backInterpolate = flipAnimate.interpolate({
        inputRange: [0, 180],
        outputRange: ["180deg", "360deg"],
    });
    const selectMonthChange = (valMonth)=> {
        setSelecedMonth(valMonth)
        const num_prv_month = num_month === 0 ? 12 :  num_month < 10  ? '0'+ num_month : num_month
        let m = ''
        if(valMonth == monthNames[num_month]){
           m = thisMonth+"-"+yearNow
        }else{
            let checkYear = ''
            if(num_month == 0){
               checkYear = yearNow-1 
            }else{
                checkYear = yearNow
            }
            m = num_prv_month+"-"+checkYear
        }
        setMonthOf(m)
        getTransaction(type,m)
    }
    const RightButton = (
        <Icon
          onPress={() => navigation.navigate("SettingScreen")}
          name="cogs"
          color={colors.text}
          size={30}
          style={{ opacity: 1 ,padding: 12}}
        />
      );
    const Header = (
        <View>
            <MainNav rightButton={RightButton} />
            <View style={[styles.headerContainer]}>
                <View style={{ borderBottomColor: '#8BC34A', borderBottomWidth: 2}}>
                    <Picker
                        selectedValue={selecedMonth}
                        mode="dropdown"
                        style={{ height: 50, width: 200 , color: '#8BC34A' }}
                        onValueChange={(itemValue, itemIndex) =>
                            selectMonthChange(itemValue)
                        }>
                        <Picker.Item style={{ fontSize: 20}}   label="This Month" value={month} />
                        <Picker.Item style={{ fontSize: 20}}   label={prvMonth} value={prvMonth} />
                    </Picker>
                </View>
            </View>
            <Divider />
        </View>
    );

    const renderTran =({item}) =>{
        return(
        <TouchableOpacity style={{height: 60}} onPress ={() => navigation.navigate('Detail',{data: item, monthOf: monthOf, type: type})}>
            <View style={{flex: 1,flexDirection: 'row'}}>
                <View style={{width: 50}}>
                    <Icon name={item.icon} size={30} style={{marginTop: 6}} color={item.color} />
                </View>
                <View>
                    <View style={{height: 20}}>
                        <View style={{flex: 1, justifyContent: 'space-between', flexDirection: 'row'}}>
                            <Text style={colors.text}>{item.category}</Text>
                            <Text> {format2(item.total)}{currency}</Text>
                        </View>
                    </View>
                    <ProgressBar progress={item.total / maxNumber}  style={{height: 8, borderRadius: 3, marginTop: 6,  width: width*1-78,}}  color={item.color} />
                </View>
            </View>
        </TouchableOpacity>
        )
    }
    return(

            <View style={styles.container}>
                <View style={{height: 100}}>
                    <View>
                        <MainNav rightButton={RightButton} />
                        <View style={{ borderBottomColor: '#8BC34A', borderBottomWidth: 2, marginTop: 40, marginHorizontal: 10}}>
                            <Picker
                                selectedValue={selecedMonth}
                                mode="dropdown"
                                style={{ height: 50, width: 340 , color: '#8BC34A' }}
                                onValueChange={(itemValue, itemIndex) =>
                                    selectMonthChange(itemValue)
                                }>
                                <Picker.Item style={{ fontSize: 20}}   label="This Month" value={month} />
                                <Picker.Item style={{ fontSize: 20}}   label={prvMonth} value={prvMonth} />
                            </Picker>
                        </View>
                    </View>
                </View>
                
                    <View >
                        <TouchableOpacity onPress={()=> CardClick()}>
                            <View style={{position: 'relative',  width: width*1-78, height: 230 }}>
                                <Animated.View  style={[styles.frontCard,  styles.Card,  {   transform: [ {  rotateY: fontInterpolate  }, ] } ] }  >
                                        <View >
                                            <Text style={{fontSize: 22, borderBottomColor: '#fff', borderBottomWidth: 2 ,marginBottom: 10}}>Expense</Text>
                                            <Text style={{fontSize: 18, paddingVertical: 5,textAlign: 'center'}}>Expense on 
                                              <Text style={{fontWeight: 'bold',color: '#000', fontSize: 18}}> {monthOf}</Text>
                                            </Text>
                                            <Text style={{fontSize: 18, paddingVertical: 5,textAlign: 'center'}}>Total of expense 
                                                
                                            </Text>
                                            <Text style={{color: '#4fd65d', fontWeight: 'bold',fontSize: 34, textAlign: 'center'}}>{format2(total)}{currency}</Text>
                                        </View>
                                </Animated.View>
                                <Animated.View  style={ [  styles.backCard, styles.Card,{   transform: [{ rotateY:backInterpolate  },]  } ] } >
                                    <View>
                                        <Text style={{fontSize: 22, borderBottomColor: '#fff', borderBottomWidth: 2 }}>Income</Text>
                                        <Text style={{fontSize: 18, paddingVertical: 5,textAlign: 'center'}}>Income on 
                                            <Text style={{fontWeight: 'bold',color: '#000', fontSize: 18}}> {monthOf}</Text>
                                        </Text>
                                        <Text style={{fontSize: 18, paddingVertical: 5,textAlign: 'center'}}>Total of income 
                                            
                                        </Text>
                                        <Text style={{color: '#009688', fontWeight: 'bold',fontSize: 34, textAlign: 'center'}}>{format2(total)}{currency}</Text>
                                    </View>
                                </Animated.View>
                            </View>
                        </TouchableOpacity>
                
                    </View>
                <View style={{flex: 1}}>
                        <FlatList
                            data={Transaction.cat}
                            nestedScrollEnabled={true}
                            renderItem={renderTran}
                            keyExtractor={item => item.category}
                        />
                </View>
                <View style={styles.box_abs}>
                    <TouchableOpacity style={styles.my_btn_round} onPress={() => navigation.navigate('AddExpense')}>
                        <Icon 
                            name="plus-outline" 
                            style={{marginTop: 6, marginRight: 7}}
                            color={'#fff'}
                            size={20}
                        />
                    </TouchableOpacity>
                </View>
            </View>
    
    )
}
export default Overviews

const styles =  StyleSheet.create({
    container: {
        flex: 1, 
        marginHorizontal: 10,
    },
    bar: {
        width: width*1-78,
        borderRadius: 3,
        backgroundColor: 'grey',
        height: 8,
        position: 'relative',
        marginVertical: 7
    },
    bar_used: {
        width: width*.6-78,
        borderRadius: 3,
        backgroundColor: 'blue',
        height: 8,   
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    exp: {
        fontSize: 40
    },
    backgroundConstellation: {
        zIndex: 1,
        position: "absolute",
        top: 300,
        left: 20,
        opacity: 0.05,
    },
    headerContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 20,
        marginVertical: 20,
    },
    headerHeadline: {
        fontWeight: "bold",
        fontSize: 30,
        lineHeight: 34,
        marginTop: 20,
    },
    defaultContainer: {
        marginHorizontal: 20,
        marginTop: 20,
    },
    textTitles: {
        fontSize: 16,
    },
    horoscopeTodayContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    iconsHoroscopeToday: {
        flexDirection: "row",
        justifyContent: "space-evenly",
    },
    loveContainer: {
        flexDirection: "row",
        marginTop: 15,
        marginHorizontal: 20,
        justifyContent: "space-between",
        borderWidth: 2,
        borderRadius: 10,
    },
    heartLoveContainer: {
        flex: 0.2,
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    loveSignsContainer: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        flex: 1,
        marginTop: 10,
    },
    box_abs:{
        position: 'absolute',
        right: 5,
        paddingStart: 100,
        bottom: 5
    },
    my_btn_round:{
        width: 40,
        height: 40,
        borderRadius: 20,
        padding: 2,
        paddingLeft:10,
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
    shawdow: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    backCard: {
        width: width*1-24,
        marginTop: 10,
        marginBottom: 10,
        height: 200,
        backgroundColor: '#8BC34A'
    },
    frontCard: {
        width: width*1-24,
        borderRadius: 10,
        padding: 12, 
        marginTop: 10,
        marginBottom: 10,
        height: 200,
        backgroundColor: '#009688'
    },
    Card: {
        backfaceVisibility: 'hidden',
        borderRadius: 10,
        padding: 12,
        position: 'absolute'
    }
})