import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

// import SignInScreen from '../screens/SignInScreen';


const RootStack = createStackNavigator();

const AutStack = ({navigation}) => (
    <RootStack.Navigator headerMode='none'>
        {/* <RootStack.Screen name="SplashScreen" component={SplashScreen}/> */}
        {/* <RootStack.Screen name="SignInScreen" component={SignInScreen}/> */}
        {/* <RootStack.Screen name="SignUpScreen" component={SignUpScreen}/> */}
    </RootStack.Navigator>
);

export default AutStack;