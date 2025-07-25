import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Input from "@/components/Input";
import { API_URL } from "@/context/AuthContext";
import axios from "axios";
import DynamicLogo from "@/components/DynamicLogo";
import { theme } from "@/theme";
import BotaoComLoading from "@/components/BotaoComLoading";
import { useFocusEffect } from "@react-navigation/native";

const schema = yup.object({
  password: yup
    .string()
    .min(6, "Mínimo 6 caracteres")
    .required("Informe a nova senha"),
});

export default function NovaSenha() {
  const router = useRouter();
  const { email, code } = useLocalSearchParams<{
    email: string;
    code: string;
  }>();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [isLoading, setIsLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setIsLoading(false);
    }, [])
  );

  const onSubmit = async ({ password }: { password: string }) => {
    try {
      setIsLoading(true);
      await axios.post(`${API_URL}/auth/reset-password`, {
        email: email?.toString().toLowerCase(),
        code: code?.toString().trim(),
        newPassword: password,
      });

      Alert.alert("Sucesso", "Senha redefinida com sucesso!");
      router.replace("/login");
    } catch (error: any) {
      console.error("Erro ao redefinir senha:", error?.response || error);
      Alert.alert(
        "Erro",
        error?.response?.data?.message || "Não foi possível redefinir a senha."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.cabecalho}>
        <DynamicLogo />
      </View>
      <View style={styles.form}>
        <Text style={styles.title}>Nova senha</Text>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="Nova senha"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              errorMessage={errors.password?.message}
            />
          )}
        />

        <BotaoComLoading
          title="Redefinir Senha"
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
        />

        <TouchableOpacity
          onPress={() => router.push("/login")}
          disabled={isLoading}
          style={{ opacity: isLoading ? 0.5 : 1 }}
        >
          <Text style={styles.linkText}>Voltar ao login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 100,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#fff",
  },
  cabecalho: {
    alignItems: "center",
    backgroundColor: "#fff",
    marginBottom: 10,
    marginTop: -30,
  },
  form: {
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#32A041",
  },
  linkText: {
    color: "#32A041",
    fontSize: 14,
    textDecorationLine: "underline",
    fontFamily: theme.fontFamily.medium,
    marginTop: 20,
  },
});
