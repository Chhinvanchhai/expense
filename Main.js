import React, {useEffect} from 'react'
import { View, ActivityIndicator } from 'react-native';
import { Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from 'expo-font';
// import AuthStack from './navigation/AuthStack';
import AppStack from './navigation/AppStack'
import themes from "./components/constants/themes";
import { useGlobals } from "./components/contexts/Global";
import AsyncStorage from '@react-native-community/async-storage';
import FlashMessage from "react-native-flash-message"

const App = () => {
  const [isLogin , setISLogin] = React.useState(null);
  const [loading , setLoading] = React.useState(true);
  const [{ theme, currency }, dispatch] = useGlobals();
  const _theme = themes[theme];
  useEffect(() => {   // it is simila to componentdidmount
    setISLogin(true)
    getCurrency()
    getTheme()
  }, []);
  const getCurrency = async () => {
    let currency = ''
    let get_currency =  await AsyncStorage.getItem('@my_currency')
    if(get_currency != null){
      dispatch({
        type: "setCurrency",
        currency: get_currency
      })
    }
    setLoading(false)
  }
  const getTheme = async () => {
    let get_theme=  await AsyncStorage.getItem('@my_theme')
    if(get_theme != null){
      dispatch({
        type: "switchTheme",
        theme: get_theme,
      })
    } 
  }
 
  const [fontsLoaded] = useFonts({ IcoMoon: require('./assets/fonts/icomoon.ttf') });
  if(loading && fontsLoaded) {
    return(
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }
  return (
    <PaperProvider theme={_theme}>
        <NavigationContainer theme={_theme}>
          { isLogin ? <AppStack/> :  <View></View> }
        </NavigationContainer>
        <FlashMessage position="top" />
    </PaperProvider>
  );
}
export default App;
