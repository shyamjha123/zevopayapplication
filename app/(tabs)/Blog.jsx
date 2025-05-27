import { View, Text, StyleSheet,SafeAreaView } from "react-native";
import React from "react";

const Blog = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={{color:"white"}}>Blog</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "yellow",
    width: "100%",
    height: "100%",
  },
});

export default Blog;
