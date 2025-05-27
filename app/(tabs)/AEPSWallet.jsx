import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import Collapsible from "react-native-collapsible";
import { AntDesign } from "@expo/vector-icons";

const AEPSWallet = () => {
  // State to manage which content to show
  const [activeScreen, setActiveScreen] = useState("home");
  const [isCollapsed, setIsCollapsed] = useState(true);

  // Function to handle button clicks
  const handleButtonClick = (screen) => {
    setActiveScreen(screen);
  };

  const toggleAccordion = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.leftButton]}
          onPress={() => handleButtonClick("home")}
        >
          <Text style={styles.buttonText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.rightButton]}
          onPress={() => handleButtonClick("transfer")}
        >
          <Text style={styles.buttonText}>Transfer Amount</Text>
        </TouchableOpacity>
      </View>

      {activeScreen === "home" && (
        <View style={styles.content}>
          <Text style={styles.text}>AEPS Wallet Balance : 0.00</Text>
          <Text style={styles.text}>Useable Wallet Balance : 0.00</Text>
          <View
            style={{
              width: "100%",
              backgroundColor: "#FFD700",
              alignItems: "center",
              height: "10%",
              justifyContent: "center",
              marginTop: 30,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
              Bank Details
            </Text>
          </View>
          <View style={{ flexDirection: "column", marginTop: 20 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingRight: 10,
              }}
            >
              <Text style={{ fontSize: 20, color: "brown" }}>Bank Name : </Text>
              <Text style={{ fontSize: 20, color: "brown" }}>AU BANK </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingRight: 10,
              }}
            >
              <Text style={{ fontSize: 20, color: "brown" }}>IFSC Code : </Text>
              <Text style={{ fontSize: 20, color: "brown" }}>AUBL0002291 </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingRight: 10,
              }}
            >
              <Text style={{ fontSize: 20, color: "brown" }}>
                Account Number :{" "}
              </Text>
              <Text style={{ fontSize: 20, color: "brown" }}>
                1851229120758556{" "}
              </Text>
            </View>
          </View>
          {/* Add more content for Home here */}
        </View>
      )}

      {activeScreen === "transfer" && (
        <View style={styles.content}>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#fff",
              flexDirection: "column",
              width: "98%",
              height: 70,
              shadowOffset: { width: 0, height: 2 },
              elevation: 5,
              shadowOpacity: 0.25,
            }}
          >
            <Text style={{ fontSize: 18, color: "black", fontWeight: "400" }}>
              Your transaction Amount is
            </Text>
            <Text style={{ fontSize: 16 }}>0.00</Text>
          </View>

          <View
            style={{
              marginTop: 20,
              justifyContent: "space-between",
              paddingLeft: 20,
              paddingRight: 20,
              // alignItems: "center",
              backgroundColor: "#fff",
              flexDirection: "row",
              width: "98%",
              height: 70,
              shadowOffset: { width: 0, height: 2 },
              elevation: 5,
              shadowOpacity: 0.25,
            }}
          >
            <View style={{ flexDirection: "column" }}>
              <Text style={{ fontSize: 18, color: "black", fontWeight: "400" }}>
                Transaction
              </Text>
              <Text style={{ fontSize: 16 }}>Mode :</Text>
            </View>
            <View style={{ flexDirection: "column" }}>
              <Text
                style={{ fontSize: 15, color: "lightblue", fontWeight: "500" }}
              >
                Select
              </Text>
              <Text
                style={{ fontSize: 15, color: "lightblue", fontWeight: "500" }}
              >
                Mode
              </Text>
            </View>

            <TouchableOpacity onPress={toggleAccordion} style={styles.header}>
              <AntDesign
                name={isCollapsed ? "down" : "up"}
                size={24}
                color="black"
              />
            </TouchableOpacity>
          </View>
          {!isCollapsed && (
            <View style={styles.collapsibleContent}>
              <Text style={styles.optionText} onPress={toggleAccordion} >Select Mode</Text>
              <Text style={styles.optionText} onPress={toggleAccordion}>E Wallet</Text>
            </View>
          )}

          <View
            style={{
              marginTop: 20,
              justifyContent: "space-between",
              paddingLeft: 20,
              paddingRight: 20,
              // alignItems: "center",
              backgroundColor: "#fff",
              flexDirection: "row",
              width: "98%",
              height: 70,
              shadowOffset: { width: 0, height: 2 },
              elevation: 5,
              shadowOpacity: 0.25,
            }}
          >
            <View style={{ flexDirection: "column" }}>
              <Text style={{ fontSize: 18, color: "black", fontWeight: "400" }}>
                Transaction
              </Text>
              <Text style={{ fontSize: 16 }}>Amount : </Text>
            </View>

            <View
              style={{
                backgroundColor: "lightgray",
                width: "60%",
                height: 2,
                marginTop: 45,
              }}
            ></View>
          </View>
          {/* Add more content for Transfer Amount here */}
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 40,
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "#D2B48C",
                justifyContent: "center",
                alignItems: "center",
                width: "70%",
                height: 50,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 20, fontWeight: "400" }}>
                Transfer Amount
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  button: {
    height: 50,
    backgroundColor: "#4A90E2", // Sky blue color
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  leftButton: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    width: "50%",
  },
  rightButton: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    width: "50%",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  text: {
    fontSize: 18,
    color: "brown",
    fontWeight: "300",
  },
  header: {
    // justifyContent: 'center',
  },
  collapsibleContent: {
    position: 'absolute',
    top: 50, // Adjusted to lift the content upwards
    left: '1%',
    width: '98%',
    backgroundColor: '#D2B48C', // Light brown color
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    shadowOpacity: 0.25,
    padding: 10,
  },
  optionText: {
    fontSize: 16,
    paddingVertical: 5,
  },
});

export default AEPSWallet;
