import { Tabs, Stack } from "expo-router";
import React from "react";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="Login" />
      <Stack.Screen name="Dashboard" />
      <Stack.Screen name="Homescreen" />
      <Stack.Screen
        name="ProfileScreen"
        options={{
          headerShown: true, // Show header for this screen
          headerStyle: {
            backgroundColor: "black", // Set the background color to blue
          },
          headerTintColor: "#fff", // Optional: Set text color to white for better contrast
        }}
      />
      <Stack.Screen
        name="Topup"
        options={{
          headerShown: true, // Show header for this screen
          headerStyle: {
            backgroundColor: "#4A90E2", // Set the background color to blue
          },
          headerTintColor: "#fff", // Optional: Set text color to white for better contrast
        }}
      />

      <Stack.Screen
        name="Help"
        options={{
          headerShown: true, // Show header for this screen
          headerStyle: {
            backgroundColor: "#4A90E2", // Set the background color to blue
          },
          headerTintColor: "#fff", // Optional: Set text color to white for better contrast
        }}
      />

      <Stack.Screen
        name="Funding"
        options={{
          headerShown: true, // Show header for this screen
          headerStyle: {
            backgroundColor: "#4A90E2", // Set the background color to blue
          },
          headerTintColor: "#fff", // Optional: Set text color to white for better contrast
        }}
      />
      <Stack.Screen
        name="AddFundrequest"
        options={{
          headerShown: true, // Show header for this screen
          headerStyle: {
            backgroundColor: "#4A90E2", // Set the background color to blue
          },
          headerTintColor: "#fff", // Optional: Set text color to white for better contrast
        }}
      />
      <Stack.Screen
        name="ListFundrequest"
        options={{
          headerShown: true, // Show header for this screen
          headerStyle: {
            backgroundColor: "#4A90E2", // Set the background color to blue
          },
          headerTintColor: "#fff", // Optional: Set text color to white for better contrast
        }}
      />
      <Stack.Screen
        name="Fundmanagement"
        options={{
          headerShown: true, // Show header for this screen
          headerStyle: {
            backgroundColor: "#4A90E2", // Set the background color to blue
          },
          headerTintColor: "#fff", // Optional: Set text color to white for better contrast
        }}
      />
      <Stack.Screen
        name="AEPSWallet"
        options={{
          headerShown: true, // Show header for this screen
          headerStyle: {
            backgroundColor: "#4A90E2", // Set the background color to blue
          },
          headerTintColor: "#fff", // Optional: Set text color to white for better contrast
        }}
      />
      <Stack.Screen
        name="Mainwallet"
        options={{
          headerShown: true, // Show header for this screen
          headerStyle: {
            backgroundColor: "#4A90E2", // Set the background color to blue
          },
          headerTintColor: "#fff", // Optional: Set text color to white for better contrast
        }}
      />
      <Stack.Screen
        name="Wallet"
        options={{
          headerShown: true, // Show header for this screen
          headerStyle: {
            backgroundColor: "#4A90E2", // Set the background color to blue
          },
          headerTintColor: "#fff", // Optional: Set text color to white for better contrast
        }}
      />
      <Stack.Screen
        name="HelpReport"
        options={{
          headerShown: true, // Show header for this screen
          headerStyle: {
            backgroundColor: "#4A90E2", // Set the background color to blue
          },
          headerTintColor: "#fff", // Optional: Set text color to white for better contrast
        }}
      />
      <Stack.Screen
        name="Contactus"
        options={{
          headerShown: true, // Show header for this screen
          headerStyle: {
            backgroundColor: "#4A90E2", // Set the background color to blue
          },
          headerTintColor: "#fff", // Optional: Set text color to white for better contrast
        }}
      />

      <Stack.Screen
        name="ChangeMpin"
        options={{
          headerShown: true, // Show header for this screen
          headerStyle: {
            backgroundColor: "#4A90E2", // Set the background color to blue
          },
          headerTintColor: "#fff", // Optional: Set text color to white for better contrast
        }}
      />

      <Stack.Screen
        name="ChangePassword"
        options={{
          headerShown: true, // Show header for this screen
          headerStyle: {
            backgroundColor: "#4A90E2", // Set the background color to blue
          },
          headerTintColor: "#fff", // Optional: Set text color to white for better contrast
        }}
      />

      <Stack.Screen
        name="Report"
        options={{
          headerShown: true, // Show header for this screen
          headerStyle: {
            backgroundColor: "#4A90E2", // Set the background color to blue
          },
          headerTintColor: "#fff", // Optional: Set text color to white for better contrast
        }}
      />

      <Stack.Screen
        name="NewvirtualReport"
        options={{
          headerShown: true, // Show header for this screen
          headerStyle: {
            backgroundColor: "#4A90E2", // Set the background color to blue
          },
          headerTintColor: "#fff", // Optional: Set text color to white for better contrast
        }}
      />

      <Stack.Screen
        name="Dmtreport"
        options={{
          headerShown: true, // Show header for this screen
          headerStyle: {
            backgroundColor: "#4A90E2", // Set the background color to blue
          },
          headerTintColor: "#fff", // Optional: Set text color to white for better contrast
        }}
      />

      <Stack.Screen
        name="Aepsreport"
        options={{
          headerShown: true, // Show header for this screen
          headerStyle: {
            backgroundColor: "#4A90E2", // Set the background color to blue
          },
          headerTintColor: "#fff", // Optional: Set text color to white for better contrast
        }}
      />

      <Stack.Screen
        name="Fundrequest"
        options={{
          headerShown: true, // Show header for this screen
          headerStyle: {
            backgroundColor: "#4A90E2", // Set the background color to blue
          },
          headerTintColor: "#fff", // Optional: Set text color to white for better contrast
        }}
      />

      <Stack.Screen
        name="Zpayout"
        options={{
          headerShown: true, // Show header for this screen
          headerStyle: {
            backgroundColor: "#4A90E2", // Set the background color to blue
          },
          headerTintColor: "#fff", // Optional: Set text color to white for better contrast
        }}
      />


      <Stack.Screen
        name="Upitransactionreport"
        options={{
          headerShown: true, // Show header for this screen
          headerStyle: {
            backgroundColor: "#4A90E2", // Set the background color to blue
          },
          headerTintColor: "#fff", // Optional: Set text color to white for better contrast
        }}
      />

      <Stack.Screen
        name="Upipayment"
        options={{
          headerShown: true, // Show header for this screen
          headerStyle: {
            backgroundColor: "#4A90E2", // Set the background color to blue
          },
          headerTintColor: "#fff", // Optional: Set text color to white for better contrast
        }}
      />

      <Stack.Screen
        name="Payout"
        options={{
          headerShown: true, // Show header for this screen
          headerStyle: {
            backgroundColor: "#4A90E2", // Set the background color to blue
          },
          headerTintColor: "#fff", // Optional: Set text color to white for better contrast
        }}
      />

      <Stack.Screen
        name="Payoutreport"
        options={{
          title: "Payout-Report",
          headerShown: true, // Show header for this screen
          headerStyle: {
            backgroundColor: "#4A90E2", // Set the background color to blue
          },
          headerTintColor: "#fff", // Optional: Set text color to white for better contrast
        }}
      />

      <Stack.Screen
        name="Bbps"
        options={{
          title: "Bbps",
          headerShown: true, // Show header for this screen
          headerStyle: {
            backgroundColor: "#4A90E2", // Set the background color to blue
          },
          headerTintColor: "#fff", // Optional: Set text color to white for better contrast
        }}
      />


      <Stack.Screen name="Signup" />
      <Stack.Screen name="Forgotmpin" />
      <Stack.Screen name="Forgotpassword" />
      <Stack.Screen name="Mpin" />
      <Stack.Screen name="Barcodescanner" />
    </Stack>
  );
}
