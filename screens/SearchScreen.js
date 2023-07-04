import React,{useState, useEffect} from 'react'
import {View, StyleSheet, TextInput, FlatList, Image} from 'react-native'
import {Text, useTheme} from 'react-native-paper'
import { createIconSetFromIcoMoon } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Animatable from 'react-native-animatable';
import {SearchGroupBy} from '../helpers/Helps'
import { useGlobals } from "../components/contexts/Global";
const Icon = createIconSetFromIcoMoon(
    require('../assets/fonts/selection.json'),
    'IcoMoon',
    'icomoon.ttf'
);

const SearchScreen = ({navigation}) => {
    const [{currency}] = useGlobals()
    const {colors} = useTheme()
    const [search, setSearch] = useState('')
    const [Transaction, setTransaction] = useState([])
    const [isNotFound, setIsNotFound] = useState(false)
    useEffect(()=>{
        // getTransaction()
    },[])
    const searchChangeText = (val) => {
        setSearch(val)
        setTimeout(()=>{
            Search(val)
        },1000)
    }
    const Search = async (key) => {
        let file_name = "transactions.json"
        var isExist = await FileSystem.getInfoAsync(FileSystem.documentDirectory + file_name);
        let all_data = []
        if(isExist.exists){
            let queue =  await FileSystem.readAsStringAsync(FileSystem.documentDirectory + file_name);
            let tran_json = JSON.parse(queue)       
            let queue_cat =  await FileSystem.readAsStringAsync(FileSystem.documentDirectory + 'categories.json');
            let cat_json = JSON.parse(queue_cat)
            all_data = SearchGroupBy(tran_json, cat_json)
        }
        key = key.toLowerCase();
        let result = ''
        result = all_data.filter((item) =>{
                item.category.name = item.category.name.toLowerCase();
                item.note = item.note != "" ? item.note.toLowerCase() : ''
                return item.category.name.indexOf(key) > -1 || item.note.indexOf(key) > -1; 
        });
        if(result == ''){
            setIsNotFound(true)
        }else{
            setIsNotFound(false) 
        }
        setTransaction(result)
        if(key == ''){
            setTransaction([]) 
        }
        
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
                            </View>
                        </View>
                    </View>
                    <Text style={{marginRight: 10, fontSize:16, marginTop: 6}}>{item.amount}{currency}</Text>
                </View>
            </View>
        );
    }
    return (
        <View style={styles.container}>
            <View style={[styles.header,  {backgroundColor: colors.text + "1D",}]}>
                <View style={styles.flexRight}>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        <Icon  style={{ padding: 10}} name="arrow-left2" size={24} color={colors.text} onPress={()=> navigation.goBack()} />
                        <TextInput 
                            style={[styles.my_input, {
                                color: colors.text
                            }]}
                            autoFocus
                            placeholder="Search here ..."
                            placeholderTextColor="#8BC34A" 
                            onChangeText={(val) => searchChangeText(val)}
                            value={search}
                        />
                    </View>
                </View>

            </View>

            <View style={{flex: 1, marginBottom: 20, padding: 10}}>
                {
                    isNotFound && Transaction == '' ?
                    <View style={{flex: 1, justifyContent: 'center', alignItems:'center', marginTop: 40}}>
                      <Image
                          style={{width: 200,height: 220}}
                          source={require('../assets/notfound.png')}
                      />
                      <Text style={{fontSize: 18}}>Not Found</Text>
                  </View>
                  : null
                }
              
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
       height: 50,
    },
    flexRight:{
        justifyContent: 'flex-end',
        flexDirection: 'row',
        flex: 1,
    },
    my_input: {
        flex: 1,
        height: 46,
        width: 200,
        marginLeft: 20,
        marginTop: 4,
        fontSize: 20
    },
})
export default SearchScreen