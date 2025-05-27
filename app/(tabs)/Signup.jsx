import React from "react";
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
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import * as Yup from "yup";
import Logo from "../(tabs)/assests/logo.png";


// Ensure the path to your logo is correct

const Signup = () => {
  const router = useRouter();

  // Validation schema for form fields, including mpin validation
  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    phoneNumber: Yup.string()
      .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
      .required("Phone number is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    mpin: Yup.string()
      .min(4, "MPIN must be at least 4 characters")
      .required("MPIN is required"),
  });

  // Function to handle form submission
  const handleSignup = async (values) => {
    try {
      const response = await fetch(`https://zevopay.online/api/v1/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email.trim(),
          name: values.username.trim(),
          password: values.password.trim(),
          phoneNumber: values.phoneNumber.trim(),
          mpin: values.mpin.trim(), // Include mpin in the payload
        }),
      });

      if (response.ok) {
        const data = await response.json();
        Alert.alert("Signup Successful");
        router.push("/Login");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "An error occurred during signup");
      }
    } catch (error) {
      Alert.alert("Signup Failed", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image source={Logo} style={styles.image} />
      <Formik
        initialValues={{
          username: "",
          email: "",
          phoneNumber: "",
          password: "",
          mpin: "",
          passwordVisible: false,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSignup}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          setFieldValue,
        }) => (
          <View style={styles.formContainer}>
            <Text style={styles.headerText}>Sign Up</Text>

            {/* Username Input */}
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#aaa"
              onChangeText={handleChange("username")}
              onBlur={handleBlur("username")}
              value={values.username}
            />
            {touched.username && errors.username && (
              <Text style={styles.errorText}>{errors.username}</Text>
            )}

            {/* Email Input */}
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#aaa"
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
              keyboardType="email-address"
            />
            {touched.email && errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}

            {/* Phone Number Input */}
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              placeholderTextColor="#aaa"
              onChangeText={handleChange("phoneNumber")}
              onBlur={handleBlur("phoneNumber")}
              value={values.phoneNumber}
              keyboardType="phone-pad"
            />
            {touched.phoneNumber && errors.phoneNumber && (
              <Text style={styles.errorText}>{errors.phoneNumber}</Text>
            )}

            {/* Password Input */}
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Password"
                placeholderTextColor="#aaa"
                secureTextEntry={!values.passwordVisible}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
              />
              <TouchableOpacity
                onPress={() =>
                  setFieldValue("passwordVisible", !values.passwordVisible)
                }
              >
                <Ionicons
                  name={values.passwordVisible ? "eye-off" : "eye"}
                  size={24}
                  color="gray"
                />
              </TouchableOpacity>
            </View>
            {touched.password && errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}

            {/* MPIN Input */}
            <TextInput
              style={styles.input}
              placeholder="MPIN"
              placeholderTextColor="#aaa"
              onChangeText={handleChange("mpin")}
              onBlur={handleBlur("mpin")}
              value={values.mpin}
            />
            {touched.mpin && errors.mpin && (
              <Text style={styles.errorText}>{errors.mpin}</Text>
            )}

            {/* Signup Button */}
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Sign Up</Text>
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
  formContainer: {
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
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 10,
    backgroundColor: "#fff",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
    paddingRight: 10, // Space for the icon
  },
  passwordInput: {
    flex: 1,
    height: 40,
    paddingLeft: 10,
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
  image: {
    width: 200,
    height: 70,
  },
  errorText: {
    fontSize: 12,
    color: "red",
    marginBottom: 10,
  },
});

export default Signup;
