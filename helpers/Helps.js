import * as FileSystem from 'expo-file-system';
const  format2 = (n) => {
    return  n.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
}
const GroupBy =  (xs, key)=>  {
    return xs.reduce(function(rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
};
const GroupByReturnArr =  (xs, key)=>  {
    return xs.reduce(function(rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, []);
};
const GroupBy2 = (myArr, cat_id = '', allCategory) => {
    let result = [];
    const map = new Map();
    for (const item of myArr) {
        if (!map.has(item.monthOf)) {
            map.set(item.monthOf, true);    // set any value to Map
            result.push(item)
        }
    }
    let result_sort = result.sort(function(a, b) {
        return new Date(b.date) - new Date(a.date);
    });
    let type = []
    result_sort.map(m => {
        var totalIcome = 0
        var totalExpense = 0
        const dataType = myArr.filter(item => {
         
            if(cat_id != ''){
                if(m.monthOf == item.monthOf && item.cat_id == cat_id ){
                    let cat = allCategory.filter(i => i.id == cat_id)
                    item['category'] = cat[0]
                    if(item.type == "income"){
                        totalIcome = totalIcome + parseFloat(item.amount)
                    }else{
                        totalExpense = totalExpense + parseFloat(item.amount)
                    }
                    return item
                }
            }else{
                if(m.monthOf == item.monthOf){
                    let cat = allCategory.filter(i => i.id == item.cat_id)
                    item['category'] = cat[0]
                    if(item.type == "income"){
                        totalIcome = totalIcome + parseFloat(item.amount)
                    }else{
                        totalExpense = totalExpense + parseFloat(item.amount)
                    }
                    return item
                }
            }
           
        })
        type.push({
            monthOf: m.monthOf,
            data: dataType,
            total : "IN - EX: "+totalIcome+ " - "+totalExpense+ " = " + format2(totalIcome-totalExpense),
            total_result: (totalIcome-totalExpense)
        })
    }) 
    
    return type
}
const Method2 = (item)=>  {
    return item
};
const Search = (arr,key) => {
    let result = ''
    result = arr.filter(function(user){
         user = user.name.toLowerCase();
         return user.indexOf(key) > -1; 
    });
    return result
}
// const getCategory = async() => {
//     let queue_cat =  await FileSystem.readAsStringAsync(FileSystem.documentDirectory + "categories.json");
//     return JSON.parse(queue_cat)
// }
const GroupByCategory = (myArr,monthOf, typeExpense, category) => {
    let result = [];
    let cat_parse = JSON.parse(category)
    const map = new Map();
    for (const item of myArr) {
        if (!map.has(item.cat_id)) {
            map.set(item.cat_id, true);    // set any value to Map
            let new_item = cat_parse.filter(i => i.id == item.cat_id)
            result.push(new_item[0])
        }
    }
    let type = []
    let allType = {}
    var storeMax = []
    result.map(cat => {
        var total = 0
        const dataType = myArr.filter(item => {
            if(item.cat_id == cat.id && item.monthOf == monthOf && item.type == typeExpense){
                total = total + parseFloat(item.amount)
                return item
            }
        })
        if(dataType != ''){
            storeMax.push(total)
            type.push({
                category: cat.name,
                icon : cat.icon,
                color : cat.color,
                data: dataType,
                total :total
            })
        }
    }) 
    allType['cat'] = type
    allType['monthOf'] = monthOf
    allType['maxNum'] =  Math.max(...storeMax)
    allType['allTotal'] = storeMax.length != 0 ? storeMax.reduce((total,num)=> {return total+num}) : 0
    return allType
}
const GroupByCategoryBudget = (myArr,monthOf, typeExpense, category, budget) => {
    let result = [];
    const map = new Map();
    for (const item of myArr) {
        if (!map.has(item.cat_id)) {
            map.set(item.cat_id, true);    // set any value to Map
            let new_item = category.filter(i => i.id == item.cat_id)
            result.push(new_item[0])
        }
    }
    let type = []
    let allType = {}
    var storeMax = []
    result.map(cat => {
        var total = 0
        const dataType = myArr.filter(item => {
            if(item.cat_id == cat.id && item.monthOf == monthOf && item.type == typeExpense){
                total = total + parseFloat(item.amount)
                return item
            }
        })
        if(dataType != ''){
            storeMax.push(total)
            let bu_ = budget.filter(b => b.cat_id == cat.id)
            type.push({
                category: cat.name,
                cat_id: cat.id,
                icon : cat.icon,
                budget: bu_[0] ? bu_[0] : '',
                color : cat.color,
                data: dataType,
                total : total
            })
        }
    }) 
    allType['cat'] = type
    allType['monthOf'] = monthOf
    allType['maxNum'] = Math.max(...storeMax)
    allType['allTotal'] = storeMax.reduce((total,num)=> {return total+num})
    return allType
}
const daysInMonth = (month, year) =>{
    return new Date(year, month, 0).getDate();
}
const SearchGroupBy = (myArr, allCategory) => {
    const result = myArr.filter(item => {
        let cat = allCategory.filter(i => i.id == item.cat_id)
        item['category'] = cat[0]
        return item
    })
    return result
}
const GroupByCategoryForPieChart = (myArr,monthOf, typeExpense, category) => {
    let result = [];
    let cat_parse = JSON.parse(category)
    const map = new Map();
    for (const item of myArr) {
        if (!map.has(item.cat_id)) {
            map.set(item.cat_id, true);    // set any value to Map
            let new_item = cat_parse.filter(i => i.id == item.cat_id)
            result.push(new_item[0])
        }
    }
    let type = []
    let allType = {}
    var storeMax = []
    result.map(cat => {
        var total = 0
        const dataType = myArr.filter(item => {
            if(item.cat_id == cat.id && item.monthOf == monthOf && item.type == typeExpense){
                total = total + parseFloat(item.amount)
                return item
            }
        })
        if(dataType != ''){
            storeMax.push(total)
            type.push({
                name: cat.name,
                icon : cat.icon,
                color : cat.color,
                // data: dataType,,
                legendFontColor: cat.color,
                population :total,
                legendFontSize: 15
            })
        }
    }) 
    allType['cat'] = type
    allType['monthOf'] = monthOf
    allType['maxNum'] = Math.max(...storeMax)
    allType['allTotal'] = storeMax.reduce((total,num)=> {return total+num})
    return allType
}
const IncomeLineChart = (myArr,monthOf, typeExpense, category) => {
    let result = [];
    let cat_parse = JSON.parse(category)
    const map = new Map();
    for (const item of myArr) {
        if (!map.has(item.cat_id)) {
            map.set(item.cat_id, true);    // set any value to Map
            let new_item = cat_parse.filter(i => i.id == item.cat_id)
            result.push(new_item[0])
        }
    }
    let income = []
    let allIncome = {}
    var storeMax = []
    result.map(cat => {
        var total = 0
        const dataType = myArr.filter(item => {
            if(item.cat_id == cat.id && item.monthOf == monthOf && item.type == "income"){
                total = total + parseFloat(item.amount)
                return item
            }
        })
        if(dataType != ''){
            storeMax.push(total)
            income.push(total)
        }
    }) 
    allIncome['income'] = income
    allIncome['monthOf'] = monthOf
    allIncome['maxNum'] = Math.max(...storeMax)
    allIncome['allTotal'] = storeMax.reduce((total,num)=> {return total+num})
    return allIncome
}
const ExpenseLineChart = (myArr,monthOf, typeExpense, category) => {
    let result = [];
    let cat_parse = JSON.parse(category)
    const map = new Map();
    for (const item of myArr) {
        if (!map.has(item.cat_id)) {
            map.set(item.cat_id, true);    // set any value to Map
            let new_item = cat_parse.filter(i => i.id == item.cat_id)
            result.push(new_item[0])
        }
    }
    let expense = []
    let allexpense = {}
    var storeMax = []
    result.map(cat => {
        var total = 0
        const dataType = myArr.filter(item => {
            if(item.cat_id == cat.id && item.monthOf == monthOf && item.type == 'expense'){
                total = total + parseFloat(item.amount)
                return item
            }
        })
        if(dataType != ''){
            storeMax.push(total)
            expense.push(total)
        }
    }) 
    allexpense['expense'] = expense
    allexpense['monthOf'] = monthOf
    allexpense['maxNum'] = Math.max(...storeMax)
    allexpense['allTotal'] = storeMax.reduce((total,num)=> {return total+num})
    return allexpense
}


export {
    GroupBy,
    Method2, 
    GroupBy2, 
    GroupByReturnArr,
    GroupByCategory ,
    daysInMonth,
    GroupByCategoryBudget,
    SearchGroupBy,
    GroupByCategoryForPieChart,
    format2,
    IncomeLineChart,
    ExpenseLineChart

}