import React from "react";
import { Stack } from "expo-router";
import { AuthProvider } from "./context/AuthContext";
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_700Bold } from "@expo-google-fonts/poppins";
import { DateProvider } from "./context/DateContext";

// Componente para o layout raiz
export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <DateProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          {/* Adiciona outras telas conforme necessário */}
        </Stack>
      </DateProvider>
    </AuthProvider>
  );
}
