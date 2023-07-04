import React ,{useState, useEffect} from 'react'
import {View , StyleSheet,Platform, TextInput,ScrollView,FlatList,Keyboard, TouchableOpacity, KeyboardAvoidingView} from 'react-native'
import Close from '../components/navs/Close'
import {
    useTheme,
    Text,
    Switch
} from 'react-native-paper';
// import MyIcon from '../components/MyIcon'
import { createIconSetFromIcoMoon } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
const Icon = createIconSetFromIcoMoon(
    require('../assets/fonts/selection.json'),
    'IcoMoon',
    'icomoon.ttf'
);
import DateTimePicker from '@react-native-community/datetimepicker';
import { all } from 'react-native-axios/lib/axios';
import { useIsFocused } from "@react-navigation/native";
import {Picker} from '@react-native-picker/picker';
import * as Animatable from 'react-native-animatable';
import { showMessage } from "react-native-flash-message";


const  ExpenseScreen = ({navigation,route})=> {
    const [expense , setExpense] = useState('0')
    const [category, setCategory] = useState([ ])
    const [category2, setCategory2] = useState([])
    const isFocuse = useIsFocused()
    // const [isRoute, setIsRoute] = useState(false)
    // const checkFocuse = isFocuse ? setIsRoute(true) : ''
    const num_month = new Date().getMonth()
    const yearNow = new Date().getFullYear().toString().substr(-2)
    const thisMonth = num_month < 10 ? '0'+ (num_month+1) : (num_month+1)
    const thisMonthOf = thisMonth+'-'+yearNow

    const [date, setDate] = useState(new Date())
    const [monthOf, setMonthOf] = useState(thisMonthOf)
    const [selectDate, setSelectDate] = useState(new Date().toLocaleDateString())
    const [mode, setMode] = useState('date')
    const [show, setShow] = useState(false)
    const [note, setNote] = useState('')
    const [selectItem, setSelectItem] = useState()
    const [selectedCategory, setSelectedCategory] = useState('')
    const [selectItem2, setSelectItem2] = useState()
    const [type , setType] = useState('expense')
    const { colors } = useTheme();
    const [id , setId] = useState('')
    const [error, setError] = useState({
        amount: false,
        category: false

    })
    const isUpdate = route.params ? true : false
    useEffect(() => {
        if(isFocuse){
            getCategory()
            if(isUpdate){
                setDate(new Date(route.params.expense.date))
                setSelectDate(route.params.expense.date)
                setMonthOf(route.params.expense.monthOf)
                setNote(route.params.expense.note)
                setSelectedCategory(route.params.expense.cat_id)
                setId(route.params.expense.id)
                setExpense(route.params.expense.amount)
                setType(route.params.expense.type)
                ActiveSelectedCat(route.params.expense.cat_id)
            }
        }
        
    }, [isFocuse]);
    const ActiveSelectedCat = async (val) => {
        let file_name = "categories.json"
        var isExist = await FileSystem.getInfoAsync(FileSystem.documentDirectory + file_name);
        let all_data = []
        if(isExist.exists){
            let queue =  await FileSystem.readAsStringAsync(FileSystem.documentDirectory + file_name);
            let cat1 = []
            let cat2 = []
            let all_data = JSON.parse(queue)
            let middle = Math.ceil(all_data.length / 2 )
            all_data.map((item, index) => {
                if(index < middle){
                    cat1.push(item)
                }else{
                    cat2.push(item)
                }
            })
            const index =   cat1.findIndex(item => item.id == val)
            const index2 =   cat2.findIndex(item => item.id == val)
            if(index >=0){
                setSelectItem(index);
                setSelectItem2('')
            }else{
                setSelectItem('');
                setSelectItem2(index2)
            }
        }
    }

    const textInputChange = (val) => {
        let num = ''
        num = val.replace(/[^0-9]/g, '.')
        setExpense(num)
        setError({
            ...error,
            amount: false,
        })
    }
    const getCategory = async()=>{
        let file_name = "categories.json"
        var isExist = await FileSystem.getInfoAsync(FileSystem.documentDirectory + file_name);
        let all_data = []
        if(isExist.exists){
            let queue =  await FileSystem.readAsStringAsync(FileSystem.documentDirectory + file_name);
            let cat1 = []
            let cat2 = []
            let all_data = JSON.parse(queue)
            let middle = Math.ceil(all_data.length / 2 )
            all_data.map((item, index) => {
                if(index < middle){
                    cat1.push(item)
                }else{
                    cat2.push(item)
                }
            })
            setCategory(cat1)
            setCategory2(cat2)
        }
    }

    const onPressList = (item,index) => {
        setSelectItem(index);
        setSelectItem2('')
        setSelectedCategory(item.id)
        setError({
            ...error,
            category: false,
        })
    }
    const onPressList2 = (item,index) => {
        setSelectItem2(index);
        setSelectItem('');
        // set seleced item
        setSelectedCategory(item.id)
        setError({
            ...error,
            category: false,
        })
    }

    const _renderItem = ({item,index})=>{
        const localColor = {backgroundColor: selectItem === index ? "#92D050" :  colors.text + "0D"}
        return (
            <TouchableOpacity onPress={()=> onPressList(item,index)}>
                <View style={[localColor,{height: 160,width: 130, marginLeft: 6, marginBottom: 6 ,flex: 1, flexDirection: 'column'}]}>
                    <View style ={[{marginBottom: 2, height: 80}]}>
                        <View style={{ flex: 1, justifyContent:'center'}}>
                            <Icon style={{textAlign: 'center'}} name={item.icon} size={18} color={item.color} />
                            <Text style={{textAlign: 'center'}}>{item.name}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
         );
    }
  
    const _renderItem2 = ({item,index})=>{
        const localColor2 = {backgroundColor: selectItem2 === index ? "#92D050" :  colors.text + "0D"}
        return (
            <TouchableOpacity onPress={()=> onPressList2(item,index)}>
                <View style={[localColor2,{height: 160,width: 130, marginLeft: 6, marginBottom: 6 ,flex: 1, flexDirection: 'column'}]}>
                    <View style ={[{marginBottom: 2, height: 80}]}>
                        <View style={{ flex: 1, justifyContent:'center'}}>
                            <Icon style={{textAlign: 'center'}} name={item.icon} size={18} color={item.color} />
                            <Text style={{textAlign: 'center'}}>{item.name}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
         );
    }
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        let str_date = currentDate.toLocaleDateString()
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
        setSelectDate(str_date)
        let devideString =  str_date.split('/');
        let my_month_of = devideString[0]+'-'+devideString[2]
        setMonthOf(my_month_of)
        Keyboard.dismiss()
      };
    
      const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
      };
    
      const showDatepicker = () => {
        showMode('date');
      };
    
    //   const showTimepicker = () => {
    //     showMode('time');
    //   };
    const Save =  async () =>{
        try{
            if(selectedCategory == '' || expense == '' || expense == 0){
                setError({
                    ...error,
                    category: true,
                    amount: true
                })
                return
            }
            let file_name = "transactions.json"
            let data_ = {
                id: id != '' ? id :  new Date().getTime().toString(),
                cat_id: selectedCategory,
                date: selectDate,
                note: note, 
                type: type,
                amount: expense,
                monthOf : monthOf
            }
            var isExist = await FileSystem.getInfoAsync(FileSystem.documentDirectory + file_name);
            if(isExist.exists){
                let queue =  await FileSystem.readAsStringAsync(FileSystem.documentDirectory + file_name);
                let Alldata = []
                let getdata = JSON.parse(queue)
                Alldata = getdata
                // const items = await datas.results.find(item => item.id == id )
                if(id != ''){
                    const index = Alldata.findIndex(item => item.id == id )
                    Alldata.splice(index,1,data_)
                }else{
                    Alldata.push(data_)
                }
                await FileSystem.writeAsStringAsync(FileSystem.documentDirectory + file_name,JSON.stringify(Alldata))
                showMessage({
                    message: "Added Successful",
                    description: "Your data have been added",
                    type: "success",
                })
            }else{
                let addFrist = []
                addFrist.push(data_)
                await FileSystem.writeAsStringAsync(FileSystem.documentDirectory + file_name,JSON.stringify(addFrist)) 
            }
            navigation.navigate('Tab',{screen: 'Overviews',params: {ex: data_}})
        } catch(err){
            alert(err.message)
            showMessage({
                message: "Added Failed",
                description: "Failed to added",
                type: "warning",
            })
        }
    }
    const deleteItem = async (val) => {
        try{
            let file_name = "transactions.json"
            let queue =  await FileSystem.readAsStringAsync(FileSystem.documentDirectory + file_name);
            let Alldata = []
            let getdata = JSON.parse(queue)
            Alldata = getdata
            const index = Alldata.findIndex(item => item.id == id )
            Alldata.splice(index,1)
            await FileSystem.writeAsStringAsync(FileSystem.documentDirectory + file_name,JSON.stringify(Alldata))
            navigation.navigate('Tab',{screen: 'Overviews',params: {ex: 'deleted'}})
        } catch(err){
            alert(err.message)
        }
    }
    return (
        <View style={styles.container}>
            <View style={{height: 50}}>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <TouchableOpacity onPress={()=> navigation.goBack()}>
                        <Icon 
                            name="times-outline" 
                            style={{marginTop:1, padding: 10, textAlign:'right'}}
                            color={colors.text}
                            size={35}
                        />
                    </TouchableOpacity>
                    {
                        id ? 
                            <Icon 
                                onPress={()=> deleteItem(id)}
                                name="trash" 
                                style={{marginTop:1, padding: 10, textAlign:'right'}}
                                color={colors.text}
                                size={30}
                            />
                        : 
                        null
                    }
                </View>
            </View>
            <KeyboardAvoidingView>
               <View style={styles.wraper}>
                <ScrollView
                    scrollEventThrottle = {16}
                    >
                    <TextInput 
                        style={[styles.my_input, {
                            color: colors.text
                        }]}
                        autoFocus
                        keyboardType='number-pad'
                        value={expense} 
                        onChangeText={(val)=> textInputChange(val)}
                    />
                    {
                        error.amount ?
                        <Animatable.View animation="fadeInLeft" duration={500}>
                          <Text style={{color: 'red', marginLeft: 14}}>Amount is require*</Text>
                        </Animatable.View>
                        : null
                    }
                    <Picker
                        selectedValue={type}
                        mode="dropdown"
                        style={{height: 50, width: 150, marginLeft:10, color: colors.text, fontSize: 16 }}
                        onValueChange={(itemValue, itemIndex) =>
                            setType(itemValue)
                        }>
                        <Picker.Item label="Expense" value="expense" />
                        <Picker.Item label="Income" value="income" />
                    </Picker>
                    <View style = {{ flex: 1, paddingTop: 20}}>
                        <View style={{flex: 1,flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text style={{fontSize: 20}}>
                                Category
                            </Text>
                            <TouchableOpacity style={[ colors.text,{marginTop: 2}]} onPress={() => navigation.navigate('allCategories',{screen: 'Categories'})}>
                                <View style={{flex: 1, flexDirection: 'row'}}>
                                    <Text style={{fontSize: 18}}>Add</Text><Icon style={{padding: 4}} name="list2" size={18} color={colors.text} />
                                </View>
                            </TouchableOpacity>
                        </View>
                        {/* <View style={{height: 130, marginTop: 20}}>
                                <VirtualizedList
                                    data={category}
                                    initialNumToRender={5}
                                    horizontal
                                    showsHorizontalScrollIndicator={false }
                                    renderItem={({ item })  => <Item item={item} />}
                                    keyExtractor={item => item.key}
                                    numColumns={2}
                                    getItemCount={getItemCount}
                                    getItem={getItem}
                                />
                      
                        </View> */}
                        <View style={{height: 220}}>
                            <View  style={{height: 172, marginTop: 20}}>
                                <FlatList
                                    data={category}
                                    renderItem={_renderItem}
                                    showsHorizontalScrollIndicator={false }
                                    horizontal
                                    height={160}
                                    keyExtractor={item => item.id.toString()}
                                />
                                <FlatList
                                    data={category2}
                                    renderItem={_renderItem2}
                                    showsHorizontalScrollIndicator={false }
                                    horizontal
                                    height={160}
                                    keyExtractor={item => item.id.toString()}
                                    contentContainerStyle={{ paddingVertical: 0 }}
                                />
                            </View>
                            {
                                error.category ?
                                <Animatable.View animation="fadeInLeft" duration={500}>
                                <Text style={{color: 'red', marginLeft: 14}}>Category is require*</Text>
                                </Animatable.View>
                                : null
                            }
                        </View>
                    </View>     
                    <View>
                        <Text style={{fontSize: 16}}>Detail</Text>
                    </View>
                    <View>
                        <View style={styles.action}>
                            <Icon name="calendar" size={18} style={{marginTop: -5}} color={colors.text} />
                            <TextInput 
                                placeholder="Date"
                                onFocus={()=> showDatepicker()}
                                keyboardType="numeric"
                                placeholderTextColor="#666666"
                                value={selectDate}
                                style={[styles.textInput, {
                                    color: colors.text
                                }]}
                                autoCapitalize="none"
                            />
                        </View>
                        <View style={styles.action}>
                            <Icon name="document" size={22} style={{marginTop: -5}} color={colors.text} />
                            <TextInput 
                                placeholder="Note"
                                placeholderTextColor="#666666"
                                style={[styles.textInput, {
                                    color: colors.text
                                }]}
                                value={note}
                                onChangeText={(val) => setNote(val)}
                                autoCapitalize="none"
                            />
                            {show && (
                                <DateTimePicker
                                testID="dateTimePicker"
                                value={date}
                                mode={mode}
                                is24Hour={true}
                                display="default"
                                onChange={onChange}
                                />
                            )}
                        </View>
                    </View>
                </ScrollView>
            </View>
              
            </KeyboardAvoidingView>
            <View style={styles.box_abs}>
                        <TouchableOpacity style={styles.my_btn_round} onPress={() => Save()}>
                            <Icon 
                                name="checkmark" 
                                style={{marginTop: 6, marginRight: 7}}
                                color={'#fff'}
                                size={20}
                            />
                        </TouchableOpacity>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container:{
        flex: 1
    },
    wraper: {
        marginTop: 0,
        paddingHorizontal: 10,
        marginBottom: 40,
    },
    my_input: {
        height: 100,
        marginTop: 10,
        marginLeft: 20,
        fontSize: 70
    },
    action: {
        flexDirection: 'row',
        marginTop: 20,
        marginBottom: 20,
        paddingBottom: 5
    },
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 4 : -12,
        height: 30,
        marginLeft: 20,
        borderBottomColor: '#f2f2f2',
        borderBottomWidth: 1,
        color: '#05375a',
    },
    box_abs:{
        position: 'absolute',
        right: 20,
        bottom: 20
      },
    my_btn_round:{
        width: 40,
        height: 40,
        borderRadius: 20,
        padding: 2,
        paddingLeft:10,
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

export default ExpenseScreen