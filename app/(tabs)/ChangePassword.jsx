import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import React from "react";

const ChangePassword = () => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Current password"
        secureTextEntry={true}
        keyboardType="numeric"
        maxLength={6}
        placeholderTextColor={"#1E3A5F"}
      />

      <TextInput
        style={styles.input}
        placeholder="New password"
        secureTextEntry={true}
        keyboardType="numeric"
        maxLength={6}
        placeholderTextColor={"#1E3A5F"}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm password"
        secureTextEntry={true}
        keyboardType="numeric"
        maxLength={6}
        placeholderTextColor={"#1E3A5F"}
      />

      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>UPDATE PASSWORD</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: "rgba(211, 211, 211, 0.3)",
    shadowOffset: { width: 0, height: 2 },
    fontSize: 16,
    width: "100%", // Ensures the input fields take the full width of the container
  },
  button: {
    backgroundColor: "#1E3A5F", // Dark matte blue background color
    padding: 15,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    width: "100%", // Matches the width of the input fields
    height: 50,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default ChangePassword;
