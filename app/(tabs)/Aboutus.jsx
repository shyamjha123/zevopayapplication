import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import React from "react";

const Aboutus = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={{color:"white"}}>Aboutus</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "red",
    width: "100%",
    height: "100%",
  },
});

export default Aboutus;
