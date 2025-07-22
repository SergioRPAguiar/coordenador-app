import React, { useState } from "react";
import { View, StyleSheet, Alert, Text } from "react-native";
import { useAuth } from "@/app/context/AuthContext";
import Input from "@/components/Input";
import BotaoComLoading from "@/components/BotaoComLoading";
import { useRouter } from "expo-router";
import { useFocusEffect } from "expo-router";
import { BackHandler } from "react-native";
import { useCallback } from "react";
import BackButton from "@/components/BackButton";

export default function EditarContato() {
  const { authState, onUpdateContact } = useAuth();
  const [contact, setContact] = useState(
    formatPhone(authState?.user?.contato || "")
  );
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleUpdateContact = async () => {
    const cleaned = contact.replace(/\D/g, "");

    if (!cleaned || cleaned.length !== 11) {
      Alert.alert(
        "Contato inválido",
        "O número deve conter 11 dígitos (DDD + celular)."
      );
      return;
    }

    setIsLoading(true);
    try {
      await onUpdateContact?.(cleaned);
      Alert.alert("Sucesso", "Contato atualizado com sucesso");
      router.back();
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Falha ao atualizar o contato");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMaskedInput = (text: string) => {
    const onlyDigits = text.replace(/\D/g, "");
    setContact(formatPhone(onlyDigits));
  };

  return (
    <View style={styles.container}>
      <BackButton />
      <Text style={styles.title}>Atualizar Contato</Text>
      <Input
        placeholder="(11) 98888-1234"
        value={contact}
        onChangeText={handleMaskedInput}
        keyboardType="phone-pad"
      />
      <BotaoComLoading title="Salvar" onPress={handleUpdateContact} />
    </View>
  );
}

function formatPhone(value: string) {
  const cleaned = value.replace(/\D/g, "").slice(0, 11);

  if (cleaned.length < 3) return cleaned;
  if (cleaned.length < 8) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
  return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#008739",
    marginBottom: 20,
    marginTop: 50,
    fontFamily: "Poppins_600SemiBold",
  },
});
