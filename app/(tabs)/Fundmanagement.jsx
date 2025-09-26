// import React, { useEffect, useState } from "react";
// import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import Api from "../common/api/apiconfig";
// const Fundmanagement = () => {
//   const [bankdata, setBankdata] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchBankdata = async () => {
//       try {
//         const token = await AsyncStorage.getItem("token"); // Retrieve the stored token
//         if (!token) {
//           Alert.alert("Error", "User not authenticated. Token is missing.");
//           return;
//         };

//         const response = await fetch(Api.USER_URL, {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`, // Pass the token in Authorization header
//           },
//         });

//         const data = await response.json();

//         if (response.ok) {
//           setBankdata(data); // Set the fetched data in state

//         } else {
//           Alert.alert("Error", data.message || "Failed to fetch user Bank detail.");
//         }
//       } catch (error) {
//       } finally {
//         setLoading(false); // Stop loading
//       }
//     };

//     fetchBankdata();
//   }, []);

//   if (loading) {
//     return (
//       <View style={styles.loaderContainer}>
//         <ActivityIndicator size="large" color="blue" />
//       </View>
//     );
//   }

//   if (!bankdata) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.errorText}>Failed to load Bank Details data.</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {/* Full UI when bankName is "IDBI/HDFC" or "HDFC/IDBI" */}
//       {(bankdata?.bankName === "IDBI/HDFC" || bankdata?.bankName === "HDFC/IDBI"  || bankdata?.bankName === null ) && (
//         <>
//           <View style={styles.Childrencontainer}>
//             <Text style={{ color: "black", fontWeight: "bold" }}>Bank Details</Text>
//           </View>

//           <View style={styles.footerfirstcard}>
//             <Text style={{ fontWeight: "400", fontSize: 15 }}>
//               {bankdata?.bankName === "HDFC"
//                 ? `${bankdata?.vpa}`
//                 : `vas.${bankdata?.virtual_account}@idbi`}
//             </Text>
//           </View>

//           {/* 👇 Show Account Details ONLY if bankName is not exactly "HDFC" */}
//           {bankdata?.bankName !== "HDFC" && (
//             <View style={styles.footersecondcard}>
//               <Text style={{ fontWeight: "bold", fontSize: 16, marginTop: 10 }}>
//                 YOUR Account Details
//               </Text>

//               <View style={styles.Commontextcontainer}>
//                 <Text>Bank Name</Text>
//                 <Text>IDBI Bank Ltd.</Text>
//               </View>

//               <View style={styles.Commontextcontainer}>
//                 <Text>Account Name</Text>
//                 <Text>{bankdata?.name}</Text>
//               </View>

//               <View style={styles.Commontextcontainer}>
//                 <Text>ACCOUNT NUMBER</Text>
//                 <Text>{bankdata?.virtual_account}</Text>
//               </View>

//               <View style={styles.Commontextcontainer}>
//                 <Text>IFSC</Text>
//                 <Text>IBKL0002031</Text>
//               </View>

//               <View style={styles.Commontextcontainer}>
//                 <Text>Account Type</Text>
//                 <Text>Current Account</Text>
//               </View>
//             </View>
//           )}
//         </>
//       )}

//       {/* Show VPA block only when:
//       - bankName !== "IDBI"
//       - bankName !== null */}
//       {bankdata?.bankName !== "IDBI" && bankdata?.bankName !== null && (
//         <View style={styles.footerfirstcardhdfc}>
//           <Text style={{ fontWeight: "400", fontSize: 15 }}>
//             {bankdata?.vpa}
//           </Text>
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//   },
//   textstyle:{
//   color: "black",
//   fontWeight: "bold"
//   },
  
//   Childrencontainer: {
//     backgroundColor: "lightgray",
//     width: "100%",
//     height: "8%",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   footerfirstcard: {
//     borderRadius: 3,
//     alignItems: "center",
//     justifyContent: "center",
//     width: "92%",
//     height: "8%",
//     backgroundColor: "#fff",
//     shadowOffset: { width: 0, height: 2 },
//     elevation: 5,
//     shadowOpacity: 0.25,
//   },

//   footerfirstcardhdfc: {
//     borderRadius: 3,
//     alignItems: "center",
//     justifyContent: "center",
//     width: "92%",
//     height: "12%",
//     marginTop: 50,
//     backgroundColor: "#fff",
//     shadowOffset: { width: 0, height: 2 },
//     elevation: 5,
//     shadowOpacity: 0.25,
//   },
//   footersecondcard: {
//     gap: 10,
//     marginTop: 20,
//     paddingLeft: 20,
//     paddingRight: 20,
//     flexDirection: "column",
//     width: "92%",
//     height: "30%",
//     borderRadius: 3,
//     backgroundColor: "#fff",
//     shadowOffset: { width: 0, height: 2 },
//     elevation: 5,
//     shadowOpacity: 0.25,
//   },
//   Commontextcontainer: {
//     justifyContent: "space-between",
//     flexDirection: "row",
//   },
// });

// export default Fundmanagement;




import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Api from "../common/api/apiconfig";
const Fundmanagement = () => {
  const [bankdata, setBankdata] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBankdata = async () => {
      try {
        const token = await AsyncStorage.getItem("token"); // Retrieve the stored token
        if (!token) {
          Alert.alert("Error", "User not authenticated. Token is missing.");
          return;
        };

        const response = await fetch(Api.USER_URL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in Authorization header
          },
        });

        const data = await response.json();

        if (response.ok) {
          setBankdata(data); // Set the fetched data in state

        } else {
          Alert.alert("Error", data.message || "Failed to fetch user Bank detail.");
        }
      } catch (error) {
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchBankdata();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  if (!bankdata) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Failed to load Bank Details data.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Full UI when bankName is "IDBI/HDFC" or "HDFC/IDBI" */}
      {(bankdata?.bankName === "IDBI/HDFC" || bankdata?.bankName === "HDFC/IDBI"  || bankdata?.bankName === null ) && (
        <>
          <View style={styles.Childrencontainer}>
            <Text style={{ color: "black", fontWeight: "bold" }}>Bank Details</Text>
          </View>

          {/* 👇 Show Account Details ONLY if bankName is not exactly "HDFC" */}
  
            <View style={styles.footersecondcard}>
              <Text style={{ fontWeight: "bold", fontSize: 16, marginTop: 10 }}>
                YOUR Account Details
              </Text>

              <View style={styles.Commontextcontainer}>
                <Text>Bank Name</Text>
                <Text>HDFC Bank Ltd.</Text>
              </View>

              <View style={styles.Commontextcontainer}>
                <Text>Account Name</Text>
                <Text>{bankdata?.name || "-"}</Text>
              </View>

              <View style={styles.Commontextcontainer}>
                <Text>ACCOUNT NUMBER</Text>
                <Text>{bankdata?.hdfcva || "-" }</Text>
              </View>

              <View style={styles.Commontextcontainer}>
                <Text>IFSC</Text>
                <Text>HDFC0007961</Text>
              </View>

              <View style={styles.Commontextcontainer}>
                <Text>Account Type</Text>
                <Text>Current Account</Text>
              </View>
            </View>
        </>
      )}

   
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  textstyle:{
  color: "black",
  fontWeight: "bold"
  },
  
  Childrencontainer: {
    backgroundColor: "lightgray",
    width: "100%",
    height: "8%",
    alignItems: "center",
    justifyContent: "center",
  },
  footerfirstcard: {
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
    width: "92%",
    height: "8%",
    backgroundColor: "#fff",
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    shadowOpacity: 0.25,
  },

  footerfirstcardhdfc: {
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
    width: "92%",
    height: "12%",
    marginTop: 50,
    backgroundColor: "#fff",
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    shadowOpacity: 0.25,
  },
  footersecondcard: {
    gap: 10,
    marginTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: "column",
    width: "92%",
    height: "30%",
    borderRadius: 3,
    backgroundColor: "#fff",
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    shadowOpacity: 0.25,
  },
  Commontextcontainer: {
    justifyContent: "space-between",
    flexDirection: "row",
  },
});

export default Fundmanagement;
