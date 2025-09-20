import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const Help = () => {
  return (
    <View style={styles.container}>
      <View style={styles.Issuecontainer}>
        <Text style={styles.headingstyle}>
          Issue Related to these topics
        </Text>
      </View>
      <Text
        style={styles.customertex}
      >
        Customer Care
      </Text>

      <View style={styles.cardcontainerparent}>
        <View style={styles.cardcontainer}>
          <View style={styles.cardcontainerIcon}>
            <Ionicons name={"call-outline"} size={24} color={"green"} />
            <Text style={styles.numbertext}>8619981901</Text>
          </View>

          <View
            style={styles.mailcontainertext}
          >
            <Ionicons name={"mail-outline"} size={24} color={"red"} />
            <Text style={styles.mailtext}>
              info@zevopay.com
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.cardfootercontainerParent}>
        <View style={styles.cardfootercontainer}>
          <View
            style={styles.cardfootercontainericon}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="help-outline" size={30} color="white" />
            </View>

            <Text
              style={styles.helptext}
            >
              Help / Support
            </Text>
          </View>
          <Text
            style={styles.reporttext}
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
    shadowOffset: { width: 0, height: 2 },
  },
  cardfootercontainerParent: {
    justifyContent: "center",
    alignItems: "center"
  },
  cardfootercontainericon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
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
  helptext: {
    color: "#4A90E2",
    fontSize: 15,
    fontWeight: "heavy",
    marginBottom: 20,
  },
  reporttext: {
    color: "gray",
    fontSize: 10,
    paddingLeft: 59,
    bottom: 20
  },
  iconContainer: {
    backgroundColor: "#4A90E2",
    padding: 10,
    borderRadius: 50, // Makes the container circular
    justifyContent: "center",
    alignItems: "center",
  },
  headingstyle: {
    color: "#4A90E2",
    fontSize: 22,
    fontWeight: "500"
  },
  customertex: {
    color: "blue",
    fontSize: 15,
    marginTop: 10,
    paddingLeft: 15
  },
  cardcontainerparent: {
    justifyContent: "center",
    alignItems: "center"
  },
  cardcontainerIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15
  },
  numbertext: {
    color: "#4A90E2",
    fontSize: 15
  },
  Mailcontainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    marginTop: 20,
  },
  mailtext: {
    color: "#4A90E2",
    fontSize: 15
  },
  mailcontainertext: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    marginTop: 20,
  }

});

export default Help;
