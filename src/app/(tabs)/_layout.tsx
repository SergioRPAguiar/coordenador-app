import { Tabs } from "expo-router";

export default function App() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="painel"
        options={{
          headerTitle: "Painel",
          tabBarLabel: "Painel",
        }}
      />
    </Tabs>
  );
}
