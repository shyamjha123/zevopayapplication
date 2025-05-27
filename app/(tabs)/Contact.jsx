import { View, Text, StyleSheet,SafeAreaView } from "react-native";
import React from "react";

const Contact = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={{color:"white"}}>Contact</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "pink",
    width: "100%",
    height: "100%",
  },
});

export default Contact;
