
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Modal,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useNavigation } from '@react-navigation/native';

import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Formik } from "formik";
import * as Yup from "yup";
import Api from "../common/api/apiconfig";

// Validation schema
// Validation schema
const validationSchema = Yup.object().shape({
  accountNumber: Yup.string().required("Account Number is required"),
  ifscCode: Yup.string().required("IFSC Code is required"),
  beneficiaryName: Yup.string().required("Beneficiary Name is required"),
  remark: Yup.string(),
  amount: Yup.number()
    .required("Amount is required")
    .positive("Amount must be a positive number")
    .min(1, "Amount must be at least 1"),
});


const Zpayout = () => {
  const router = useRouter();
  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);
  const [mpinModal, setmpinModal] = useState(false);
  const [mpin, setMpin] = useState(""); // Store MPIN input
  const [selectedOption, setSelectedOption] = useState("");
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false); // Added loading state
  const [formValues, setFormValues] = useState(null);
  const [formReset, setFormReset] = useState(() => () => { }); // Store resetForm function
  const [userapi, setUserapi] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0); // State to trigger re-render

  // user Api 
  const fetchUserApi = async () => {
    const storedToken = await AsyncStorage.getItem("token");
    try {
      const response = await fetch(Api.USER_URL, {
        headers: {
          // method:"GET",
          Authorization: `Bearer ${storedToken}`,
          "Content-Type": "application/json",
        }
      });
      if (!response.ok) {
        throw new error(`HTTP error! : status : ${response.status}`);
      }
      const data = await response.json();
      setUserapi(data);
      console.log(data.mode, "dataresponseofUser");
    } catch (err) {

      console.log(err, "err")

    }

  };

  useEffect(() => {
    fetchUserApi();
  }, [])

  console.log(userapi, "userApidataresponse");

  useEffect(() => {
    setModalVisible(true); // Page load hone pe modal open hoga
  }, [refreshKey]); // Page reloads when refreshKey updates

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


  useEffect(() => {
    if (formValues) {
      setmpinModal(true);
    }
  }, [formValues]); // Ensure modal opens instantly when formValues are set

  const handleSelection = (value) => {
    if (value) {
      setSelectedOption(value);
      setModalVisible(false); // Mode select hone ke baad modal close hoga
    }
  };


  const openMpinModal = (values, resetForm) => {
    console.log("Opening MPIN Modal..."); // Debug log

    setFormValues(values); // ✅ Store form values
    setFormReset(() => resetForm); // ✅ Store resetForm function

    setTimeout(() => {
      setmpinModal(true); // ✅ Open MPIN modal after a small delay
    }, 100);
  };


  const handleApiCall = async (resetForm) => {
    if (!formValues) {
      Alert.alert("Error", "Form values are missing. Please try again.");
      setmpinModal(false); // Close MPIN modal on error
      return;
    }

    if (!token) {
      Alert.alert("Error", "Authentication token is missing. Please login again.");
      setmpinModal(false); // Close MPIN modal on error
      return;
    }

    try {
      const email = await AsyncStorage.getItem("userEmail");
      const phone = await AsyncStorage.getItem("userPhone");
      const Name = await AsyncStorage.getItem("userName");
      const response = await fetch(Api.PAYOUT_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tellerBranch: "41101",
          tellerID: "9903",
          debitAccountNumber: "86199819013",
          creditAccountNumber: formValues.accountNumber,
          remitterName: Name,
          amount: Number(formValues.amount),
          currency: "INR",
          transactionType: selectedOption,
          paymentDescription: formValues.remark || ".",
          beneficiaryIFSC: formValues.ifscCode,
          beneficiaryName: formValues.beneficiaryName,
          beneficiaryAddress: "Jodhpur",
          emailId: email,      // Replacing hardcoded email
          mobileNo: phone,     // Replacing hardcoded phone
          messageType: "payment",
        }),
      });

      const result = await response.text();
      console.log("API Response:", result);

      try {
        const jsonData = JSON.parse(result);

        if (
          !response.ok ||
          jsonData.message?.toLowerCase().includes("payment failed") ||
          jsonData.decryptedBankResponse?.initiateAuthGenericFundTransferAPIResp?.metaData?.status === "ERROR"
        ) {
          Alert.alert("Error", jsonData.message || "Payment failed.", [
            { text: "OK", onPress: () => setmpinModal(false) } // Close MPIN modal on failure
          ]);
          return;
        }

        Alert.alert("Success", "Payment successful!", [
          {
            text: "OK",
            onPress: () => {
              setmpinModal(false);  // Close MPIN modal on success
              resetForm();  // Reset form
            },
          },
        ]);

      } catch (jsonError) {
        console.error("JSON Parsing Error:", jsonError);
        Alert.alert("Error", "Unexpected response from server.", [
          { text: "OK", onPress: () => setmpinModal(false) } // Close MPIN modal on error
        ]);
      }
    } catch (error) {
      console.error("API Error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.", [
        { text: "OK", onPress: () => setmpinModal(false) } // Close MPIN modal on error
      ]);
    }


  };

  const handleMpinVerification = async (mpin) => {
    if (!formValues) {
      Alert.alert("Error", "Form values are missing. Please try again.");
      setmpinModal(false); // Close MPIN modal on error
      return;
    }

    if (!token) {
      Alert.alert("Error", "Authentication token is missing. Please login again.");
      setmpinModal(false); // Close MPIN modal on error
      return;
    }

    setLoading(true); // Start loading

    const payload = { mpin: mpin.trim() };

    try {
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("MPIN verification failed. Please try again.")), 2000)
      );

      const mpinResponse = await Promise.race([
        fetch(Api.MPIN_URL, {
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
      console.log(mpinResult, "MPIN Response");

      if (!mpinResponse.ok) {
        Alert.alert("Error", mpinResult.message || "MPIN verification failed.");
        setmpinModal(false); // Close MPIN modal
        return;
      }

      // ✅ Use formReset instead of resetForm
      await handleApiCall(formReset);

    } catch (error) {
      Alert.alert("Error", error.message || "MPIN verification failed. Please try again.");
      setmpinModal(false); // Close MPIN modal on failure
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const Mode = userapi.mode || null;

  let Modeselection = null;

  if (Mode === "NEFT" || Mode === "RTGS" || Mode === "NEFT / RTGS") {
    Modeselection = Mode;
  }

  console.log(Modeselection, "mode")

  console.log(userapi?.status, "aagyere")
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
              style={[styles.verifyButton, loading && { backgroundColor: "gray" }]}
              onPress={() => handleMpinVerification(mpin)} // ✅ Remove resetForm
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={{ color: "#fff" }}>Verify</Text>
              )}
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
              {Modeselection === "NEFT / RTGS" ? (
                <>
                  <Picker.Item label="NEFT" value="NEFT" />
                  <Picker.Item label="RTGS" value="RTGS" />
                </>
              ) : (
                <Picker.Item label={Modeselection} value={Modeselection} />
              )}


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
              remark: ""
            }}
            validationSchema={validationSchema}
            onSubmit={async (values, { resetForm }) => {
 
              try {
                const token = await AsyncStorage.getItem("token");

                const res = await fetch(Api.USER_URL, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                });

                const data = await res.json();

                console.log(data?.status, "kamalbabu")

                if (data?.status === "IN_ACTIVE") {
                  await AsyncStorage.removeItem("token");
                  navigation.reset({
                    index: 0,
                    routes: [{ name: "Login" }],
                  });
                  return;
                }

                openMpinModal(values, resetForm);
              } catch (error) {
                console.error("Error in onSubmit:", error);
              }
            }}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              setFieldValue,
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
                  onChangeText={(text) => {
                    // Remove special characters and convert to uppercase
                    const cleanedText = text.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
                    setFieldValue('ifscCode', cleanedText);
                  }}
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

                <Text style={styles.label}>Remark</Text>
                <TextInput
                  style={styles.textfield}
                  placeholder="Remark"
                  onChangeText={handleChange("remark")}
                  onBlur={handleBlur("remark")}
                  value={values.remark}
                // keyboardType="numeric"
                />
                {touched.remark && errors.remark && (
                  <Text style={styles.errorText}>{errors.remark}</Text>
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

export default Zpayout;

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
    marginTop: 20,
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

















































































































































































































































