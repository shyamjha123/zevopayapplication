import { View, Text, Image, Dimensions, StyleSheet } from "react-native";
import React from "react";
import Bank from "../(tabs)/assests/bank.png";
import Payment from "../(tabs)/assests/payment.png";
import Card from "../(tabs)/assests/card.png";

const windowWidth = Dimensions.get("window").width;

const Homescreencards = () => {
  return (
    <View style={{ flexDirection: "row", marginTop: 10, gap: 10 }}>
      <View style={styles.squareBox}>
        <View style={{ width: 35, height: 35 }}>
          <Image source={Bank} style={{ width: "100%", height: "100%" }} />
        </View>
        <Text style={{ color: "#fff" }}>DMT</Text>
      </View>
      <View style={styles.squareBox}>
        <View style={{ width: 35, height: 35 }}>
          <Image source={Payment} style={{ width: "100%", height: "100%" }} />
        </View>
        <Text style={{ color: "#fff" }}>UPI</Text>
      </View>
      <View style={styles.squareBox}>
        <View style={{ width: 35, height: 35 }}>
          <Image source={Card} style={{ width: "100%", height: "100%" }} />
        </View>
        <Text style={{ color: "#fff" }}>Card Payment</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingLeft: 40,
    paddingRight: 40,
    justifyContent: "center",
  },
  headercontainer: {
    height: "8%",
    marginTop: 30,
    justifyContent: "space-between",
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    shadowOpacity: 0.25,
    paddingLeft: 30,
    paddingRight: 30,
    flexDirection: "row",
    backgroundColor: "white",
  },
  Mainwallet: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  Aepswallet: {
    gap: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    shadowOpacity: 0.25,
    borderRadius: 5,
    height: 130,
    width: Dimensions.get("window").width - 80,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 5,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  Itemcontainer: {
    justifyContent: "space-between",
    marginTop: 20,
    paddingLeft: 40,
    paddingRight: 40,
    flexDirection: "row",
  },
  logocontainer: {
    flexDirection: "column",
    alignItems: "center",
    // justifyContent:"center"
  },
  footercontainer: {
    backgroundColor: "#fff",
    marginTop: 20,
    // padding:80,
    // gap:20,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    shadowOpacity: 0.25,
    borderRadius: 10,
    flexDirection: "column",
    width: Dimensions.get("window").width - 50,
  },
  squareBox: {
    width: windowWidth * 0.3, // 50% of the screen's width
    height: windowWidth * 0.3, // Ensure the height is the same as width to make it a square
    backgroundColor: "#3A4E7A", // Matte blue background
    justifyContent: "center",
    flexDirection: "column",
    borderRadius: 7,
    gap: 10,
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 16,
  },
});

export default Homescreencards;
