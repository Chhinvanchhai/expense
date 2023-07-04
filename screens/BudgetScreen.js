import React, {useEffect, useState} from 'react'
import {View, StyleSheet ,Dimensions, TouchableOpacity, FlatList, TextInput} from 'react-native'
import { Text , ProgressBar, useTheme , Modal, Portal} from 'react-native-paper'
const width = Dimensions.get('window').width;
import {daysInMonth, GroupByCategoryBudget} from '../helpers/Helps'
import * as FileSystem from 'expo-file-system';
import * as Animatable from 'react-native-animatable';
import { useGlobals } from "../components/contexts/Global";
import { createIconSetFromIcoMoon } from '@expo/vector-icons';
import AsyncStorage from '@react-native-community/async-storage';
import {format2} from '../helpers/Helps'
import { useIsFocused } from "@react-navigation/native";

const Icon = createIconSetFromIcoMoon(
    require('../assets/fonts/selection.json'),
    'IcoMoon',
    'icomoon.ttf'
  );
const BudgetScreen = () => {
    const isFocuse = useIsFocused()
    const { colors } = useTheme()
    const [{currency}] = useGlobals()
    const date = new Date()
    const d = date.getDate()
    const m = date.getMonth()+1
    const y = date.getFullYear()
    const totalDay = daysInMonth(m,y)
    const start_date = ( m < 10 ? "0"+m : m)+ "-01-"+y
    const end_date = ( m < 10 ? "0"+m : m)+ "-"+totalDay+"-"+y
    const totalWidth = width-20
    const num_month = new Date().getMonth()
    const yearNow = new Date().getFullYear().toString().substr(-2)
    const thisMonth = num_month < 10 ? '0'+ (num_month+1) : (num_month+1)
    const thisMonthOf = thisMonth+'-'+yearNow

    const [monthOf, setMonthOf] = useState(thisMonthOf)
    const [mLeft, setMleft] = useState(0)
    const [transactionBudget, setTransactionBudget] = useState([])
    const [total, setTotal] = useState('0')
    const [visible, setVisible] = useState(false)
    const [visible2, setVisible2] = useState(false)
    const [budget, setBudget] = useState('')
    const [budgetOverall , setBudgetOverall] =  useState('')
    const [error, setError] = useState(false)
    const [budgetId, setBudgetId] = useState('')
    const [catId , setCatId] = useState('')

  
    useEffect(()=>{
        if(isFocuse){
            let calLeft = (totalWidth*d)/totalDay
            setMleft(calLeft)
            getTransaction("expense",monthOf)
            getBugetOverall()
        }
    },[isFocuse])
    const textInputChange = (val) => {
        let num = ''
        num = val.replace(/[^0-9]/g, '.')
        setBudget(num)
        setError(false)
    }
    const TextChnageCategoryOverall = (val) => {
        let num = ''
        num = val.replace(/[^0-9]/g, '.')
        setBudgetOverall(num)
    }
    // const getBedget = async() => {
    //     var isExistBudget = await FileSystem.getInfoAsync(FileSystem.documentDirectory + "budget.json");
    //     let queue =  await FileSystem.readAsStringAsync(FileSystem.documentDirectory + "budget.json");
    //     let budget_json = JSON.parse(queue)
    // }
    const saveOverall = () => {
        AsyncStorage.setItem("@overall",budgetOverall.toString())
        setVisible2(!visible2)
    }
    const addBuget = async() => {
        try{
            if(budget == ''){
                setError(true)
                return
            }
            let file_name = "budget.json"
            var isExist = await FileSystem.getInfoAsync(FileSystem.documentDirectory + file_name);
            if(isExist.exists){
                let queue =  await FileSystem.readAsStringAsync(FileSystem.documentDirectory + file_name);
                let getdata = JSON.parse(queue)
                let index = getdata.findIndex(b => b.cat_id == catId)
                if(budgetId != 0){
                    let data_ = {
                        id: budgetId,
                        cat_id: catId,
                        budget: budget,
                        date: new Date().toLocaleDateString(),
                    }
                    getdata.splice(index,1,data_)
                }else{
                    let data_ = {
                        id:  new Date().getTime().toString(),
                        cat_id: catId,
                        budget: budget,
                        date: new Date().toLocaleDateString(),
                    }
                    getdata.push(data_)
                }
                await FileSystem.writeAsStringAsync(FileSystem.documentDirectory + file_name,JSON.stringify(getdata))
                setVisible(!visible)
                getTransaction("expense",monthOf)
            }else{
                let data_ = {
                    id:  new Date().getTime().toString(),
                    cat_id: catId,
                    budget: budget,
                    date: new Date().toLocaleDateString(),
                }
                let addFrist = []
                addFrist.push(data_)
                await FileSystem.writeAsStringAsync(FileSystem.documentDirectory + file_name,JSON.stringify(addFrist)) 
            }
            // navigation.navigate('Tab',{screen: 'Overviews',params: {ex: data_}})
        } catch(err){
            alert(err.message)
        }
    }
    const getBugetOverall =  async () => {
        let getOveral = await AsyncStorage.getItem('@overall')
        if(getOveral != null){
            setBudgetOverall(getOveral)
        }
       
    }
    const SlectCategory = (item) => {
        setCatId(item.cat_id)
        let b_id = item.budget != "" ? item.budget.id : ''
        let b_data = item.budget != "" ? item.budget.budget : ''
        setBudget(b_data)
        setBudgetId(b_id)
        setVisible(!visible)
    }
    const getTransaction = async (type, monthOf = '') => {
        let file_name = "transactions.json"
        var isExist = await FileSystem.getInfoAsync(FileSystem.documentDirectory + file_name);
        var isExistBudget = await FileSystem.getInfoAsync(FileSystem.documentDirectory + "budget.json");
        if(isExist.exists){
            let queue =  await FileSystem.readAsStringAsync(FileSystem.documentDirectory + file_name);
            let all_data = JSON.parse(queue)
            let budget_json = []
            if(isExistBudget.exists){
                let budget =  await FileSystem.readAsStringAsync(FileSystem.documentDirectory + "budget.json");
                budget_json = JSON.parse(budget)
            }
            let queue_cat =  await FileSystem.readAsStringAsync(FileSystem.documentDirectory + "categories.json");
            let cat_json =  JSON.parse(queue_cat)
            const budgetGroup = GroupByCategoryBudget(all_data, monthOf, type,cat_json, budget_json)
            setTotal(budgetGroup.allTotal)
            setTransactionBudget(budgetGroup)
        }
    }
    const renderTranBudget = ({item}) =>{
        return(
            <TouchableOpacity style={{height: 54, marginVertical: 10}} onPress ={() => SlectCategory(item)}>
                <View style={{flex: 1, justifyContent: 'space-between', flexDirection: 'row'}}>
                    <View>
                    <Text style={{ fontSize: 18}}>{item.category}</Text>
                    <Text>{format2(parseFloat(item.total))}{item.budget !='' ? " / "+ format2(parseFloat(item.budget.budget)) : ''}{currency}</Text>
                    </View>
                    <Text style={{marginTop: 20, fontSize: 15}}>{item.budget ? (item.budget.budget-item.total) > 0 ?  format2(item.budget.budget-item.total)+currency +" Left" : '+'+format2(item.total-item.budget.budget)+currency  : ""}</Text>  
                </View>
                <ProgressBar progress={item.total/ total}  style={{height: 7, borderRadius: 3, marginTop: 6,  width: width-20,}}  color={item.color} />
            </TouchableOpacity>
        )
    }
    return (
        <View style={styles.container}>
            <View>
                <Icon name="circle-down" size={24} color={colors.text} style={{marginLeft:mLeft }} />
                <ProgressBar progress={1}  style={{height: 7, borderRadius: 3, marginTop: 6,  width: width-20,}}  color="#BDBDBD" />
                <View style={{height: 50}}>
                    <View style={{flex: 1, justifyContent: 'space-between', flexDirection: 'row'}}>
                        <Text>{start_date}</Text>
                        <Text>{end_date}</Text>
                    </View>
                </View>
            </View>
            <TouchableOpacity style={{height: 54, marginBottom: 10}} onPress ={() => setVisible2(!visible2)}>
                <View style={{flex: 1, justifyContent: 'space-between', flexDirection: 'row'}}>
                    <View>
                    <Text style={{ fontSize: 18}}>Overall</Text>
                    <Text>{format2(parseFloat(total))}{budgetOverall != '' ? " / "+ format2(parseFloat(budgetOverall)) : ''}{ currency}</Text>
                    </View>
                    <Text style={{marginTop: 20, fontSize: 15}}>{ budgetOverall =='' ? '' : (budgetOverall-total)> 0 ? format2(budgetOverall-total)+currency+ "Left" : "+"+ format2(total-budgetOverall)+currency  }</Text>
    
                </View>
                <ProgressBar progress={1}  style={{height: 7, borderRadius: 3, marginTop: 6,  width: width-20,}}  color="#BDBDBD" />
            </TouchableOpacity>
            <FlatList
                data={transactionBudget.cat}
                nestedScrollEnabled={true}
                renderItem={renderTranBudget}
                keyExtractor={item => item.category}
            />
            <Portal>
                <Modal dismissable={false} visible={visible} onDismiss={() => setVisible(!visible)} contentContainerStyle={styles.modal}>
                    <Text style={{fontSize: 22}}>Set Budget</Text>
                    <View style={{height: 46}}>
                        <TextInput
                            placeholder="Amount..."
                            style={styles.textInput}
                            placeholderTextColor="#92D050" 
                            autoFocus
                            keyboardType="numeric"
                            value={budget}
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
                            <TouchableOpacity onPress={() => addBuget()}>
                                <Text style={{color: '#4CAF50',fontSize: 18}}>Ok</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </Portal>
            <Portal>
                <Modal dismissable={false} visible={visible2} onDismiss={() => setVisible2(!visible2)} contentContainerStyle={styles.modal}>
                    <Text style={{fontSize: 22}}>Set Budget</Text>
                    <View style={{height: 46}}>
                        <TextInput
                            placeholder="Amount..."
                            style={styles.textInput}
                            placeholderTextColor="#92D050" 
                            keyboardType="numeric"
                            autoFocus
                            value={budgetOverall}
                            onChangeText={ text => TextChnageCategoryOverall(text.trim()) }
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
                            <TouchableOpacity onPress={() => setVisible2(!visible2)}>
                                <Text style={{color: '#4CAF50', fontSize: 18}}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => saveOverall()}>
                                <Text style={{color: '#4CAF50',fontSize: 18}}>Ok</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </Portal>
      
        </View>

    )
}
const styles =  StyleSheet.create({
    container: {
        padding: 12,
        marginTop: 20,
    },
    modal: {
        margin: 20,
        padding: 10,
        paddingHorizontal: 20,
        backgroundColor: '#616161'
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
export default BudgetScreen