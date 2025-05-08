import React from "react";
import { Image, StyleSheet, View } from "react-native";

const MyComponent = () => {
  return (
    <View style={styles.container}>
      <Image source={require("../assets/images/404.png")} style={styles.image} resizeMode="contain" />
    </View>
  );
};

export default MyComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffff",
  },
  image: {
    width: 300,
    height: 300,
  },
});
