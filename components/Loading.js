import React from 'react'
import { ActivityIndicator} from 'react-native'

function Loading(props) {
    if(props.isLoading){
        return <ActivityIndicator size="large" color="#00ff00" />
    }else{
        return null
    }
    
}
export default Loading;