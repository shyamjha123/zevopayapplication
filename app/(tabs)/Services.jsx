import { View, Text, StyleSheet,SafeAreaView } from "react-native";
import React from "react";

const Services = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={{color:"white"}}>Services</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "blue",
    width: "100%",
    height: "100%",
  },
});

export default Services;
