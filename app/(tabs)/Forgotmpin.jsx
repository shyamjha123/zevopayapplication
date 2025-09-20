import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import Logo from "../(tabs)/assests/logo.png";
import { Formik } from "formik";
import * as Yup from "yup";
import Api from "../common/api/apiconfig";

// Define validation schema with Yup
const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

const Forgotmpin = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleForgotmpin = async (values) => {
    const { email } = values;
    setIsSubmitting(true);

    try {
      // Send POST request to the API
      const response = await fetch(
        `${Api.FORGOTMPIN_URL}?role=user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const dataresponse = await response.json();

      // Handle success or error based on response status
      if (response.ok) {
        Alert.alert("Success", dataresponse.message || "Request successful.");
        // router.push("/Mpin");
      } else {
        throw new Error(dataresponse.message || "Request failed.");
      }
    } catch (error) {
      Alert.alert(
        "Error",
        error.message || "An error occurred. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image source={Logo} style={styles.image} />

      <Formik
        initialValues={{ email: "" }}
        validationSchema={validationSchema}
        onSubmit={handleForgotmpin}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View style={styles.ForgotmpinContainer}>
            <Text style={styles.headerText}>Forgot Mpin</Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="#aaa"
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
              />
              {touched.email && errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
            </View>
            <TouchableOpacity
              style={[
                styles.button,
                isSubmitting && styles.buttonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={styles.buttonText}>
                {isSubmitting ? "Submitting..." : "Forgot Mpin"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  ForgotmpinContainer: {
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
  headerText: {
    fontSize: 24,
    marginBottom: 20,
    color: "green",
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
  },
  button: {
    justifyContent: "center",
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#a5d6a7",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  image: {
    width: 200,
    height: 70,
  },
  errorText: {
    color: "red",
    fontSize: 12,
  },
});

export default Forgotmpin;
