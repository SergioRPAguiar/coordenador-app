import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Animated } from "react-native";

const scaleValue = new Animated.Value(1);

const handlePressIn = () => {
  Animated.spring(scaleValue, {
    toValue: 0.95,
    useNativeDriver: true,
  }).start();
};

const handlePressOut = () => {
  Animated.spring(scaleValue, {
    toValue: 1,
    useNativeDriver: true,
  }).start();
};

const BackButton = () => {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.back()}
      activeOpacity={0.7}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={{
        position: "absolute",
        top: 10,
        left: 10,
        transform: [{ scale: scaleValue }],
        backgroundColor: "#f8f9fa",
        borderRadius: 20,
        padding: 8,
        elevation: 1,
        zIndex: 4,
      }}
    >
      <MaterialIcons name="arrow-back" size={24} color="#32A041" />
    </TouchableOpacity>
  );
};

export default BackButton;
