import React from "react";
import { Animated, Easing, StyleSheet } from "react-native";
import PropTypes from "prop-types";

/**
 * Fades a set of children to the top
 * @param children {Array<React.ReactElement>}
 * @param rotate {boolean}
 * @param style {object}
 * @returns {*}
 * @constructor
 */
function Flip({ children, rotate,one, style }) {
  const ReversAnim = React.useRef(new Animated.Value(0)).current;
  const [flipAnimate] = React.useState(new Animated.Value(0))
  const [isBack , setIsBack] = React.useState(true)
  React.useEffect(() => {
  }, [rotate,one]);

    const startAnimation = ()=>{
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

  return (
    // <Animated.View
    //   style={[style, { transform: [{ rotate: ReversInterpolate }] }]}
    // >
    //   {children}
    // </Animated.View>
          
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
  );
}
const stylesOriginal = StyleSheet.create({
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
});
Revers.defaultProps = {
  rotate: false,
};

Revers.propTypes = {
  rotate: PropTypes.bool.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  style: PropTypes.object,
};

export default Flip;
