import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import React from "react";
import CommonCards from "../common/CommonCards"; // Adjust the path as necessary
import { Link, useRouter } from "expo-router";
const Report = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <CommonCards
          onPress={() => router.push("/NewvirtualReport") }
          iconname={"wallet-outline"}
          color={"#007BB5"}
          text={"New Virtual Report"}
          footertext={"Track your virtual report"}
        />

        <CommonCards
          onPress={() => router.push("/Dmtreport")}
        />
        
        <CommonCards
          onPress={() => router.push("/Payoutreport", { customTitle: "My Payout History" })}
          iconname={"wallet-outline"}
          color={"#007BB5"}
          text={"Payout Report"}
          footertext={"Track your Payout report"}
        />

        <CommonCards
          onPress={() => router.push("/Upitransactionreport")}
          iconname={"wallet"}
          color={"goldenrod"}
          text={"UPI Transaction Report"}
          footertext={"Check your UPI transactions here"}
        />
        <CommonCards
          onPress={() => router.push("/Aepsreport")}
          iconname={"finger-print"}
          color={"#FFA500"}
          text={"AEPS Report"}
          footertext={"Review your AEPS report"}
        />
        <CommonCards
          onPress={() => router.push("/Fundrequest")}
          iconname={"cash"}
          text={"Fund Request Report"}
          footertext={"All fund requests are here"}
        />
        <CommonCards
          iconname={"receipt-outline"}
          text={"UPI Payout Report"}
          footertext={"Check your transactions here"}
        />
        <CommonCards
          iconname={"analytics-outline"}
          text={"UPI Z-Payout Report"}
          footertext={"Check your transactions here"}
        />
        <CommonCards
          iconname={"card-outline"}
          color={"green"}
          text={"UTI Coupons Report"}
          footertext={"Check your UTI coupon requests"}
        />
        <CommonCards
          iconname={"card-outline"}
          color={"goldenrod"}
          text={"Credit Card Report"}
          footertext={"Check all your Payment requests"}
        />
        <CommonCards
          text={"New AEPS Report"}
          footertext={"View all your New AEPS transactions"}
        />
        <CommonCards
          iconname={"close"}
          text={"Express Payout Report"}
          footertext={"Show Payout and Express Payout/Express Dmr"}
        />
        <CommonCards
          iconname={"phone-portrait-outline"}
          color={"#87CEFA"}
          text={"Recharge Report"}
          footertext={"Take a look to your recent recharges"}
        />
        <CommonCards
          text={"BBPS Report"}
          footertext={"Check Bills Payment report"}
        />
        <CommonCards
          iconname={"stats-chart-outline"}
          text={"dynamic Upi Report"}
          footertext={"Check dynamic Upi report"}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",

  },
  scrollContainer: {
    paddingVertical: 20, // Optional: add padding to the top and bottom of the scroll content
    gap: 20
  },
});

export default Report;
