import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const Topup = () => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.inputContainer}>
          <Ionicons name="call" size={30} color="gray" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Mobile Number"
            keyboardType="numeric"
          />
          <MaterialIcons
            name="person"
            size={30}
            color="gray"
            style={styles.icon}
          />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons
            name="cash-outline"
            size={24}
            color="black"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Amount"
            keyboardType="numeric"
          />
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>SEND</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20, // Ensure there is space at the bottom
  },
  inputContainer: {
    flexDirection: "row",
    borderRadius: 6,
    alignItems: "center",
    backgroundColor: "rgba(211, 211, 211, 0.3)",
    paddingHorizontal: 10,
    width: "80%",
    height: 60, // Adjusted height
    marginBottom: 10, // Add margin between input fields
  },
  input: {
    flex: 1,
    marginHorizontal: 10,
    fontSize: 16,
  },
  icon: {
    marginHorizontal: 5,
  },
  buttonContainer: {
    padding: 20,
    marginBottom:70,
    alignItems: "center",
  },
  button: {
    width: "80%",
    height: 50, // Adjusted height
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "orange",
    borderRadius: 6, // Optional: add border radius for rounded corners
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default Topup;
