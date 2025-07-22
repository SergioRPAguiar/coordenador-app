import React from "react";
import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";

export default function RootTabs() {
  const { date } = useLocalSearchParams();

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="manha"
        options={{
          title: "Manhã",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="weather-sunny"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="tarde"
        options={{
          title: "Tarde",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="weather-partly-cloudy"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="noite"
        options={{
          title: "Noite",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="weather-night"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}
