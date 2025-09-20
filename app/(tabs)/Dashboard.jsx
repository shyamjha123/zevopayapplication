import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  BackHandler,
  Pressable,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "./Homescreen";
import ProfileScreen from "./ProfileScreen";
import Logo from "./assests/logo.png";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Mainwallet from "./Mainwallet";
import Wallet from "../(tabs)/Wallet";
import Funding from "../(tabs)/Funding";
import Topup from "./Topup";
import Help from "./Help";
import { Link, useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Api from "../common/api/apiconfig";

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const CustomTabBarLabel = ({ label, onPress }) => (
  <Pressable onPress={onPress}>
    <Text style={styles.tabBarLabel}>{label}</Text>
  </Pressable>
);

const TabNavigator = () => {
  const router = useRouter();
  return (

    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "white",
        },
        tabBarIcon: ({ color, focused }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = focused ? "home" : "home";
          } else if (route.name === "Profile") {
            iconName = focused
              ? "person-circle-outline"
              : "person-circle-outline";
          } else if (route.name === "Topup") {
            iconName = focused ? "wallet-outline" : "wallet-outline";
          } else if (route.name === "Help") {
            iconName = focused ? "help-circle-outline" : "help-circle-outline";
          }
          return <Ionicons name={iconName} size={24} color={color} />;
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
        tabBarLabel: ({ focused }) => {
          if (route.name === "Profile") {
            return (
              <CustomTabBarLabel
                label="Profile"
                onPress={() => router.push("/(tabs)/ProfileScreen")}
              />
            );
          }
          if (route.name === "Topup") {
            return (
              <CustomTabBarLabel
                label="Topup"
                onPress={() => router.push("/(tabs)/Topup")}
              />
            );
          }
          if (route.name === "Help") {
            return (
              <CustomTabBarLabel
                label="Help"
                onPress={() => router.push("/(tabs)/Help")}
              />
            );
          }
          return <Text style={styles.tabBarLabel}>{route.name}</Text>;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Topup" component={Topup} />
      <Tab.Screen name="Help" component={Help} />
    </Tab.Navigator>
  );
};

const CustomDrawerContent = (props) => {
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

        const response = await fetch(Api.USER_URL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in Authorization header
          },
        });

        const data = await response.json();

        if (response.ok) {
          setProfileData(data); // Set the fetched data in state
        } else {
          Alert.alert("Error", data.message || "Failed to load profile data.");
        }
      } catch (error) {
        Alert.alert(
          "Error",
          "An error occurred while fetching the user profile."
        );
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchProfileData();
  }, []);

  return (
    <DrawerContentScrollView {...props}>
      {profileData && (
        <View style={styles.customDrawerContainer}>
          <View
            style={styles.customDrawerchildren}
          >
            <Image source={Logo} style={styles.Imagestyle} />
          </View>
          <Text style={{ color: "#87cefa", fontWeight: "bold", marginTop: 20 }}>
            {profileData.name}
          </Text>
          <Text style={styles.userdetailtext}>{profileData.userId}</Text>
          <Text style={styles.colorstyle}>{profileData.phone}</Text>
          <Text style={styles.colorstyle}>{profileData.email}</Text>
          <Text style={styles.colorstyle}>zevopay.com @ 2024</Text>
        </View>
      )}
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

const Dashboard = () => {

  const [utiLabel, setUtiLabel] = useState("UTI Coupan Purchase");
  const router = useRouter();

  useFocusEffect(
    React.useCallback(() => {
      const handleBackPress = async () => {
        const token = await AsyncStorage.getItem("token");

        if (token) {
          Alert.alert(
            "Exit",
            "You cannot go back to login Page without logging out."
          );
          return true; // Back button action is stopped
        } else {
          return false; // Allow default back behavior
        }
      };

      BackHandler.addEventListener("hardwareBackPress", handleBackPress);
      return () => {
        BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
      };
    }, [])
  );

  const Logout = () => {
    AsyncStorage.removeItem("token");
    router.push("/Login");
  };

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ route, navigation }) => ({
        headerStyle: {
          backgroundColor: "#fff",
          elevation: 5,
          shadowOpacity: 0.25,
        },
        drawerStyle: {
          backgroundColor: "white",
        },
        headerLeft: () => (
          <Pressable onPress={() => navigation.toggleDrawer()}>
            <Ionicons
              name="menu"
              size={24}
              color="#4A90E2"
              style={{ marginLeft: 15 }}
            />
          </Pressable>
        ),
        headerTitle: () => (
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerText}>{route.name}</Text>
            <Image source={Logo} style={styles.imagelogo} />
            <MaterialCommunityIcons
              name="qrcode-scan"
              size={30}
              color="black"
              onPress={() => router.push("/(tabs)/Barcodescanner")}
            />
          </View>
        ),
        headerTintColor: "black",
      })}
    >
      <Drawer.Screen
        name="Home"
        component={TabNavigator}
        options={{
          drawerIcon: ({ focused, color, size }) => (
            <Ionicons name={"home"} size={size} color={"black"} />
          ),
          drawerLabel: ({ focused }) => (
            <Text style={{ color: "black" }}>Home</Text>
          ),
        }}
      />

      <Drawer.Screen
        name="Main Wallet"
        component={Mainwallet} // Set to null to use custom component
        options={{
          drawerIcon: ({ focused, color, size }) => (
            <Ionicons name={"wallet"} size={size} color={"gray"} />
          ),
          drawerLabel: () => (
           
              <Text style={styles.drawerLabel}>Main Wallet</Text>
          
          ),
        }}
      />

       <Drawer.Screen
        name="Fund request"
        component={Funding} // Set to null to use custom component
        options={{
          drawerIcon: ({ focused, color, size }) => (
            <Ionicons name={"wallet"} size={size} color={"gray"} />
          ),
          drawerLabel: () => (
            <Pressable onPress={() => router.push("/(tabs)/Funding")}>
              <Text style={styles.drawerLabel}>Fund Request</Text>
            </Pressable>
          ),
        }}
      />

      <Drawer.Screen
        name="BBPS"
        component={Mainwallet} // Set to null to use custom component
        options={{
          drawerIcon: ({ focused, color, size }) => (
            <Ionicons name={"wallet"} size={size} color={"gray"} />
          ),
          drawerLabel: () => (
              <Text style={styles.drawerLabel}>BBPS</Text>
          ),
        }}
      />

      <Drawer.Screen
        name="AEPS Wallet"
        component={Wallet}
        options={{
          drawerIcon: ({ focused, color, size }) => (
            <Ionicons name={"wallet"} size={size} color={"gray"} />
          ),
          drawerLabel: () => (
              <Text style={styles.drawerLabel}>AEPS Wallet</Text>
          ),
        }}
      />

      <Drawer.Screen
        name="AEPS KYC"
        component={TabNavigator}
        options={{
          drawerIcon: ({ focused, color, size }) => (
            <Ionicons
              name={"person-circle-outline"}
              size={size}
              color={"gray"}
            />
          ),

          drawerLabel: ({ focused }) => (
            <Text style={{ color: "black" }}>AEPS KYC</Text>
          ),
        }}
      />
      <Drawer.Screen
        name="Change Mobile"
        component={TabNavigator}
        options={{
          drawerIcon: ({ focused, color, size }) => (
            <Ionicons
              name={"phone-portrait-outline"}
              size={size}
              color={"gray"}
            />
          ),
          drawerLabel: ({ focused }) => (
            <Text style={{ color: "black" }}>Change Mobile</Text>
          ),
        }}
      />
      <Drawer.Screen
        name="Help Report"
        component={TabNavigator}
        options={{
          drawerIcon: ({ focused, color, size }) => (
            <Ionicons name={"help-circle-outline"} size={size} color={"gray"} />
          ),
          drawerLabel: () => (
              <Text style={styles.drawerLabel}>Help Report</Text>
          ),
        }}
      />
      <Drawer.Screen
        name="Reports"
        component={TabNavigator}
        options={{
          drawerIcon: ({ focused, color, size }) => (
            <Ionicons
              name={"document-text-outline"}
              size={size}
              color={"tomato"}
            />
          ),
          drawerLabel: () => (
            <Pressable onPress={() => router.push("/(tabs)/Report")}>
              <Text style={styles.drawerLabel}>Reports</Text>
            </Pressable>
          ),
        }}
      />
      <Drawer.Screen
        name="profile"
        component={TabNavigator}
        options={{
          drawerIcon: ({ focused, color, size }) => (
            <Ionicons
              name={"person-circle-outline"}
              size={size}
              color={"gray"}
            />
          ),

          drawerLabel: () => (
            <Pressable onPress={() => router.push("/(tabs)/ProfileScreen")}>
              <Text style={styles.drawerLabel}>Profile</Text>
            </Pressable>
          ),
        }}
      />

      <Drawer.Screen
        name="Change mPin"
        component={TabNavigator}
        options={{
          drawerIcon: ({ focused, color, size }) => (
            <Ionicons name={"key-outline"} size={size} color={"gray"} />
          ),
          drawerLabel: () => (
            <Pressable onPress={() => router.push("/(tabs)/ChangeMpin")}>
              <Text style={styles.drawerLabel}>Change mPin</Text>
            </Pressable>
          ),
        }}
      />

      <Drawer.Screen
        name="Change Password"
        component={TabNavigator}
        options={{
          drawerIcon: ({ focused, color, size }) => (
            <Ionicons name={"lock-closed-outline"} size={size} color={"gray"} />
          ),
          drawerLabel: () => (
            <Pressable onPress={() => router.push("/(tabs)/ChangePassword")}>
              <Text style={styles.drawerLabel}>Change Password</Text>
            </Pressable>
          ),
        }}
      />

      <Drawer.Screen
        name="Contact Us"
        component={TabNavigator}
        options={{
          drawerIcon: ({ focused, color, size }) => (
            <Ionicons name={"mail-outline"} size={size} color={"red"} />
          ),
          drawerLabel: () => (
            <Pressable onPress={() => router.push("/(tabs)/Contactus")}>
              <Text style={styles.drawerLabel}>Contact Us</Text>
            </Pressable>
          ),
        }}
      />
      <Drawer.Screen
        name="Rate Us"
        component={TabNavigator}
        options={{
          drawerIcon: ({ focused, color, size }) => (
            <Ionicons name={"star-outline"} size={size} color={"gray"} />
          ),
          drawerLabel: ({ focused }) => (
            <Text style={{ color: "black" }}>Rate Us</Text>
          ),
        }}
      />
      <Drawer.Screen
        name="Help"
        component={ProfileScreen}
        options={{
          drawerIcon: ({ focused, color, size }) => (
            <Ionicons name={"help-circle"} size={size} color={"gray"} />
          ),
          drawerLabel: () => (
            <Pressable onPress={() => router.push("/(tabs)/Help")}>
              <Text style={styles.drawerLabel}>Help</Text>
            </Pressable>
          ),
        }}
      />
      <Drawer.Screen
        name="logout"
        component={Logout}
        options={{
          drawerIcon: ({ focused, color, size }) => (
            <Ionicons name={"log-out-outline"} size={size} color={"gray"} />
          ),
          drawerLabel: () => (
            <Pressable onPress={() => Logout()}>
              <Text style={styles.drawerLabel}>logout</Text>
            </Pressable>
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  userdetailtext: {
    color: "#87cefa",
  },
  imagelogo: {
    width: 120,
    height: 40,
    resizeMode: "contain",
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 30,
  },
  headerText: {
    fontSize: 20,
    color: "gray",
    marginLeft: 10,
  },
  customDrawerContainer: {
    backgroundColor: "#4A90E2",
    padding: 20,
  },
  Imagestyle: {
    width: 120,
    height: 40
  },
  customDrawerchildren: {
    width: 110,
    height: 110,
    borderRadius: 70,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  customDrawerText: {
    color: "white",
    fontSize: 18,
  },
  colorstyle: {
    color: "#87cefa"
  },
  profilenametext: {
    color: "#87cefa",
    fontWeight: "bold",
    marginTop: 20
  }
});
