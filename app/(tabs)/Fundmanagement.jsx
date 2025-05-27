import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
const Fundmanagement = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = await AsyncStorage.getItem("token"); // Retrieve the stored token
        if (!token) {
          Alert.alert("Error", "User not authenticated. Token is missing.");
          return;
        }

        const response = await fetch(`https://zevopay.online/api/v1/user`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in Authorization header
          },
        });

        const data = await response.json();

        console.log(data, "dataresponsedddakkuu");

        if (response.ok) {
          setProfileData(data); // Set the fetched data in state

          console.log(profileData.name, "nameofusersakuu");
        } else {
          Alert.alert("Error", data.message || "Failed to fetch user profile.");
        }
      } catch (error) {
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchProfileData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  if (!profileData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Failed to load profile data.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View
        style={{
          backgroundColor: "lightgray",
          width: "100%",
          height: "8%",
          //   marginTop: 30,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "black", fontWeight: "bold" }}>Bank Details</Text>
      </View>
      <View style={styles.footerfirstcard}>
        <Text style={{ fontWeight: "400", fontSize: 15 }}>
          {`vas.${profileData.virtual_account}@idbi`}
        </Text>
      </View>
      <View style={styles.footersecondcard}>
        <Text style={{ fontWeight: "bold", fontSize: 16, marginTop: 10 }}>
          YOUR Account Details
        </Text>
        <View style={styles.Commontextcontainer}>
          <Text>Bank Name</Text>
          <Text>IDBI Bank Ltd.</Text>
        </View>
        <View style={styles.Commontextcontainer}>
          <Text>Account Name</Text>
          <Text>{profileData.name}</Text>
        </View>
        <View style={styles.Commontextcontainer}>
          <Text>ACCOUNT NUMBER</Text>
          <Text>{profileData.virtual_account}</Text>
        </View>
        <View style={styles.Commontextcontainer}>
          <Text>IFSC</Text>
          <Text>IBKL0002031</Text>
        </View>
        <View style={styles.Commontextcontainer}>
          <Text>Account Type</Text>
          <Text>Current Account</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
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
