import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const Help = () => {
  return (
    <View style={styles.container}>
      <View style={styles.Issuecontainer}>
        <Text style={{ color: "#4A90E2", fontSize: 22, fontWeight: "500" }}>
          Issue Related to these topics
        </Text>
      </View>
      <Text
        style={{ color: "blue", fontSize: 15, marginTop: 10, paddingLeft: 15 }}
      >
        Customer Care
      </Text>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <View style={styles.cardcontainer}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
            <Ionicons name={"call-outline"} size={24} color={"green"} />
            <Text style={{ color: "#4A90E2", fontSize: 15 }}>8619981901</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 15,
              marginTop: 20,
            }}
          >
            <Ionicons name={"mail-outline"} size={24} color={"red"} />
            <Text style={{ color: "#4A90E2", fontSize: 15 }}>
              info@zevopay.com
            </Text>
          </View>
        </View>
      </View>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <View style={styles.cardfootercontainer}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 15,
              // marginTop: 20,
            }}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="help-outline" size={30} color="white" />
            </View>

            <Text
              style={{
                color: "#4A90E2",
                fontSize: 15,
                fontWeight: "heavy",
                marginBottom: 20,
              }}
            >
              Help / Support
            </Text>
          </View>
          <Text
            style={{ color: "gray", fontSize: 10, paddingLeft: 59, bottom: 20 }}
          >
            report issues for help & Support
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    flexDirection: "column",
  },
  Issuecontainer: {
    width: "100%",
    justifyContent: "center",
    paddingLeft: 20,
    height: 60,
    backgroundColor: "#fff",
    backgroundColor: "white",
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    shadowOpacity: 0.25,
  },
  cardcontainer: {
    padding: 35,
    width: "90%",
    marginTop: 20,
    paddingLeft: 50,
    borderRadius: 10,
    backgroundColor: "rgba(211, 211, 211, 0.4)",
    // backgroundColor: "rgba(211, 211, 211, 0.1)",
    shadowOffset: { width: 0, height: 2 },
    // elevation: 5,
    // shadowOpacity: 0.25,
  },
  cardfootercontainer: {
    flexDirection: "column",
    marginTop: 30,
    padding: 35,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    shadowOpacity: 0.25,
    width: "90%",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomColor: "#fff",
    borderTopColor: "#fff",
    borderLeftColor: "#fff",
    borderRightColor: "#fff",
  },
  iconContainer: {
    backgroundColor: "#4A90E2",
    padding: 10,
    borderRadius: 50, // Makes the container circular
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Help;
