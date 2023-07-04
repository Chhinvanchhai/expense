import React from "react";
import { StyleSheet, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/core";
import { useTheme } from "react-native-paper";
import PropTypes from "prop-types";
// import PlatformUtils from "../../utils/Platform";

/**
 * @param navigation
 * @param style {object}
 * @param position {string}
 * @returns {*}
 * @constructor
 */
const isAndroid = true
function Close({ style, position, distance }) {
  const navigation = useNavigation();
  const { colors } = useTheme();
  // const _position = position === "left" ? { left: 20 } : { right: 20 };
  const _distance = position === "left" ? {left: distance} : {right: distance}
  return isAndroid ? (
    <MaterialCommunityIcons
      onPress={() => navigation.goBack()}
      style={[styles.container,_distance]}
      name="close"
      color={colors.text}
      size={30}
    />
  ) : (
    <View style={styles.iosBarContainer}>
      <View
        style={[
          styles.iosBarContent,
          {
            backgroundColor: colors.text + "3D",
          },
        ]}
      />
    </View>
  );
}

Close.propTypes = {
  style: PropTypes.object,
  position: PropTypes.oneOf(["left", "right"]),
};

Close.defaultProps = {
  position: "left",
  distance: 20
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 10,
    opacity: 0.5,
    zIndex: 10,
  },
  iosBarContainer: {
    height: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  iosBarContent: {
    height: 5,
    width: 75,
    borderRadius: 25,
    marginTop: 20,
  },
});

export default Close;
