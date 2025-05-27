import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import React from "react";
import { Link, useRouter } from "expo-router";
import Fingerprint from "../(tabs)/assests/fingerprint.png";
import Registration from "../(tabs)/assests/registration.png";
import Payout from "../(tabs)/assests/money.png";
import Cross from "../(tabs)/assests/cross.png";
import Atm from "../(tabs)/assests/atm.png";
import Asp from "../(tabs)/assests/aep.png";
import Crossblue from "../(tabs)/assests/check-box.png";
import Upi from "../(tabs)/assests/debit-card.png";
import Money from "../(tabs)/assests/moneynew.png";
import Cash from "../(tabs)/assests/cash.png";

const windowWidth = Dimensions.get("window").width;

const Homescreencontainer = () => {
  return (
    <View style={styles.footercontainer}>
      <Text
        style={{
          color: "black",
          fontSize: 18,
          paddingLeft: 10,
          marginTop: 10,
        }}
      >
        Banking
      </Text>
      <View>
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
                source={Fingerprint}
                style={{ width: "100%", height: "100%" }}
              />
            </View>
            <Text style={{ color: "black", fontSize: 11 }}>AEPS</Text>
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
                source={Registration}
                style={{ width: "100%", height: "100%" }}
              />
            </View>
            <Text style={{ color: "black", fontSize: 11 }}>UTI Reg</Text>
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
                  source={Payout}
                  style={{ width: "100%", height: "100%" }}
                />
              </View>
              <Text style={{ color: "black", fontSize: 11 }}>Payout</Text>
            </View>

        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginTop: 25,
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
              <Image source={Cross} style={{ width: "100%", height: "100%" }} />
            </View>
            <Text style={{ color: "black", fontSize: 11 }}>Express DMR</Text>
          </View>
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
            }}
          >
            <View style={{ width: 35, height: 35 }}>
              <Image source={Atm} style={{ width: "100%", height: "100%" }} />
            </View>
            <Text style={{ color: "black", fontSize: 11 }}>ICIC mATM</Text>
          </View>
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
            }}
          >
            <View style={{ width: 35, height: 35 }}>
              <Image source={Asp} style={{ width: "100%", height: "100%" }} />
            </View>
            <Text style={{ color: "black", fontSize: 11 }}>New Aeps</Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginTop: 25,
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
                source={Crossblue}
                style={{ width: "100%", height: "100%" }}
              />
            </View>
            <Text style={{ color: "black", fontSize: 11 }}>Express Payout</Text>
          </View>
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
            }}
          >
            <View style={{ width: 35, height: 35 }}>
              <Image source={Upi} style={{ width: "100%", height: "100%" }} />
            </View>
            <Text style={{ color: "black", fontSize: 11 }}>Upi Transfer</Text>
          </View>
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
            }}
          >
            <View style={{ width: 35, height: 35 }}>
              <Image source={Money} style={{ width: "100%", height: "100%" }} />
            </View>
            <Text style={{ color: "black", fontSize: 11 }}>Money Transfer</Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginTop: 25,
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
              <Image source={Cash} style={{ width: "100%", height: "100%" }} />
            </View>
            <Text style={{ color: "black", fontSize: 11 }}>UPI Payout</Text>
          </View>
          <Link href="/Zpayout">

            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
              }}
            >
              <View style={{ width: 35, height: 35 }}>
                <Image
                  source={Payout}
                  style={{ width: "100%", height: "100%" }}
                />
              </View>
              <Text style={{ color: "black", fontSize: 11 }}>Z-Payout</Text>
            </View>

          </Link>
        </View>
        <Text>{"  "}</Text>
        <Text>{"  "}</Text>
      </View>
    </View>
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
    height: "8%",
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
    borderRadius: 5,
    height: 130,
    width: Dimensions.get("window").width - 80,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 5,
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
    // justifyContent:"center"
  },
  footercontainer: {
    backgroundColor: "#fff",
    marginTop: 20,
    // padding:80,
    // gap:20,
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
});

export default Homescreencontainer;
