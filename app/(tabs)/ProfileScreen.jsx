import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  Pressable,
  Modal,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker"; // Import image picker
import { Ionicons } from "@expo/vector-icons";
import Profile from "./assests/profile.png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Api from "../common/api/apiconfig";

const ProfileScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // calling api of user   
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("token"); // Replace with your actual token
        const response = await fetch(Api.USER_URL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        console.log(data, "dataresponse");
        setUserData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007BB5" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  // Function to open the camera
  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission to access camera is required!");
      return;
    }
    const result = await ImagePicker.launchCameraAsync();
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setModalVisible(false);
    }
  };

  // Function to open the gallery
  const openGallery = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission to access gallery is required!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", gap: 40 }}>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 70,
          }}
        >
          <Image
            // style={styles.imageprofile},
            source={{ uri: userData.imageUrl }}
            // source={selectedImage ? { uri: selectedImage } : Profile}
            style={styles.imagelogo}
          />
        </View>

        <View style={styles.pencilcontainer}>
          <Pressable onPress={() => setModalVisible(true)}>
            <Ionicons name="pencil" size={24} color="black" />
          </Pressable>
        </View>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Pressable onPress={() => setModalVisible(!modalVisible)}>
              <View
                style={{
                  backgroundColor: "#4A90E2",
                  width: 30,
                  height: 30,
                  borderRadius: 30,
                  justifyContent: "center",
                  alignItems: "center",
                  marginLeft: 220,
                  marginBottom: 20,
                }}
              >
                <Ionicons name="close" size={30} color="white" />
              </View>
            </Pressable>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: 15,
              }}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="cloud-upload-outline" size={30} color="white" />
              </View>
              <Text style={{ fontSize: 15, color: "gray", fontWeight: "500" }}>
                Select Image
              </Text>
            </View>
            <View style={{ marginTop: 30 }}>
              <Text style={{ color: "gray" }}>Image From </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 20,
                  marginTop: 20,
                }}
              >
                <Pressable style={styles.buttoncamera} onPress={openCamera}>
                  <Text style={{ color: "black" }}>Camera</Text>
                </Pressable>
                <Pressable style={styles.buttoncamera} onPress={openGallery}>
                  <Text>Gallery</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.Cardcontainer}>
        <View style={{ marginTop: 20 }}>
          <Text style={{ color: "white", fontSize: 18 }}>Name</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
            <Ionicons name="person-circle-outline" size={32} color="#fff" />
            <Text style={{ color: "#fff", fontSize: 18 }}>{userData.name}</Text>
          </View>
        </View>

        <View
          style={{ backgroundColor: "#fff", width: "100%", height: 3 }}
        ></View>

        <View style={{ marginTop: 10 }}>
          <Text style={{ color: "white", fontSize: 18 }}>Email</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
            <Ionicons name="mail-outline" size={32} color="#fff" />
            <Text style={{ color: "#fff", fontSize: 18 }}>
              {userData.email}
            </Text>
          </View>
        </View>
        <View
          style={{ backgroundColor: "#fff", width: "100%", height: 3 }}
        ></View>
        <View style={{ marginTop: 15 }}>
          <Text style={{ color: "white", fontSize: 18 }}>Phone Number</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 15,
              marginTop: 5,
            }}
          >
            <Ionicons name="phone-portrait-outline" size={32} color="#fff" />
            <Text style={{ color: "#fff", fontSize: 18 }}>{userData.phone}</Text>
          </View>
        </View>
      </View>

      <Pressable style={styles.updateButton}>
        <Text style={{ color: "#fff", fontSize: 14, fontWeight: "500" }}>
          UPDATE PROFILE
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
  },
  imagelogo: {
    width: 150,
    height: 150,
    borderRadius: 100,
    overflow: "hidden",
    marginTop: 20,
  },
  Cardcontainer: {
    borderRadius: 5,
    width: "88%",
    height: "35%",
    marginTop: 30,
    paddingLeft: 10,
    flexDirection: "column",
    backgroundColor: "rgba(211, 211, 211, 0.7)", // Light gray with 60% opacity
    shadowOffset: { width: 0, height: 2 },
    // elevation: 5,
    // shadowOpacity: 0.25,
  },
  updateButton: {
    marginTop: 210,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    width: "100%",
    height: 60,
    backgroundColor: "rgba(211, 211, 211, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  pencilcontainer: {
    backgroundColor: "white",
    width: 45,
    height: 45,
    borderRadius: 25,
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: 300,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttoncamera: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: "rgba(211, 211, 211, 0.7)",
  },
  iconContainer: {
    backgroundColor: "#4A90E2", // Dark sky color
    width: 60,
    height: 60,
    borderRadius: 30, // Make it circular
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ProfileScreen;

