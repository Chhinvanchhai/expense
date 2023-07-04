import React from "react";
import { Animated, Easing } from "react-native";
import PropTypes from "prop-types";

/**
 * Fades a set of children to the top
 * @param children {Array<React.ReactElement>}
 * @param rotate {boolean}
 * @param style {object}
 * @returns {*}
 * @constructor
 */
function Revers({ children, rotate,one, style }) {
  const ReversAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
      console.log(one)
    startAnimation()
  }, [rotate,one]);

  const startAnimation = ()=>{
    Animated.timing(ReversAnim, {
        toValue: rotate ? 1 : 0,
        easing: Easing.linear,
        duration: 2500,
        useNativeDriver: true,
      }).start();
  }
  
  const ReversInterpolate = ReversAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <Animated.View
      style={[style, { transform: [{ rotate: ReversInterpolate }] }]}
    >
      {children}
    </Animated.View>
  );
}

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

export default Revers;
