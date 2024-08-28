import React from "react";
import { Stack } from "expo-router";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Button } from "react-native";
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_700Bold } from "@expo-google-fonts/poppins";
import { Slot } from "expo-router";

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
      <StackLayout />
      <Slot />
    </AuthProvider>
  );
}

const StackLayout = () => {
  const { authState, onLogout } = useAuth();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {authState?.authenticated ? (
        <>
          <Stack.Screen name="(tabs)" options={{ headerRight: () => <Button onPress={onLogout} title="Sair" /> }} />
          <Stack.Screen name="[date]" />
        </>
      ) : (
        <>
          <Stack.Screen name="login" options={{ headerTitle: "Login" }} />
        </>
      )}
    </Stack>
  );
};


// import { Stack } from "expo-router";
// import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_700Bold } from "@expo-google-fonts/poppins";

// export default function Layout() {
//   console.log("Início do Layout do stack");

//   const [fontsLoaded] = useFonts({
//     Poppins_400Regular,
//     Poppins_500Medium,
//     Poppins_700Bold
//   });

//   console.log("Fonts Loaded:", fontsLoaded);

//   if (!fontsLoaded) {
//     return null;
//   }

//   console.log("Layout do stack carregado");

//   return (
//     <Stack screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="index" />
//       <Stack.Screen name="login" />
//       <Stack.Screen name="registro" />
//     </Stack>
//   );
// }

