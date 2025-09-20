
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Api from "../common/api/apiconfig";

const Mpin = () => {
  // state 
  const [state, setState] = useState({
    mpin: "",
    loading: false,
    token: null,
    passwordVisible: false,
  });

  const router = useRouter();

  // Retrieve token from AsyncStorage on component mount
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        if (storedToken) {
          setState((prevState) => ({
            ...prevState,
            token: storedToken
          }));
        } else {
          Alert.alert("Error", "User not authenticated. Token is missing.");
        }
      } catch (error) {
        Alert.alert("Error", "Failed to retrieve token.");
      }
    };

    fetchToken();
  }, []);


  const handleVerify = async () => {
    if (!state.mpin.trim()) {
      Alert.alert("Error", "Please enter your MPIN.");
      return;
    }

    setState((prevState) => ({ ...prevState, loading: true }));

    try {
      const response = await fetch(Api.MPIN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${state.token}`,
        },
        body: JSON.stringify({ mpin: state.mpin.trim() }),
      });

      const data = await response.json();
      console.log(data, "dataaagya");

      if (response.ok) {
        const {
          name,
          email,
          phone,
          virtual_account,
          status,
          address,
          aadharNumber,
          panNumber,
          state,
          shopName,
          shopAddress,
          gstNumber,
          businessPanNo,
          landlineNumber,
          landlineSTDCode,
          country,
        } = data;

        await AsyncStorage.setItem("userName", name);
        await AsyncStorage.setItem("userEmail", email);
        await AsyncStorage.setItem("userPhone", phone);
        await AsyncStorage.setItem("virtual_account", virtual_account);
        await AsyncStorage.setItem("status", status);
        await AsyncStorage.setItem("address", address);
        await AsyncStorage.setItem("aadharNumber", aadharNumber);
        await AsyncStorage.setItem("panNumber", panNumber);
        await AsyncStorage.setItem("state", state);
        await AsyncStorage.setItem("shopName", shopName);
        await AsyncStorage.setItem("shopAddress", shopAddress);
        await AsyncStorage.setItem("gstNumber", gstNumber);
        await AsyncStorage.setItem("businessPanNo", businessPanNo);
        await AsyncStorage.setItem("landlineNumber", landlineNumber);
        await AsyncStorage.setItem("landlineSTDCode", landlineSTDCode);
        await AsyncStorage.setItem("country", country);

        Alert.alert("Success", "MPIN verified successfully!");
        router.push("/Dashboard");
      } else {
        Alert.alert("Verification Failed", data.message || "Invalid MPIN.");
      }
    } catch (error) {
      Alert.alert(
        "Mpin Verification Failed",
        error.message || "An error occurred during verification. Please try again."
      );
    } finally {
      setState((prevState) => ({ ...prevState, loading: false }));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.mpinContainer}>
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={24} color="#ccc" />

          <View style={styles.passwordWrapper}>
            <TextInput
              style={styles.input}
              placeholder="MPIN"
              placeholderTextColor="#aaa"
              secureTextEntry={!state.passwordVisible}
              value={state.mpin}
              onChangeText={(text) =>
                setState((prevState) => ({
                  ...prevState,
                  mpin: text
                }))
              }
              keyboardType="numeric"
            />

            <TouchableOpacity
              style={styles.iconButton}
              onPress={() =>
                setState((prevState) => ({
                  ...prevState,
                  passwordVisible: !prevState.passwordVisible
                }))
              }
            >
              <Ionicons
                name={state.passwordVisible ? "eye-off" : "eye"}
                size={24}
                color="gray"
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleVerify}
          disabled={state.loading}
        >
          <Text style={styles.buttonText}>
            {state.loading ? "Verifying..." : "Verify"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  mpinContainer: {
    marginTop: 30,
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 10,
    backgroundColor: "#fff",
  },
  passwordWrapper: {
    flex: 1, // Make it take full width
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 40,
    paddingLeft: 10,
  },
  iconButton: {
    padding: 10,
  },
  button: {
    justifyContent: "center",
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
});

export default Mpin;

