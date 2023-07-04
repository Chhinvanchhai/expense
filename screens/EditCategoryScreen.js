import React ,{useState, useEffect} from 'react'
import {View, Button, StyleSheet, TouchableOpacity, TextInput, FlatList, ScrollView, Keyboard} from 'react-native'
import { createIconSetFromIcoMoon } from '@expo/vector-icons';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import {
    useTheme,
    Text,
    Switch,
     
} from 'react-native-paper';
import Close from '../components/navs/Close'
import Rotation from '../components/animations/Rotation'
import * as FileSystem from 'expo-file-system';



const Icon = createIconSetFromIcoMoon(
    require('../assets/fonts/selection.json'),
    'IcoMoon',
    'icomoon.ttf'
);

const EdtCategoryScreen = ({navigation,route}) => {
    const [name, setName] = useState('');
    const [id, setId] = useState('')
    const [iconSelected, setIconSelected] = useState('social-flickr-circular')
    const [colorSelected, setColorSelected] = useState('#87C04A')
    const [isIcon, setIsIcon] = useState('icon')
    const [budget, setBudget] = useState('')
    const [iconName, setIconName] = useState([
        'home','notes','code','wi-fi', 'attachment-outline', 'lightbulb', 'weather-cloudy', 'shopping-cart',
        'store', 'aid-kit', 'glass', 'gift', 'spoon-knife', 'airplane', 'accessibility', 'smile', 'sad',
        'warning', 'tick', 'plus-outline', 'book','th-small', 'home1', 'scissors', 'zoom', 'calender', 'arrow-sync',
        'spanner', 'social-dribbble', 'news', 'location-outline', 'heart-outline', 'film', 'media-record-outline',
        'image2', 'credit-card', 'tablet', 'spinner4', 'cogs', 'leaf', 'truck', 'earth'
    ])
    const [colorName, setColorName] = useState([
        '#F44336','#E91E63','#9C27B0','#BA68C8', '#F06292', '#EF5350', '#2196F3', '#3F51B5',
        '#673AB7', '#009688', '#00BCD4', '#03A9F4', '#CDDC39', '#8BC34A', '#4CAF50', '#FF9800', '#FFC107',
        '#FFEB3B', '#607D8B', '#795548', '#FF5722','#9E9E9E', '#FFFFFF', '#000000'
    ])
    const isUpdate = route.params.item ? true : false
    useEffect(()=> {
        // navigation.setOptions({
        //     headerTitle: "Set"
        // })
        // deleteFile()
        if(isUpdate){
            setColorSelected(route.params.item.color)
            setName(route.params.item.name)
            setIconSelected(route.params.item.icon)
            setBudget(route.params.item.budget)
            setId(route.params.item.id)
        }

    },[isUpdate])
    const { colors } = useTheme();
    const sheetRef = React.useRef(null);
    const selectIcon = (item)=> {
       setIconSelected(item)
       sheetRef.current.snapTo(2)
    }
    const selectColor = (color) => {
        setColorSelected(color)
        sheetRef.current.snapTo(2)
    }

    const renderContent = () => (
        <View
          style={{
            backgroundColor: colors.text + "1D",
            padding: 16,
            height: 450,
            position: 'relative'
          }}
        >
            <View style={{height: 400}}>
                <View style={{flex: 1, flexDirection: 'row', alignContent:'stretch', flexWrap: 'wrap'}}>
                    {
                        isIcon  == 'icon' ?
                        iconName.map(item => 
                            (
                                <TouchableOpacity key={item} onPress={()=>selectIcon(item)}>
                                    <Icon  style={{textAlign: 'right',padding: 4}} name={item} size={24} color={colors.text} />
                                </TouchableOpacity>
                            )
                        )
                        : 
                        colorName.map(item => 
                            (
                                <TouchableOpacity key={item} onPress={() => selectColor(item)} style={[{backgroundColor: item, width: 30,height: 30,margin: 8, borderRadius: 20}]}>
                                </TouchableOpacity>
                            )
                        )

                    }
                </View>
            </View>
        </View>
      );

    const selectItem = (i) => {
        Keyboard.dismiss()
        if(i === 'icon'){
            setIsIcon('icon')
        }else{
            setIsIcon('color')
        }
        sheetRef.current.snapTo(1)
    }
    const budgetTextChange = (val) => {
        let num = ''
        num = val.replace(/[^0-9]/g, '.')
        setBudget(num.trim())
    }
    const deleteItem = async (id) => {
        try{
            let file_name = "categories.json"
            var isExist = await FileSystem.getInfoAsync(FileSystem.documentDirectory + file_name);
            if(isExist.exists){
                let queue =  await FileSystem.readAsStringAsync(FileSystem.documentDirectory + file_name);
                let Alldata = []
                let getdata = JSON.parse(queue)
                Alldata = getdata
                // const items = await datas.results.find(item => item.id == id )
                if(id != ''){
                    const index = Alldata.findIndex(item => item.id === id )
                    Alldata.splice(index,1)
                }else{
                    Alldata.push(data_)
                }
                await FileSystem.writeAsStringAsync(FileSystem.documentDirectory + file_name,JSON.stringify(Alldata))
            }
            navigation.navigate('allCategories',{screen: 'Categories',params: {add: id}})

        } catch (err){
            alert(err.message)
        }
    }
    const addCategory= async (id)=>{
        try{
            let file_name = "categories.json"
            let data_ = {
                id: id != '' ?  id : new Date().getTime().toString(),
                name: name,
                icon: iconSelected,
                color: colorSelected,
                budget: budget
            }
            var isExist = await FileSystem.getInfoAsync(FileSystem.documentDirectory + file_name);
            if(isExist.exists){
                let queue =  await FileSystem.readAsStringAsync(FileSystem.documentDirectory + file_name);
                let Alldata = []
                let getdata = JSON.parse(queue)
                Alldata = getdata
                // const items = await datas.results.find(item => item.id == id )
                if(id != ''){
                    const index = Alldata.findIndex(item => item.id === id )
                    Alldata.splice(index,1,data_)
                }else{
                    Alldata.push(data_)
                }
                await FileSystem.writeAsStringAsync(FileSystem.documentDirectory + file_name,JSON.stringify(Alldata))
            }else{
                let addFrist = []
                addFrist.push(data_)
                await FileSystem.writeAsStringAsync(FileSystem.documentDirectory + file_name,JSON.stringify(addFrist)) 
            }
            navigation.navigate('allCategories',{screen: 'Categories',params: {add: data_}})
        } catch(err){
            alert(err.message)
        }
    }
    return (
        <View style={{flex: 1}}>
        <View style={styles.container}>
            <View style={{ height: 50}}>
                <View style={{flex: 1, flexDirection: 'row' ,justifyContent: 'space-between'}}>
                    <TouchableOpacity onPress={()=> navigation.goBack()}>
                        <Icon 
                            name="times-outline" 
                            style={{marginTop:1, padding: 6, textAlign:'right'}}
                            color={colors.text}
                            size={35}
                        />
                    </TouchableOpacity>
                    <View>
                    {
                        id ? 
                            <Icon 
                                onPress={()=> deleteItem(id)}
                                name="trash" 
                                style={{marginTop: 0, padding: 6, textAlign:'right'}}
                                color={'#fff'}
                                size={30}
                            />
                        : 
                        null
                    }
                    </View>
                </View>
            </View>
            <View style={{height: 70, marginTop: 20}}>
                <Text>Name</Text>
                <TextInput
                    label="Name"
                    onFocus={()=> sheetRef.current.snapTo(2)}
                    placeholder="Enter Name..."
                  
                    style={styles.textInput}
                    placeholderTextColor="#92D050" 
                    value={name}
                    onChangeText={ text => setName(text) }
                />
            </View>
            {/* <View style={{height: 70, marginTop: 20}}>
                <Text>Budget</Text>
                <TextInput
                    label="budget"
                    keyboardType="numeric"
                    onFocus={()=> sheetRef.current.snapTo(2)}
                    placeholder="Enter Budget..."
                    style={styles.textInput}
                    placeholderTextColor="#92D050" 
                    value={budget}
                    onChangeText={ text => budgetTextChange(text) }
                />
            </View> */}
            <View>
            <View style={{height: 140, marginVertical: 30}}>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <TouchableOpacity
                        onPress={() => selectItem('icon')}
                        style={{ padding: 8, backgroundColor: 'green', borderRadius: 10, height: 40, width: 120}}
                    >
                        <Text style={{fontSize: 16, color: '#fff'}}>Choose Icon</Text>
                    </TouchableOpacity>
                    <Icon name={iconSelected} size={40} color={colors.text}/>
                </View>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <TouchableOpacity
                        onPress={() => selectItem('color')}
                        style={{ padding: 8, backgroundColor: 'green', borderRadius: 10, height: 40, width: 120}}
                    >
                        <Text style={{fontSize: 16, color: '#fff'}}>Select Color</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[{backgroundColor: colorSelected, width: 40,height: 40, borderRadius: 20}]}></TouchableOpacity>
                </View>
            </View>
      
            </View>
            <View style={styles.box_abs}>
                    <TouchableOpacity style={styles.my_btn_round} onPress={() => addCategory(id)}>
                        <Icon 
                            name="checkmark" 
                            style={{marginTop: 12, marginRight: 7}}
                            color={'#fff'}
                            size={20}
                        />
                    </TouchableOpacity>
            </View>
          
        </View>
        <BottomSheet
            ref={sheetRef}
            snapPoints={[450, 300, 0]}
            enabledContentTapInteraction={false}
            enabledInnerScrolling={true}
            enabledGestureInteraction={true}
            borderRadius={10}
            initialSnap={2}
            renderContent={renderContent}
        />
    </View>
    )
}
const styles = StyleSheet.create({
    container:{
        flex: 1,
        padding: 20
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
    textInput: {
        flex: 1,
        borderBottomWidth: 1,
        marginTop: Platform.OS === 'ios' ? 4 : 2,
        height: 20,
        borderBottomColor: '#f2f2f2',
        fontSize: 16,
        color: '#92D050',
    },
})
export default EdtCategoryScreen