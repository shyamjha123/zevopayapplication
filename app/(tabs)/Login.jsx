// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   SafeAreaView,
//   TextInput,
//   TouchableOpacity,
//   Image,
//   Alert,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import Logo from "../(tabs)/assests/logo.png";
// import { Formik } from "formik";
// import * as Yup from "yup";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// // Define validation schema with Yup
// const validationSchema = Yup.object().shape({
//   email: Yup.string()
//     .email("Invalid email address")
//     .required("Email is required"),
//   password: Yup.string()
//     .min(6, "Password must be at least 6 characters")
//     .required("Password is required"),
// });

// const Login = () => {
//   const router = useRouter();
//   const [passwordVisible, setPasswordVisible] = useState(false);

//   const handleLogin = async (values) => {
//     const { email, password } = values;

//     try {
//       // Send POST request to the API
//       const response = await fetch(`https://zevopay.online/api/v1/auth/login`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       // Check if the response is OK (status code 200-299)
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Invalid email or password.");
//       }

//       // Parse the JSON response
//       const dataresponse = await response.json();

//       console.log(dataresponse, "data");

//       // Handle successful login
//       Alert.alert("Login Successful", "You are now logged in.");

//       const Key = dataresponse.token;
//       console.log(Key, "Keyggh");
//       await AsyncStorage.setItem("token", Key);

//       const storedToken = await AsyncStorage.getItem("token");
//       console.log("Stored Token:", storedToken);
//       router.push("/Mpin");
//     } catch (error) {
//       // Handle errors
//       Alert.alert(
//         "Login Failed",
//         error.message || "An error occurred. Please try again."
//       );
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <Image source={Logo} style={styles.image} />

//       <Formik
//         initialValues={{ email: "", password: "" }}
//         validationSchema={validationSchema}
//         onSubmit={handleLogin}
//       >
//         {({
//           handleChange,
//           handleBlur,
//           handleSubmit,
//           values,
//           errors,
//           touched,
//         }) => (
//           <View style={styles.loginContainer}>
//             <Text style={styles.headerText}>Login</Text>

//             <View style={styles.inputContainer}>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Email Address"
//                 placeholderTextColor="#aaa"
//                 onChangeText={handleChange("email")}
//                 onBlur={handleBlur("email")}
//                 value={values.email}
//               />
//               {touched.email && errors.email && (
//                 <Text style={styles.errorText}>{errors.email}</Text>
//               )}
//             </View>

//             <View style={styles.inputContainer}>

//               <View style={styles.passwordWrapper}>

//                 <TextInput
//                   style={styles.passwordInput}
//                   placeholder="Password"
//                   placeholderTextColor="#aaa"
//                   secureTextEntry={!passwordVisible}
//                   onChangeText={handleChange("password")}
//                   onBlur={handleBlur("password")}
//                   value={values.password}
//                 />

//                 <TouchableOpacity
//                   style={styles.iconButton}
//                   onPress={() => setPasswordVisible(!passwordVisible)}
//                 >
//                   <Ionicons
//                     name={passwordVisible ? "eye-off" : "eye"}
//                     size={24}
//                     color="gray"
//                   />
//                 </TouchableOpacity>
//               </View>

//               {touched.password && errors.password && (
//                 <Text style={styles.errorText}>{errors.password}</Text>
//               )}
//               <Text style={{ color: "#0000FF" }} onPress={() => router.push("/Forgotmpin")}>Forgot Mpin</Text>
//               <Text style={{ color: "#0000FF" }} onPress={() => router.push("/Forgotpassword")}>Forgot Password</Text>
//             </View>

//             <TouchableOpacity style={styles.button} onPress={handleSubmit}>
//               <Text style={styles.buttonText}>Login</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       </Formik>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   loginContainer: {
//     marginTop: 30,
//     width: "80%",
//     backgroundColor: "#fff",
//     padding: 20,
//     borderRadius: 10,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   headerText: {
//     fontSize: 24,
//     marginBottom: 20,
//     color: "green",
//     textAlign: "center",
//   },
//   inputContainer: {
//     marginBottom: 15,
//   },
//   input: {
//     height: 40,
//     borderColor: "#ccc",
//     borderWidth: 1,
//     borderRadius: 5,
//     paddingLeft: 10,
//   },
//   passwordWrapper: {
//     flexDirection: "row",
//     alignItems: "center",
//   },

//   passwordInput: {
//     flex: 1,
//     height: 40,
//     borderColor: "#ccc",
//     borderWidth: 1,
//     borderRadius: 5,
//     paddingLeft: 10,
//   },
//   iconButton: {
//     position: "absolute",
//     right: 10,
//     height: 40,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   button: {
//     justifyContent: "center",
//     backgroundColor: "green",
//     padding: 10,
//     borderRadius: 5,
//     alignItems: "center",
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 18,
//   },
//   containerText: {
//     marginTop: 10,
//   },
//   image: {
//     width: 200,
//     height: 70,
//   },
//   errorText: {
//     color: "red",
//     fontSize: 12,
//   },
// });

// export default Login;



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
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Logo from "../(tabs)/assests/logo.png";
import { Formik } from "formik";
import * as Yup from "yup";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define validation schema with Yup
const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Login = () => {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);

  // const handleLogin = async (values) => {
  //   const { email, password } = values;

  //   try {
  //     // Send POST request to the API
  //     const response = await fetch(`https://zevopay.online/api/v1/auth/login`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ email, password }),
  //     });

  //     // Check if the response is OK (status code 200-299)
  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.message || "Invalid email or password.");
  //     }

  //     // Parse the JSON response
  //     const dataresponse = await response.json();

  //     console.log(dataresponse, "data");

  //     // Handle successful login
  //     Alert.alert("Login Successful", "You are now logged in.");

  //     const Key = dataresponse.token;
  //     console.log(Key, "Keyggh");
  //     await AsyncStorage.setItem("token", Key);

  //     const storedToken = await AsyncStorage.getItem("token");
  //     console.log("Stored Token:", storedToken);
  //     router.push("/Mpin");
  //   } catch (error) {
  //     // Handle errors
  //     Alert.alert(
  //       "Login Failed",
  //       error.message || "An error occurred. Please try again."
  //     );
  //   }
  // };



  const handleLogin = async (values) => {
    const { email, password } = values;
  
    try {
      const fetchLogin = fetch(`https://zevopay.online/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Login Failed.")), 2000)
      );
  
      // Race between API call and timeout
      const response = await Promise.race([fetchLogin, timeout]);
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Invalid email or password.");
      }
  
      const dataresponse = await response.json();
      console.log(dataresponse, "data");
  
      Alert.alert("Login Successful", "You are now logged in.");
  
      const Key = dataresponse.token;
      await AsyncStorage.setItem("token", Key);
  
      const storedToken = await AsyncStorage.getItem("token");
      console.log("Stored Token:", storedToken);
      router.push("/Mpin");
    } catch (error) {
      Alert.alert(
        "Login Failed",
        error.message || "An error occurred. Please try again."
      );
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <Image source={Logo} style={styles.image} />

      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleLogin}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View style={styles.loginContainer}>
            <Text style={styles.headerText}>Login</Text>

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

            <View style={styles.inputContainer}>

              <View style={styles.passwordWrapper}>

                <TextInput
                  style={styles.passwordInput}
                  placeholder="Password"
                  placeholderTextColor="#aaa"
                  secureTextEntry={!passwordVisible}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                />

                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => setPasswordVisible(!passwordVisible)}
                >
                  <Ionicons
                    name={passwordVisible ? "eye-off" : "eye"}
                    size={24}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>

              {touched.password && errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
              <Text style={{ color: "#0000FF" }} onPress={() => router.push("/Forgotmpin")}>Forgot Mpin</Text>
              <Text style={{ color: "#0000FF" }} onPress={() => router.push("/Forgotpassword")}>Forgot Password</Text>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Login</Text>
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
  loginContainer: {
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
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },

  passwordInput: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
  },
  iconButton: {
    position: "absolute",
    right: 10,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
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
  containerText: {
    marginTop: 10,
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

export default Login;
