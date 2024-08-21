import { Tabs } from "expo-router";
import { Text } from "react-native";
import { View } from "react-native-reanimated/lib/typescript/Animated";

export default function RootTabs(){

    return(
        <Tabs>
            <Tabs.Screen name="manha"></Tabs.Screen>
            <Tabs.Screen name="tarde"></Tabs.Screen>
            <Tabs.Screen name="noite"></Tabs.Screen>
        </Tabs>
    )
}