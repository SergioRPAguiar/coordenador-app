import React, { useState } from "react";
import { View, StyleSheet, Alert, Text } from "react-native";
import { useAuth } from "@/app/context/AuthContext";
import Input from "@/components/Input";
import BotaoComLoading from "@/components/BotaoComLoading";
import { useRouter } from "expo-router";
import BackButton from "@/components/BackButton";
import { useFocusEffect } from "@react-navigation/native";

export default function EditarSenhaProfessor() {
  const { onUpdatePassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const router = useRouter();

  useFocusEffect(
    React.useCallback(() => {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setErrors({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      return () => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setErrors({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      };
    }, [])
  );

  const validateFields = () => {
    const newErrors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    let isValid = true;

    if (!currentPassword) {
      newErrors.currentPassword = "Senha atual é obrigatória";
      isValid = false;
    }

    if (newPassword.length < 6) {
      newErrors.newPassword = "Mínimo 6 caracteres";
      isValid = false;
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleUpdatePassword = async () => {
    if (!validateFields()) return;

    setIsLoading(true);
    try {
      await onUpdatePassword?.(currentPassword, newPassword);
      Alert.alert("Sucesso", "Senha atualizada com sucesso");
      router.back();
    } catch (error: any) {
      if (error.message.includes("incorreta")) {
        setErrors((prev) => ({ ...prev, currentPassword: error.message }));
      } else {
        Alert.alert("Erro", error.message || "Falha ao atualizar a senha");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <BackButton />
      <Text style={styles.title}>Atualizar Senha</Text>

      <Input
        placeholder="Senha Atual"
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        value={currentPassword}
        onChangeText={setCurrentPassword}
        onBlur={() => {}}
        errorMessage={errors.currentPassword}
      />

      <Input
        placeholder="Nova Senha"
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        value={newPassword}
        onChangeText={setNewPassword}
        onBlur={() => {}}
        errorMessage={errors.newPassword}
      />

      <Input
        placeholder="Confirmar Nova Senha"
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        onBlur={() => {}}
        errorMessage={errors.confirmPassword}
      />

      <BotaoComLoading
        title="Salvar"
        onPress={handleUpdatePassword}
        loading={isLoading}
      />
    </View>
  );
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
