import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from "react-native";
import Swiper from "react-native-swiper";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Antenna from "../(tabs)/assests/antenna.png";
import Phone from "../(tabs)/assests/smartphone.png";
import Mobile from "../(tabs)/assests/mobile-phone.png";
import Electricity from "../(tabs)/assests/light-bulb.png";
import Gas from "../(tabs)/assests/gas-cylinder.png";
import Telephone from "../(tabs)/assests/telephone.png";
import Insurance from "../(tabs)/assests/life-insurance.png";
import Water from "../(tabs)/assests/drop.png";
import Parking from "../(tabs)/assests/parking-barrier.png";
import Broadband from "../(tabs)/assests/wifi-signal.png";
import Tv from "../(tabs)/assests/television.png";
import Card from "../(tabs)/assests/credit-card.png";
import Loan from "../(tabs)/assests/loan.png";
import Satellite from "../(tabs)/assests/satellite.png";
import Homescreencontainer from "../common/Homescreencontainer";
import Homescreencards from "../common/Homescreencards";
import Api from "../common/api/apiconfig";

const windowWidth = Dimensions.get("window").width;

const Homescreen = () => {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const images = [
    require("../(tabs)/assests/fast.png"),
    require("../(tabs)/assests/ctc_resized.png"),
    require("../(tabs)/assests/hotel.png"),
    require("../(tabs)/assests/Bus.png"), // Update the path to your images

  ];

  const [walletData, setWalletData] = useState(null);
  const [loading, setLoading] = useState(true);


  const fetchWalletBalance = async () => {
    try {
      const token = await AsyncStorage.getItem("token"); // Retrieve the stored token
      if (!token) {
        Alert.alert("Error", "User not authenticated. Token is missing.");
        return;
      }

      const response = await fetch(
       Api.BALANCE_URL,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in Authorization header
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setWalletData(data); // Set the fetched wallet data in state
      } else {
        Alert.alert("Error", data.message || "Failed to fetch wallet balance.");
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "An error occurred while fetching the wallet balance."
      );
      console.error(error);
    } finally {
      setLoading(false); // Stop loading
      setRefreshing(false); // Stop the refresh indicator
    }
  };

  useEffect(() => {
    fetchWalletBalance();
  }, []);

  const onRefresh = () => {
    setRefreshing(true); // Show the refresh indicator
    fetchWalletBalance(); // Fetch the latest data
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  if (!walletData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Failed to load wallet balance.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.scrollViewContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.container}>
        <View style={styles.headercontainer}>
          <Link href="/Fundmanagement">
            <View style={styles.Mainwallet}>
              <Ionicons name="wallet" size={30} color="blue" />
              <View style={{ flexDirection: "column" }}>
                <Text style={{ color: "blue" }}>Main Wallet</Text>
                <Text style={{ color: "black" }}>₹ {Number(walletData.balance).toFixed(2)}</Text>
              </View>
            </View>
          </Link>
          <View style={{ backgroundColor: "lightgray", width: 3 }}></View>
          <Link href="/AEPSWallet">
            <View style={styles.Aepswallet}>
              <Ionicons name="wallet" size={30} color="yellow" />
              <View style={{ flexDirection: "column" }}>
                <Text style={{ color: "blue" }}>AEPS Wallet</Text>
                <Text style={{ color: "black" }}>₹ 0.00</Text>
              </View>
            </View>
          </Link>
        </View>

        <Swiper
          style={styles.swiper}
          autoplay
          loop
          showsPagination={false}
          activeDotColor="blue"
          dotColor="lightgray"
        >
          {images.map((image, index) => (
            <View key={index} style={styles.card}>
              <Image source={image} style={styles.image} resizeMode="contain" />
            </View>
          ))}
        </Swiper>

        <View style={{ flex: 1, flexDirection: "column", marginTop: 20 }}>
          <Text style={{ color: "black", fontSize: 18 }}>Recharge</Text>
          <View style={styles.Itemcontainer}>
            <View style={styles.logocontainer}>
              <View style={{ width: 35, height: 35 }}>
                <Image
                  source={Phone}
                  style={{ width: "100%", height: "100%" }}
                />
              </View>
              <Text>Mobile</Text>
            </View>
            <View style={styles.logocontainer}>
              <View style={{ width: 35, height: 35 }}>
                <Image
                  source={Antenna}
                  style={{ width: "100%", height: "100%" }}
                />
              </View>
              <Text>DTH</Text>
            </View>
          </View>
        </View>
        <View style={{ alignItems: "center" }}>
          <Homescreencontainer />
        </View>
        <View style={{ alignItems: "center" }}>
          <Homescreencards />
        </View>
        <View style={{ alignItems: "center" }}>
          <View style={styles.Footeraftercontainer}>
            <Text style={{ fontSize: 15, fontWeight: "400" }}>Utility</Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                marginTop: 20,
              }}
            >
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <View style={{ width: 35, height: 35 }}>
                  <Image
                    source={Mobile}
                    style={{ width: "100%", height: "100%" }}
                  />
                </View>
                <Text style={{ color: "black", fontSize: 11 }}>Postpaid</Text>
              </View>
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <View style={{ width: 35, height: 35 }}>
                  <Image
                    source={Electricity}
                    style={{ width: "100%", height: "100%" }}
                  />
                </View>
                <Text style={{ color: "black", fontSize: 11 }}>
                  Electricity
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <View style={{ width: 35, height: 35 }}>
                  <Image
                    source={Gas}
                    style={{ width: "100%", height: "100%" }}
                  />
                </View>
                <Text style={{ color: "black", fontSize: 11 }}>GAS</Text>
              </View>
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <View style={{ width: 35, height: 35 }}>
                  <Image
                    source={Satellite}
                    style={{ width: "100%", height: "100%" }}
                  />
                </View>
                <Text style={{ color: "black", fontSize: 11 }}>DTH</Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                marginTop: 20,
              }}
            >
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <View style={{ width: 35, height: 35 }}>
                  <Image
                    source={Parking}
                    style={{ width: "100%", height: "100%" }}
                  />
                </View>
                <Text style={{ color: "black", fontSize: 11 }}>FasTag</Text>
              </View>
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <View style={{ width: 35, height: 35 }}>
                  <Image
                    source={Telephone}
                    style={{ width: "100%", height: "100%" }}
                  />
                </View>
                <Text style={{ color: "black", fontSize: 11 }}>Landline</Text>
              </View>
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <View style={{ width: 35, height: 35 }}>
                  <Image
                    source={Insurance}
                    style={{ width: "100%", height: "100%" }}
                  />
                </View>
                <Text style={{ color: "black", fontSize: 11 }}>Insurance</Text>
              </View>
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <View style={{ width: 35, height: 35 }}>
                  <Image
                    source={Water}
                    style={{ width: "100%", height: "100%" }}
                  />
                </View>
                <Text style={{ color: "black", fontSize: 11 }}>Water</Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                marginTop: 20,
              }}
            >
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <View style={{ width: 35, height: 35 }}>
                  <Image
                    source={Broadband}
                    style={{ width: "100%", height: "100%" }}
                  />
                </View>
                <Text style={{ color: "black", fontSize: 11 }}>Broadband</Text>
              </View>
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <View style={{ width: 35, height: 35 }}>
                  <Image
                    source={Tv}
                    style={{ width: "100%", height: "100%" }}
                  />
                </View>
                <Text style={{ color: "black", fontSize: 11 }}>Cable</Text>
              </View>
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <View style={{ width: 35, height: 35 }}>
                  <Image
                    source={Card}
                    style={{ width: "100%", height: "100%" }}
                  />
                </View>
                <Text style={{ color: "black", fontSize: 11 }}>Card</Text>
              </View>
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <View style={{ width: 35, height: 35 }}>
                  <Image
                    source={Loan}
                    style={{ width: "100%", height: "100%" }}
                  />
                </View>
                <Text style={{ color: "black", fontSize: 11 }}>Loan</Text>
              </View>
            </View>
            <Text>{"    "}</Text>
            <Text>{"    "}</Text>
            <Text>{"    "}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingLeft: 40,
    paddingRight: 40,
    justifyContent: "center",
  },
  headercontainer: {
    height: "5.4%",
    borderRadius: 10,
    marginTop: 30,
    justifyContent: "space-between",
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    shadowOpacity: 0.25,
    paddingLeft: 30,
    paddingRight: 30,
    flexDirection: "row",
    backgroundColor: "white",
  },
  Mainwallet: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  Aepswallet: {
    gap: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    shadowOpacity: 0.25,
    borderRadius: 10,
    width: Dimensions.get("window").width - 80,
    height: 133,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  Itemcontainer: {
    justifyContent: "space-between",
    marginTop: 20,
    paddingLeft: 40,
    paddingRight: 40,
    flexDirection: "row",
  },
  logocontainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  footercontainer: {
    backgroundColor: "#fff",
    marginTop: 20,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    shadowOpacity: 0.25,
    borderRadius: 10,
    flexDirection: "column",
    width: Dimensions.get("window").width - 50,
  },
  squareBox: {
    width: windowWidth * 0.3, // 50% of the screen's width
    height: windowWidth * 0.3, // Ensure the height is the same as width to make it a square
    backgroundColor: "#3A4E7A", // Matte blue background
    justifyContent: "center",
    flexDirection: "column",
    borderRadius: 7,
    gap: 10,
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 16,
  },
  swiper: {
    marginTop: 20,
    borderRadius: 10,
    height: 133
  },
  Footeraftercontainer: {
    backgroundColor: "#fff",
    marginTop: 20,
    flexDirection: "column",
    width: Dimensions.get("window").width - 30,
  },
});

export default Homescreen;



