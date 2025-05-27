import { View, Text, StyleSheet, Alert, Pressable } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const CommonCards = ({ iconname, text, footertext, color, onPress }) => {
  return (
    <Pressable onPress={()=> onPress()}>
    <View style={styles.cardContainer} >
      <View style={styles.iconContainer}>
        <Ionicons
          name={iconname ? iconname : "cloud-upload"}
          size={40}
          color={color ? color : "darkslateblue"}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text}>{text ? text : "Virtual Account REPORT"}</Text>
        <Text style={styles.footerText}>
          {footertext ? footertext : "Check all  transactions here"}
        </Text>
      </View>
      <Ionicons name="arrow-forward" size={24} color="black" />
    </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    elevation: 3,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    width: "100%",
  },
  iconContainer: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    backgroundColor: "rgba(211, 211, 211, 0.4)",
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    flexDirection: "column",
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
  footerText: {
    color: "lightgray",
    fontWeight: "500",
  },
});

export default CommonCards;
