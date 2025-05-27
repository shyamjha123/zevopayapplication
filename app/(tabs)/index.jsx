import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import React from "react";
import Mainwallet from "../(tabs)/Mainwallet";
import Login from "../(tabs)/Login";

const index = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Login />
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
