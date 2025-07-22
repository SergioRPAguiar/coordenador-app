import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

interface BotaoComLoadingProps {
  title: string;
  onPress: () => Promise<void>;
  loading?: boolean;
  disabled?: boolean;
  style?: object;
  textStyle?: object;
}

const BotaoComLoading: React.FC<BotaoComLoadingProps> = ({
  title,
  onPress,
  loading = false,
  style,
  textStyle,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePress = async () => {
    if (isSubmitting || loading) return;
    setIsSubmitting(true);
    await onPress();
    setIsSubmitting(false);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={isSubmitting || loading}
      style={[
        styles.button,
        style,
        (isSubmitting || loading) && styles.disabledButton,
      ]}
    >
      <Text style={[styles.buttonText, textStyle]}>
        {isSubmitting || loading ? "Carregando..." : title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    width: "100%",
    height: 50,
    borderRadius: 12,
    backgroundColor: "#008739",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: "#ccc",
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default BotaoComLoading;
