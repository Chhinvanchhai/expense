import React, {useEffect, useState} from 'react'
import {View, Dimensions, StyleSheet, ScrollView } from 'react-native'
import {Text } from 'react-native-paper'
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
  } from "react-native-chart-kit";
  import * as FileSystem from 'expo-file-system';
  import { GroupByCategoryForPieChart, IncomeLineChart,ExpenseLineChart } from '../helpers/Helps'
  import { useIsFocused } from "@react-navigation/native";
  const data = [
    {
      name: "Seoul",
      population: 21500000,
      color: "rgba(131, 167, 234, 1)",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    },
    {
      name: "Toronto",
      population: 2800000,
      color: "#F00",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    },
    {
      name: "Beijing",
      population: 527612,
      color: "red",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    },
    {
      name: "New York",
      population: 8538000,
      color: "#ffffff",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    },
    {
      name: "Moscow",
      population: 11920000,
      color: "rgb(0, 0, 255)",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    }
  ];
  const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
};
const screenWith = Dimensions.get("window").width-20
const StatasticScreen = () => {
    const num_month = new Date().getMonth()
    const yearNow = new Date().getFullYear().toString().substr(-2)
    const thisMonth = num_month < 10 ? '0'+ (num_month+1) : (num_month+1)
    const thisMonthOf = thisMonth+'-'+yearNow
    const [monthOf, setMonthOf] = useState(thisMonthOf)
    const [category, setCategory] = useState([])
    const [income, setIncome] = useState([])
    const [expense, setExpense] = useState([])
    const [type , setType] = useState('expense')
    const isFocuse = useIsFocused()

    useEffect(()=>{
        if(isFocuse){
            getTransaction(type,monthOf)
        }
    },[isFocuse])
    const getTransaction = async (type, monthOf = '') => {
        let file_name = "transactions.json"
        var isExist = await FileSystem.getInfoAsync(FileSystem.documentDirectory + file_name);
        if(isExist.exists){
            let queue =  await FileSystem.readAsStringAsync(FileSystem.documentDirectory + file_name);
            let queue_cat =  await FileSystem.readAsStringAsync(FileSystem.documentDirectory + "categories.json");
            let all_data = JSON.parse(queue)
            const categoryGroup = GroupByCategoryForPieChart(all_data, monthOf, type, queue_cat)
            const IncomeData =  IncomeLineChart(all_data, monthOf, type, queue_cat)
            const ExpenseData = ExpenseLineChart(all_data, monthOf, type, queue_cat)
            setIncome(IncomeData.income)
            setExpense(ExpenseData.expense)
            setCategory(categoryGroup.cat)
            // setMaxAmount(categoryGroup.maxNum)
            // setTotal(categoryGroup.allTotal)
        }
}
    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={{height: 40}}>
                    <Text style={{fontSize: 20, fontWeight: 'bold'}}>Analysis Your Expense & Income</Text>
                    <View style={{height: 3, backgroundColor: '#8BC34A', width: Dimensions.get("window").width-60}}></View>
                </View>
                <Text style={{ fontSize: 18}}>These Month Transaction</Text>
                <View style={{}}>
                    <LineChart
                        data={{
                        labels:['Week1','Week2','Week3','Week4'],
                        datasets: [
                            {
                                data: expense
                            },
                            {
                                data:income
                            }
                        ],
                        legend: ["Expense"] ,
                        
                        }}
                        width={Dimensions.get("window").width-20} // from react-native
                        height={220}
                        segments={3}
                        yAxisInterval={1} // optional, defaults to 1
                        chartConfig={{
                        backgroundColor: "#8BC34A",
                        backgroundGradientFrom: "#4CAF50",
                        backgroundGradientTo: "#8BC34A",
                        decimalPlaces: 2, // optional, defaults to 2dp
                        color: (opacity = 1) => `rgba(255, 255, 215, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                            borderRadius: 16
                        },
                        propsForDots: {
                            r: "6",
                            strokeWidth: "2",
                            stroke: "#ffa726"
                        }
                        }}
                        bezier
                        style={{
                        marginVertical: 8,
                        borderRadius: 16
                        }}
                    />
                </View>
                <Text style={{fontSize: 22}}>Income</Text>
                <View style={{}}>
                    <LineChart
                        data={{
                        labels: income,
                        datasets: [
                            {
                            data: income
                            }
                        ]
                        }}
                        width={Dimensions.get("window").width-20} // from react-native
                        height={220}
                        yAxisLabel="$"
                        yAxisSuffix="k"
                        yAxisInterval={1} // optional, defaults to 1
                        chartConfig={{
                        backgroundColor: "#8BC34A",
                        backgroundGradientFrom: "#fb8c00",
                        backgroundGradientTo: "#4CAF50",
                        decimalPlaces: 2, // optional, defaults to 2dp
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                            borderRadius: 16
                        },
                        propsForDots: {
                            r: "6",
                            strokeWidth: "2",
                            stroke: "#ffa726"
                        }
                        }}
                        bezier
                        style={{
                        marginVertical: 8,
                        borderRadius: 16
                        }}
                    />
                </View>
                <View style={{height: 40}}>
                    <Text style={{fontSize: 20, fontWeight: 'bold'}}>Analysis of expense per category</Text>
                    <View style={{height: 3, backgroundColor: '#8BC34A', width: Dimensions.get("window").width-50}}></View>
                </View>
                <View style={{marginBottom: 20}}>
                    <PieChart
                        data={category}
                        width={screenWith}
                        height={220}
                        chartConfig={chartConfig}
                        accessor={"population"}
                        backgroundColor={"transparent"}
                        paddingLeft={"0"}
                        center={[10, 4]}
                        absolute
                    />
                </View>
            </ScrollView>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        padding: 10
    }
})
export default StatasticScreen