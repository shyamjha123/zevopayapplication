// import React from "react";
// import { View, Text, TextInput, Button, StyleSheet } from "react-native";
// import { Formik } from "formik";
// import * as Yup from "yup";
// import Checkbox from "expo-checkbox";

// const validationSchema = Yup.object().shape({
//   bank: Yup.array()
//     .min(1, "At least one bank is required")
//     .required("Bank selection is required"),
//   utr: Yup.string().required("UTR/RRN is required"),
//   amount: Yup.number()
//     .typeError("Amount must be a number")
//     .required("Amount is required"),
//   remark: Yup.string().optional(),
// });

// const Addfundrequest = () => {
//   return (
//     <Formik
//       initialValues={{ bank: [], utr: "", amount: "", remark: "" }}
//       validationSchema={validationSchema}
//       onSubmit={(values) => {
//         console.log("Form Data:", values);
//         alert("Form submitted successfully ✅");
//       }}
//     >
//       {({
//         handleChange,
//         handleBlur,
//         handleSubmit,
//         setFieldValue,
//         values,
//         errors,
//         touched,
//       }) => (
//         <View style={styles.container}>
//           {/* Bank Checkboxes */}
//           <Text style={styles.label}>
//             Select Bank <Text style={styles.star}>*</Text>
//           </Text>

//           <View style={styles.checkboxContainer}>
          
//             <Checkbox
//               value={values.bank.includes("HDFC")}
//               onValueChange={(newValue) => {
//                 if (newValue) {
//                   setFieldValue("bank", [...values.bank, "HDFC"]);
//                 } else {
//                   setFieldValue(
//                     "bank",
//                     values.bank.filter((item) => item !== "HDFC")
//                   );
//                 }
//               }}
//               color={values.bank.includes("HDFC") ? "#007BB5" : undefined}
//             />
//             <Text style={styles.checkboxLabel}>HDFC</Text>
//           </View>

//           <View style={styles.checkboxContainer}>
//             <Checkbox
//               value={values.bank.includes("IDBI")}
//               onValueChange={(newValue) => {
//                 if (newValue) {
//                   setFieldValue("bank", [...values.bank, "IDBI"]);
//                 } else {
//                   setFieldValue(
//                     "bank",
//                     values.bank.filter((item) => item !== "IDBI")
//                   );
//                 }
//               }}
//               color={values.bank.includes("IDBI") ? "#007BB5" : undefined}
//             />
//             <Text style={styles.checkboxLabel}>IDBI</Text>
//           </View>

//           {touched.bank && errors.bank && (
//             <Text style={styles.error}>{errors.bank}</Text>
//           )}

//           {/* UTR/RRN Field */}
//           <Text style={styles.label}>
//             UTR/RRN <Text style={styles.star}>*</Text>
//           </Text>
//           <TextInput
//             style={styles.input}
//             onChangeText={handleChange("utr")}
//             onBlur={handleBlur("utr")}
//             value={values.utr}
//             placeholder="Enter UTR/RRN"
//           />
//           {touched.utr && errors.utr && (
//             <Text style={styles.error}>{errors.utr}</Text>
//           )}

//           {/* Amount Field */}
//           <Text style={styles.label}>
//             Amount <Text style={styles.star}>*</Text>
//           </Text>
//           <TextInput
//             style={styles.input}
//             onChangeText={handleChange("amount")}
//             onBlur={handleBlur("amount")}
//             value={values.amount}
//             placeholder="Enter Amount"
//             keyboardType="numeric"
//           />
//           {touched.amount && errors.amount && (
//             <Text style={styles.error}>{errors.amount}</Text>
//           )}

//           {/* Remark Field */}
//           <Text style={styles.label}>Remark</Text>
//           <TextInput
//             style={styles.input}
//             onChangeText={handleChange("remark")}
//             onBlur={handleBlur("remark")}
//             value={values.remark}
//             placeholder="Enter Remark (Optional)"
//           />

//           {/* Submit Button */}
//           <View style={styles.button}>
//             <Button title="Submit" onPress={handleSubmit} color="#007BB5" />
//           </View>
//         </View>
//       )}
//     </Formik>
//   );
// };

// export default Addfundrequest;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   label: {
//     fontSize: 16,
//     marginBottom: 5,
//     marginTop: 15,
//   },
//   star: {
//     color: "red",
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     padding: 10,
//     borderRadius: 5,
//     marginBottom: 5,
//   },
//   checkboxContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 5,
//   },
//   checkboxLabel: {
//     marginLeft: 8,
//     fontSize: 16,
//   },
//   error: {
//     color: "red",
//     fontSize: 12,
//     marginBottom: 5,
//   },
//   button: {
//     marginTop: 20,
//   },
// });




import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Formik } from "formik";
import * as Yup from "yup";
import Checkbox from "expo-checkbox";

const validationSchema = Yup.object().shape({
  bank: Yup.array()
    .min(1, "At least one bank is required")
    .required("Bank selection is required"),
  utr: Yup.string().required("UTR/RRN is required"),
  amount: Yup.number()
    .typeError("Amount must be a number")
    .required("Amount is required"),
  remark: Yup.string().optional(),
});



const Addfundrequest = () => {
  const [loading, setLoading] = useState(false); // 🔹 loading state

  const handleApiCall = async (values, { resetForm }) => {
    setLoading(true); // disable button
    try {
      const storedToken = await AsyncStorage.getItem("token");
      const Name = await AsyncStorage.getItem("userName");

      const payload = {
        name: Name,
        bankName: values.bank.length > 0 ? values.bank.join("/") : "",
        utrRrn: values.utr,
        amount: Number(values.amount),
        narration: values.remark ? values.remark : "",
      };

      console.log("Payload:", payload);

      const response = await fetch(
        "https://zevopay.online/api/v1/user/addMoney",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      console.log("API Response:", data);

      if (response.ok) {
        Alert.alert("Success", "Request submitted successfully ✅");
        resetForm(); // form reset after success
      } else {
        Alert.alert("Error", data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Failed to submit request");
    } finally {
      setLoading(false); // enable button again
    }
  };

  return (
    <Formik
      initialValues={{ bank: [], utr: "", amount: "", remark: "" }}
      validationSchema={validationSchema}
      onSubmit={handleApiCall}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
        values,
        errors,
        touched,
      }) => (
        <View style={styles.container}>
          {/* Bank Checkboxes */}
          <Text style={styles.label}>
            Select Bank <Text style={styles.star}>*</Text>
          </Text>

          <View style={styles.checkboxContainer}>
            <Checkbox
              value={values.bank.includes("HDFC")}
              onValueChange={(newValue) => {
                if (newValue) {
                  setFieldValue("bank", [...values.bank, "HDFC"]);
                } else {
                  setFieldValue(
                    "bank",
                    values.bank.filter((item) => item !== "HDFC")
                  );
                }
              }}
              color={values.bank.includes("HDFC") ? "#007BB5" : undefined}
            />
            <Text style={styles.checkboxLabel}>HDFC</Text>
          </View>

          <View style={styles.checkboxContainer}>
            <Checkbox
              value={values.bank.includes("IDBI")}
              onValueChange={(newValue) => {
                if (newValue) {
                  setFieldValue("bank", [...values.bank, "IDBI"]);
                } else {
                  setFieldValue(
                    "bank",
                    values.bank.filter((item) => item !== "IDBI")
                  );
                }
              }}
              color={values.bank.includes("IDBI") ? "#007BB5" : undefined}
            />
            <Text style={styles.checkboxLabel}>IDBI</Text>
          </View>

          {touched.bank && errors.bank && (
            <Text style={styles.error}>{errors.bank}</Text>
          )}

          {/* UTR/RRN Field */}
          <Text style={styles.label}>
            UTR/RRN <Text style={styles.star}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            onChangeText={handleChange("utr")}
            onBlur={handleBlur("utr")}
            value={values.utr}
            placeholder="Enter UTR/RRN"
          />
          {touched.utr && errors.utr && (
            <Text style={styles.error}>{errors.utr}</Text>
          )}

          {/* Amount Field */}
          <Text style={styles.label}>
            Amount <Text style={styles.star}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            onChangeText={handleChange("amount")}
            onBlur={handleBlur("amount")}
            value={values.amount}
            placeholder="Enter Amount"
            keyboardType="numeric"
          />
          {touched.amount && errors.amount && (
            <Text style={styles.error}>{errors.amount}</Text>
          )}

          {/* Remark Field */}
          <Text style={styles.label}>Remark</Text>
          <TextInput
            style={styles.input}
            onChangeText={handleChange("remark")}
            onBlur={handleBlur("remark")}
            value={values.remark}
            placeholder="Enter Remark (Optional)"
          />

          {/* Submit Button */}
          <View style={styles.button}>
            <Button
              title={loading ? "Submitting..." : "Submit"}
              onPress={handleSubmit}
              color="#007BB5"
              disabled={loading} // disable button when loading
            />
          </View>
        </View>
      )}
    </Formik>
  );
};

export default Addfundrequest;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    marginTop: 15,
  },
  star: {
    color: "red",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
  },
  error: {
    color: "red",
    fontSize: 12,
    marginBottom: 5,
  },
  button: {
    marginTop: 20,
  },
});
