
import { Tabs, Stack } from "expo-router";
import React from "react";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function DashboardTabs() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
      }}
    >
      
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "home" : "home-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Login"
        options={{
          title: "Login",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "log-in" : "log-in-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Services"
        options={{
          title: "Services",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "construct" : "construct"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Blog"
        options={{
          title: "Blog",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "document-text" : "document-text"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Contact"
        options={{
          title: "Contact",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? "mail" : "mail"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Aboutus"
        options={{
          title: "Aboutus",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={
                focused ? "information-circle" : "information-circle-outline"
              }
              color={color}
            />
          ),
        }}
      />
    </Tabs>

  );
}
