import React from "react";
import { Stack } from "expo-router";
import { AuthProvider } from "./context/AuthContext";
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_700Bold } from "@expo-google-fonts/poppins";
import { DateProvider } from "./context/DateContext";
import { Text, View } from "react-native";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Carregando fontes...</Text>
      </View>
    );
  }

  return (
    <AuthProvider>
      <DateProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="aluno" />
          <Stack.Screen name="professor" />
        </Stack>
      </DateProvider>
    </AuthProvider>
  );
}