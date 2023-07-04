import React from 'react';
import { StatusBar} from "react-native";
import { useTheme, Text } from "react-native-paper";
import { useIsDark } from "../components/hooks/useTheme";
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Overviews from '../screens/Overviews'
import ProfileScreen from '../screens/ProfileScreen'
import CategoriesSreen from '../screens/CategoriesSreen'
import EditCategoryScreen from '../screens/EditCategoryScreen'
import AddExpenseScreen from '../screens/AddExpenseScreen'
import BudgetScreen from '../screens/BudgetScreen'
import DetialScreen from '../screens/DetailSreen'
import HistoryScreen from '../screens/HistoryScreen'
import SearchScreen from '../screens/SearchScreen'
import DetailMonthSreen from '../screens/DetailMonthSreen'
import SettingScreen from '../screens/SettingScreen'
import StatasticScreen from '../screens/StatasticScreen'
import ContributeScreen from '../screens/ContributeScreen'
import { createIconSetFromIcoMoon } from '@expo/vector-icons';
const Icon = createIconSetFromIcoMoon(
    require('../assets/fonts/selection.json'),
    'IcoMoon',
    'icomoon.ttf'
);
const BarLabel = ({ focused, color, children }) => {
  const { colors } = useTheme();
  return (
    <Text
      style={{
        fontSize: 10,
        lineHeight: 20,
        textAlign: "center",
        color: color,
      }}
    >
      {children}
    </Text>
  );
};
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const MainTabNavigation = ({navigation}) => (
  <Tab.Navigator>
      <Tab.Screen 
        name="Overviews" 
        component={Overviews} 
        options={{
          tabBarLabel: (props) => {
            <BarLabel {...props}>
              Overview
            </BarLabel>
          },
          tabBarColor: '#009387',
          tabBarIcon: ({ color }) => (
            <Icon name="home-outline" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen 
        name="Budget" 
        component={BudgetScreen} 
        options={{
          tabBarLabel: (props) => {
            <BarLabel {...props}>
                Budget
            </BarLabel>
          },
          tabBarColor: '#009387',
          tabBarIcon: ({ color }) => (
            <Icon name="coin-dollar" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen 
        name="History" 
        component={HistoryScreen} 
        options={{
          tabBarLabel: (props) => {
            <BarLabel {...props}>
                History
            </BarLabel>
          },
          tabBarColor: '#009387',
          tabBarIcon: ({ color }) => (
            <Icon name="history" color={color} size={26} />
          ),
        }}
      />
      {/* <Tab.Screen 
        name="Note" 
        component={ContributeScreen} 
        options={{
          tabBarLabel: 'Note',
          tabBarColor: '#009387',
          tabBarIcon: ({ color }) => (
            <Icon name="book" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen 
        name="Statastic" 
        component={StatasticScreen} 
        options={{
          tabBarLabel: 'Statastic',
          tabBarColor: '#009387',
          tabBarIcon: ({ color }) => (
            <Icon name="chart-line-outline" color={color} size={26} />
          ),
        }}
      /> */}
   
  </Tab.Navigator>
);
const StackCat = createStackNavigator();
const stackCatgories = ({navigation}) =>(
    <StackCat.Navigator>
        <StackCat.Screen 
          options={{
            headerLeft: ({ color }) => (
              <Icon name="chevron-left" style={{marginLeft: 10}} onPress={()=> navigation.goBack()} color={color} size={36} />
            ),
            headerTintColor:"#fff",
            headerStyle: {
              backgroundColor: '#92D050',
            },
          }} 
          name="Categories" 
          component={CategoriesSreen}
        />
        <StackCat.Screen name="EditCategory" component={EditCategoryScreen} options={{
          title: 'Edit Category',
          headerTintColor:"#fff",
          headerStyle: {
            backgroundColor: '#92D050',
          },
          headerShown: false
        }}/>
    </StackCat.Navigator>
)

const StackHistory = createStackNavigator();
// const stackHistories = ({navigation}) =>(
//     <StackHistory.Navigator>
//         <StackHistory.Screen 
//           options={{
//             headerShown: false
//           }} 
//           name="AllHistory" 
//           component={HistoryScreen}
//         />
    
//     </StackHistory.Navigator>
// )

const MianStack = ({navigation}) => {
  const { colors } = useTheme();
  const _barStyle = useIsDark() ? "light-content" : "dark-content";
  return(
    <React.Fragment>
      
       <StatusBar
          barStyle={_barStyle}
          backgroundColor={colors.background}
          animated
      />
      <Stack.Navigator screenOptions={{ headerShown: false }} mode="modal">
        <Stack.Screen name="Tab" component={MainTabNavigation} />
        <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              cardStyle: {
                backgroundColor: "transparent",
                marginTop: 50,
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
              },
          }}
        />
        <Stack.Screen name="AddExpense" component={AddExpenseScreen}/>
        <Stack.Screen name="allCategories" component={stackCatgories}/>
        <Stack.Screen name="Detail" component={DetialScreen}/>
        <Stack.Screen name="Search" component={SearchScreen}/>
        <Stack.Screen name="SettingScreen" component={SettingScreen} options={{headerShown: true, title: 'Setting'}}/>
        <Stack.Screen name="DetailMonthSreen" component={DetailMonthSreen} />
      </Stack.Navigator>
  </React.Fragment>
  )
}
export default MianStack