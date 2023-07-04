import React from 'react'
import {Text,View,StyleSheet,Dimensions,Animated,ScrollView, TouchableOpacity} from 'react-native'
import { MaterialCommunityIcons,FontAwesome5, Feather } from '@expo/vector-icons'; 
const width = Dimensions.get('window').width;
import * as Animatable from 'react-native-animatable';
import Rotation from '../components/animations/Rotation'
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import Spin from '../components/animations/Spin'
import Revers from '../components/animations/Revers'
const Utilities = ({navigation,route}) => {
    const [animate1, setAnimate1] = React.useState(new Animated.Value(1))
    const [scaleX] = React.useState(new Animated.Value(1))
    const [scaleY] = React.useState(new Animated.Value(1))
    const [roataionUp] = React.useState(new Animated.Value(1))
    const [flipAnimate] = React.useState(new Animated.Value(0))
    const [flipValue, setFlipValue]  = React.useState(0)
    const [isBack , setIsBack] = React.useState(true)
    React.useEffect(()=> {
 
    },[])
    const setFlipCardListener = ()=>{

    }

    const moveBall = ()=>{
        Animated.timing(animate1,{
            toValue: 0,
            duration: 5000,
            useNativeDriver: false
        }).start()
    }
    const moveBallOut= ()=>{
        Animated.timing(animate1,{
            toValue: 1,
            duration: 5000,
            useNativeDriver: false
        }).start()
    }
    const scall= ()=>{
        Animated.timing(scaleX,{
            toValue: 10,
            duration: 5000,
            useNativeDriver: false
        }).start()
    }
    const scallHide= ()=>{
        Animated.timing(scaleX,{
            toValue: 0.3,
            duration: 5000,
            useNativeDriver: false
        }).start()
    }

    const Collaps = ()=> {
        
        if(isBack == true){
            Animated.spring(flipAnimate,{
                toValue: 0,
                useNativeDriver: true,
                friction: 8,
                tension: 10
            }).start()
        }else{
            Animated.spring(flipAnimate,{
                toValue: 180,
                useNativeDriver: true,
                friction: 8,
                tension: 10
            }).start()
        }
        setIsBack(!isBack)
    
    }
    const fontInterpolate = flipAnimate.interpolate({
        inputRange: [0, 180],
        outputRange: ["0deg", "180deg"],
    });
    const backInterpolate = flipAnimate.interpolate({
        inputRange: [0, 180],
        outputRange: ["180deg", "360deg"],
    }); 
    return(
        <ScrollView>
        <View style={styles.container}>
             <Animatable.View>
                <View style={{height: 60}}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Feather name="arrow-left" size={24} color="black"/>
                    <Text>{route.params.category}</Text>
                    </TouchableOpacity>
                </View>
                <Animatable.Text 
                animation="fadeInUpBig"
                duration={500}
                >
                    <Feather name={route.params.icon} size={40}  color="black" />
                </Animatable.Text>
            </Animatable.View> 
            {/* <Rotation style={{ opacity: 0.7 }} rotate={true}>
                <Feather name={route.params.icon} size={40}  color="black" />
            </Rotation> */}
            <Revers style={{ opacity: 0.9 }} rotate={true} one={route.params.icon}>
                <Card>
                    <Card.Title title="Card Title" subtitle="Card Subtitle" />
                    <Card.Content>
                        <Title>Card title</Title>
                        <Paragraph>Card content</Paragraph>
                    </Card.Content>
                    <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
                    <Card.Actions>
                        <Button>Cancel</Button>
                        <Button>Ok</Button>
                    </Card.Actions>
                </Card>
            </Revers>
            {/* Learn animte */}
            <Animated.View style={[styles.round, { opacity: animate1}]}>
                <View>
                    <Text>Animate Me</Text>
                </View>
            </Animated.View>
            
            <Animated.View 
                 style={
                    [
                            styles.tranform, 
                            {   transform: [
                                    { scale: scaleX },
                                    { perspective: 1000 } ,
                                    {translateX: scaleY}
                                ]
                            }
                        ]
                    }
            >
                <View style={styles.tranform}>
                    <Text>Scale  Me</Text>
                </View>
            </Animated.View>
            
            <View style={{position: 'relative', width: 300, height: 300 }}>
                    <Animated.View 
                        style={
                            [
                                    styles.front, 
                                    styles.Card,
                                    {   transform: [
                                        { 
                                            rotateY: fontInterpolate  },
                                        ]
                                    }
                                ]
                            }
                    >
                        <View >
                            <Text>Front Card me</Text>
                        </View>
                    </Animated.View>

                    <Animated.View 
                        style={
                            [
                                    styles.tranform, 
                                    styles.Card,
                                    {   transform: [
                                        { 
                                            rotateY:backInterpolate  },
                                        ]
                                    }
                                ]
                            }
                    >
                        <View>
                            <Text>Back Card me</Text>
                        </View>
                    </Animated.View>
            </View>
                   
     

           <TouchableOpacity onPressIn={moveBall}>
               <Text>Move In</Text>
           </TouchableOpacity>
           <TouchableOpacity style={{width: 200, background: 'blue'}} onPressIn={moveBallOut}>
               <Text>Move Out</Text>
           </TouchableOpacity>
           <TouchableOpacity style={{width: 200,height:30, background: 'blue'}} onPressIn={scall}>
               <Text>Scall Me</Text>
           </TouchableOpacity>
           <TouchableOpacity style={{width: 200,height:30, background: 'blue'}} onPressIn={scallHide}>
               <Text>Hide Scall</Text>
           </TouchableOpacity>

           <TouchableOpacity style={{width: 200,height:30, background: 'blue'}} onPressIn={Collaps}>
               <Text>Flip Card</Text>
           </TouchableOpacity>
           
        </View>
        </ScrollView>
    )
}
export default Utilities

const styles =  StyleSheet.create({
    container: {
        flex: 1, 
        marginHorizontal: 10,
        marginTop: 30
    },
    round: {
        backgroundColor: 'blue',
        width: 100,
        height: 100,
        borderRadius: 50
    },
    tranform: {
        width: 200,
        marginTop: 10,
        marginBottom: 10,
        height: 200,
        backgroundColor: 'red'
    },
    front: {
        width: 200,
        marginTop: 10,
        marginBottom: 10,
        height: 200,
        backgroundColor: 'blue'
    },
    Card: {
        backfaceVisibility: 'hidden',
        position: 'absolute'
    }
})