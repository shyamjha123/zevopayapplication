import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import Logo from "../(tabs)/assests/logo.png";

const Splashscreen = () => {
  return (
    <View style={style.container}>
      <View style={style.Imagecontainer}>
        <Image source={Logo} style={style.image} />
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  Imagecontainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation:4 ,
    borderWidth:0.5,
    borderColor:'lightgray',
    backgroundColor: "#fff",
    width: "70%",
    height: "40%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 160,
  },
  image: {
    width: "105%",
    height: "40%",
    borderRadius: 150,
  },
});

export default Splashscreen;
