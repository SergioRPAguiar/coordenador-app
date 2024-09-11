import { Tabs } from "expo-router";
import { useLocalSearchParams } from 'expo-router';

export default function RootTabs() {
  const { date } = useLocalSearchParams();

  return (
    <Tabs>
      <Tabs.Screen name="manha" />
      <Tabs.Screen name="tarde" />
      <Tabs.Screen name="noite" />
    </Tabs>
  );
}
