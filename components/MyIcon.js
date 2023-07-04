import React from 'react'
import { createIconSetFromIcoMoon } from '@expo/vector-icons';
const Icon = createIconSetFromIcoMoon(
    require('../assets/fonts/selection.json'),
    'IcoMoon',
    'icomoon.ttf'
);

const MyIcon = (name, color, size, style)=> {
    React.useEffect(()=> {
    },[])
    return (
        <Icon name={name} size={size} color={color} style={[style]} />
    )
}
export default MyIcon