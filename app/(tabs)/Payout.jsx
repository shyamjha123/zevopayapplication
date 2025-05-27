
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  SafeAreaView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Modal,
  ScrollView,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Formik } from "formik";
import * as Yup from "yup";

// Validation schema
// Validation schema
const validationSchema = Yup.object().shape({
  accountNumber: Yup.string().required("Account Number is required"),
  ifscCode: Yup.string().required("IFSC Code is required"),
  beneficiaryName: Yup.string().required("Beneficiary Name is required"),
  amount: Yup.number()
    .required("Amount is required")
    .positive("Amount must be a positive number")
    .min(1, "Amount must be at least 1"),
});


const Payout = () => {

  const [modalVisible, setModalVisible] = useState(false);
  const [mpinModal, setmpinModal] = useState(false);
  const [mpin, setMpin] = useState(""); // Store MPIN input
  const [selectedOption, setSelectedOption] = useState("");
  const [token, setToken] = useState(null);
  const [formValues, setFormValues] = useState(null);

  // Replace with actual token

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        if (storedToken) {
          setToken(storedToken); // Token ko state me set kar rahe hain
        } else {
          console.error("Token not found in AsyncStorage");
        }
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };

    fetchToken();
  }, []);

  useEffect(() => {
    setModalVisible(true); // Page load hone pe modal open hoga
  }, []);

  const handleSelection = (value) => {
    if (value) {
      setSelectedOption(value);
      setModalVisible(false); // Mode select hone ke baad modal close hoga
    }
  };

  const openMpinModal = (values) => {
    console.log("Opening MPIN Modal..."); // Debug log
    setFormValues(values);
    setmpinModal(true);
  };

  const handleApiCall = async (resetForm) => {
    if (!formValues) {
      Alert.alert("Error", "Form values are missing. Please try again.");
      return;
    }

    if (!token) {
      Alert.alert("Error", "Authentication token is missing. Please login again.");
      return;
    }

    try {
      const response = await fetch("https://zevopay.online/api/v1/webhook/payout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tellerBranch: "41101",
          tellerID: "9903",
          debitAccountNumber: "86199819013",
          creditAccountNumber: formValues.accountNumber, // Ensure formValues is set
          remitterName: "ZEVOPAY",
          amount: Number(formValues.amount),
          currency: "INR",
          transactionType: selectedOption,
          paymentDescription: "1T45541",
          beneficiaryIFSC: formValues.ifscCode,
          beneficiaryName: formValues.beneficiaryName,
          beneficiaryAddress: "Jodhpur",
          emailId: "deepakgauttam88@gmail.com",
          mobileNo: "7791999124",
          messageType: "payment",
        }),
      });

      const result = await response.text();
      console.log("API Response:", result);

      try {
        const jsonData = JSON.parse(result);

        if (response.ok) {
          Alert.alert("Success", "Payment successful!");
          resetForm();
          setmpinModal(false);
        } else {
          Alert.alert("Error", jsonData.message || "Payment failed");
        }
      } catch (jsonError) {
        console.error("JSON Parsing Error:", jsonError);
        Alert.alert("Error", "Unexpected response from server.");
      }
    } catch (error) {
      console.error("API Error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  // const handleMpinVerification = async (mpin, resetForm) => {
  //   if (!formValues) {
  //     Alert.alert("Error", "Form values are missing. Please try again.");
  //     return;
  //   }
  
  //   if (!token) {
  //     Alert.alert("Error", "Authentication token is missing. Please login again.");
  //     return;
  //   }
  
  //   const payload = { mpin: mpin.trim() };
  
  //   try {
  //     // Set up the timeout (1s)
  //     const timeout = new Promise((_, reject) =>
  //       setTimeout(() => reject(new Error("Invalid MPIN. Please try again.")), 1000)
  //     );
  
  //     // API request with timeout
  //     const mpinResponse = await Promise.race([
  //       fetch("https://zevopay.online/api/v1/user/verify-mpin", {
  //         method: "POST",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(payload),
  //       }),
  //       timeout,
  //     ]);
  
  //     const mpinResult = await mpinResponse.json();
  //     if (!mpinResponse.ok) {
  //       Alert.alert("Error", mpinResult.message || "MPIN verification failed");
  //       return;
  //     }  
  //     // Proceed to Payout API if MPIN verification is successful
  //     handleApiCall(resetForm);
  //   } catch (error) {

  //     Alert.alert("Error", error.message || "Failed to verify MPIN. Please try again.");
  //   }
  // };
  


  const handleMpinVerification = async (mpin, resetForm) => {
    if (!formValues) {
      Alert.alert("Error", "Form values are missing. Please try again.");
      return;
    }
  
    if (!token) {
      Alert.alert("Error", "Authentication token is missing. Please login again.");
      return;
    }
  
    const payload = { mpin: mpin.trim() };
  
    try {
      // Timeout after 1 second
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("MPIN verification failed. Please try again.")), 3000)
      );
  
      // API request with timeout
      const mpinResponse = await Promise.race([
        fetch("https://zevopay.online/api/v1/user/verify-mpin", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }),
        timeout,
      ]);
  
      const mpinResult = await mpinResponse.json();
      console.log(mpinResult, "mpinResultaaya");
  
      if (!mpinResponse.ok) {
        Alert.alert("Error", mpinResult.message || "MPIN verification failed.");
        return;
      }
  
      // If MPIN verification is successful, proceed to payout API
      handleApiCall(resetForm);
    } catch (error) {
      Alert.alert("Error", error.message || "MPIN verification failed. Please try again.");
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      {/* MPIN Verification Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={mpinModal}
        onRequestClose={() => setmpinModal(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>Enter MPIN to Verify <Text style={styles.asterick}>*</Text></Text>

            <TextInput
              style={styles.textfieldMpin}
              placeholder="Enter MPIN"
              // secureTextEntry
              keyboardType="numeric"
              onChangeText={(text) => setMpin(text)}
            />

            <Pressable
              style={styles.verifyButton}
              onPress={() => handleMpinVerification(mpin, () => { })}
            >
              <Text style={{color:"#fff"}}>Verify</Text>
            </Pressable>

          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>Select Payment Mode</Text>
            <Picker
              selectedValue={selectedOption}
              onValueChange={(itemValue) => handleSelection(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select Transaction Mode:" value="" />
              <Picker.Item label="IMPS" value="IMPS" />
              <Picker.Item label="IFT" value="IFT" />
            </Picker>
          </View>
        </View>
      </Modal>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Formik
            initialValues={{
              accountNumber: "",
              ifscCode: "",
              beneficiaryName: "",
              amount: "",
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => openMpinModal(values)}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              resetForm,
            }) => (
              <View style={styles.childrencontainer}>
                <Text style={styles.label}>Account Number *</Text>
                <TextInput
                  style={styles.textfield}
                  placeholder="Account Number"
                  onChangeText={handleChange("accountNumber")}
                  onBlur={handleBlur("accountNumber")}
                  value={values.accountNumber}
                  keyboardType="numeric"
                />
                {touched.accountNumber && errors.accountNumber && (
                  <Text style={styles.errorText}>{errors.accountNumber}</Text>
                )}

                <Text style={styles.label}>IFSC *</Text>
                <TextInput
                  style={styles.textfield}
                  placeholder="IFSC Code"
                  onChangeText={handleChange("ifscCode")}
                  onBlur={handleBlur("ifscCode")}
                  value={values.ifscCode}
                />
                {touched.ifscCode && errors.ifscCode && (
                  <Text style={styles.errorText}>{errors.ifscCode}</Text>
                )}

                <Text style={styles.label}>Beneficiary Name *</Text>
                <TextInput
                  style={styles.textfield}
                  placeholder="Beneficiary Name"
                  onChangeText={handleChange("beneficiaryName")}
                  onBlur={handleBlur("beneficiaryName")}
                  value={values.beneficiaryName}
                />
                {touched.beneficiaryName && errors.beneficiaryName && (
                  <Text style={styles.errorText}>{errors.beneficiaryName}</Text>
                )}

                <Text style={styles.label}>Amount *</Text>
                <TextInput
                  style={styles.textfield}
                  placeholder="Amount"
                  onChangeText={handleChange("amount")}
                  onBlur={handleBlur("amount")}
                  value={values.amount}
                  keyboardType="numeric"
                />
                {touched.amount && errors.amount && (
                  <Text style={styles.errorText}>{errors.amount}</Text>
                )}

                <View style={styles.buttoncontainer}>
                  <Pressable style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Pay</Text>
                  </Pressable>
                  <Pressable
                    style={styles.buttonsecond}
                    onPress={() => resetForm()}
                  >
                    <Text style={styles.buttonsecondText}>Reset</Text>
                  </Pressable>
                </View>
              </View>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Payout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContainer: {
    flexGrow: 1, // Allows the ScrollView to take up the full space
    justifyContent: "space-between", // Ensures fields and buttons are aligned as needed
  },
  label: {
    alignSelf: "flex-start", // Text ko left se start karne ke liye
    marginLeft: 10, // TextInput se match karane ke liye
    fontSize: 16, // Thoda bada aur readable banane ke liye
    marginBottom: -15, // Label ko TextInput ke bilkul close karne ke liye
    color: "black", // Dark color for better visibility
  },
  asterick: {
    color: "red"
  },
  childrencontainer: {
    marginTop: 30,
    gap: 20,
    alignItems: "center",
    backgroundColor: "white",
  },
  textfield: {
    width: "90%",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  textfieldMpin: {
    width: "90%",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    // borderColor:"black",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  buttoncontainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginTop: 20,
  },
  button: {
    width: "40%",
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4A90E2",
    borderRadius: 8,
  },
  buttonsecond: {
    width: "40%",
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(211, 211, 211, 0.3)",
    borderRadius: 8,
  },
  verifyButton: {
    backgroundColor: "#4A90E2", // Dark matte blue background color
    padding: 10,
    marginTop:20,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    width: "70%", // Matches the width of the input fields
    height: 40,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  buttonsecondText: {
    color: "black",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: -15,
    marginBottom: 10,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 10,
  },
  picker: {
    width: "100%",
    height: 50,
  },
  pickerItem: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});



























































































































