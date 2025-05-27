import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const Contactus = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.Text}>Customer Care</Text>
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
      <Text style={styles.Text}>My Distributer</Text>

      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <View style={styles.cardcontainer}>
          <Text style={{ color: "gray", fontSize: 17 }}>
            ZEVOSOFT SERVICES PRIVATE LIMITED
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 15,
              marginTop: 10,
            }}
          >
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

      <Text style={styles.Text}>Quick Support</Text>

      <View style={styles.whatsappContainer}>
        <Ionicons
          name={"logo-whatsapp"}
          size={24}
          color={"white"}
          style={styles.whatsappIcon}
        />
        <Text style={styles.whatsappText}>WhatsApp</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 10,
    backgroundColor: "#fff",
    flexDirection: "column",
    padding: 10, // Added padding for better spacing
  },
  Text: {
    color: "#4A90E2",
    fontSize: 17,
    fontWeight: "500",
    paddingLeft: 10,
    // marginBottom: 10,
  },
  cardcontainer: {
    padding: 35,
    width: "90%",
    marginTop: 20,
    paddingLeft: 50,
    borderRadius: 10, 
    backgroundColor: "rgba(211, 211, 211, 0.4)",
    shadowOffset: { width: 0, height: 2 },
    // elevation: 5,
    // shadowOpacity: 0.25,
  },
  whatsappContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#25D366", // Light green color for WhatsApp background
    padding: 20,
    borderRadius: 30,
    marginTop: 20,
    width: "27%",
    alignSelf: "center",
  },
  whatsappIcon: {
    marginRight: 10,
  },
  whatsappText: {
    color: "white",
    fontSize: 12,
  },
});

export default Contactus;
