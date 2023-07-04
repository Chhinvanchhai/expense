import React, {useEffect, useState} from 'react';
import Main from "./Main";
// import i18n from "i18n-js";
import { initialState, reducer, StateProvider } from "./components/contexts/Global";
// import Translations from "./src/translations";
// import * as Localization from 'expo-localization';
// import * as Updates from 'expo-updates'
// import AsyncStorage from '@react-native-async-storage/async-storage';

// i18n.translations = Translations;
// i18n.translations = Translations;

// i18n.fallbacks = true;
function App() {
  // const [locale, setLocale] = useState('en')
  // useEffect(() => {
  //   getLocale()
  // }, []);
  // const getLocale = async()=>{
  //   // await AsyncStorage.setItem('@locale','kh');
  //   let locale = await AsyncStorage.getItem('@locale');
  //   setLocale(locale)
  // };
  // i18n.locale = locale;
  return (
    <StateProvider initialState={initialState} reducer={reducer}>
      <Main />
    </StateProvider>
  );
}

export default App;
