import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  SafeAreaView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Formik } from "formik";
import { useLocalSearchParams } from "expo-router";  
import * as Yup from "yup";

// Validation schema for the form
const validationSchema = Yup.object().shape({
  accountName: Yup.string()
    .required("Account Name is required")
    .min(2, "Account Name must be at least 2 characters"),
  upiId: Yup.string()
    .required("UPI ID is required")
    .matches(/^[\w.-]+@[\w.-]+$/, "Invalid UPI ID format"),
  amount: Yup.number()
    .required("Amount is required")
    .positive("Amount must be a positive number")
    .min(1, "Amount must be at least 1"),
});

const Upipayment = () => {
  const { upiId, name } = useLocalSearchParams();
  
  console.log(upiId, "upiID")// Get the UPI ID and User Name
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Formik
            initialValues={{
              accountName: name || "",  // Prefill accountName with userName
              upiId: upiId || "",  // Prefill upiId with upiID
              amount: "",
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { resetForm }) => {
              // Handle form submission here
              console.log(values);
              // Reset form after submission
              resetForm();
            }}
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
                <TextInput
                  style={styles.textfield}
                  placeholder="Account Name"
                  onChangeText={handleChange("accountName")}
                  onBlur={handleBlur("accountName")}
                  value={values.accountName}
                />
                {touched.accountName && errors.accountName && (
                  <Text style={styles.errorText}>{errors.accountName}</Text>
                )}

                <TextInput
                  style={styles.textfield}
                  placeholder="UPI ID"
                  onChangeText={handleChange("upiId")}
                  onBlur={handleBlur("upiId")}
                  value={values.upiId}
                />
                {touched.upiId && errors.upiId && (
                  <Text style={styles.errorText}>{errors.upiId}</Text>
                )}

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContainer: {
    flexGrow: 1, // Allows the ScrollView to take up the full space
    justifyContent: "space-between", // Ensures fields and buttons are aligned as needed
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
});

export default Upipayment;
