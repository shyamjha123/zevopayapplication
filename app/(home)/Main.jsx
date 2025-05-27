import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import React from "react";
import Home from "./Home";

const index = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Home />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    width: "100%",
    height: "100%",
  },
});

export default index;
