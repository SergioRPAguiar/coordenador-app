import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Input from "@/components/Input";
import BotaoComLoading from "@/components/BotaoComLoading";
import { API_URL } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import DynamicLogo from "@/components/DynamicLogo";
import { theme } from "@/theme";
import { useFocusEffect } from "@react-navigation/native";

const schema = yup.object({
  email: yup.string().email("Email inválido").required("Informe o email"),
});

export default function EsqueciSenha() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setIsLoading(false);
    }, [])
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async ({ email }: { email: string }) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.toLowerCase() }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push({
          pathname: "/confirmarCodigo",
          params: { email: email.toLowerCase(), modo: "senha" },
        });
      } else {
        Alert.alert("Erro", data?.message || "Erro ao enviar e-mail");
      }
    } catch (e) {
      Alert.alert("Erro", "Falha de conexão com o servidor.");
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
        <Text style={styles.title}>Recuperar senha</Text>

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="Seu e-mail"
              onChangeText={(text) => onChange(text.toLowerCase())}
              keyboardType="email-address"
              autoCapitalize="none"
              onBlur={onBlur}
              value={value}
              errorMessage={errors.email?.message}
            />
          )}
        />

        <BotaoComLoading
          title="Enviar código"
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
        />

        <TouchableOpacity
          onPress={() => router.push("/login")}
          disabled={isLoading}
        >
          <Text style={[styles.linkText, isLoading && { opacity: 0.5 }]}>
            Voltar ao login
          </Text>
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
    fontSize: 22,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
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
