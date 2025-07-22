import React from "react";
import { Stack } from "expo-router";

const AlunoLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="horariosDia"
        options={{ title: "Horarios disponiveis no dia" }}
      />
    </Stack>
  );
};

export default AlunoLayout;
