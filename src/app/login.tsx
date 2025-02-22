import React from "react";
import { View, StyleSheet, Alert, Text, TouchableOpacity, ScrollView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { API_URL, useAuth } from "@/app/context/AuthContext";
import { useRouter } from "expo-router";
import { theme } from "@/theme";
import Botao from "@/components/Botao";
import Input from "@/components/Input";
import { useSegments } from "expo-router";
import DynamicLogo from "@/components/DynamicLogo";

const schema = yup.object({
  email: yup.string().email("Email inválido").required("Informe o email"),
  password: yup
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres")
    .required("Informe a senha"),
});

const Login = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { onLogin, authState } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const currentRoute = segments[0];

  const handleLogin = async (data: { email: string; password: string }) => {
    const result = await onLogin!(data.email, data.password);
    if (result && result.error) {
      if (result.msg.includes("Confirme seu e-mail")) {
        Alert.alert(
          "E-mail não confirmado",
          "Deseja reenviar o código de confirmação?",
          [
            {
              text: "Sim",
              onPress: () => {
                router.push({
                  pathname: "/confirmarCodigo",
                  params: { email: data.email },
                });
              },
            },
            { text: "Não", style: "cancel" },
          ]
        );
      } else {
        Alert.alert(result.msg);
      }
    }
  };

  const handleNavigateToRegister = () => {
    router.push("/registro");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.cabecalho}>
        <DynamicLogo />
      </View>
      <View style={styles.form}>
        <Text style={styles.subtitle}>Acesse sua conta</Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="Email"
              onChangeText={(text) => onChange(text.toLowerCase())}
              keyboardType="email-address"
              autoCapitalize="none"
              onBlur={onBlur}
              value={value}
              errorMessage={errors.email?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="Senha"
              secureTextEntry={true}
              onChangeText={(text) => onChange(text.toLowerCase())}
              onBlur={onBlur}
              value={value}
              errorMessage={errors.password?.message}
            />
          )}
        />

        <Botao title="Login" onPress={handleSubmit(handleLogin)} />

        <TouchableOpacity onPress={handleNavigateToRegister}>
          <Text style={styles.linkText}>Não tem conta? Crie uma aqui</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

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
  linkText: {
    color: "#008739",
    fontSize: 14,
    textDecorationLine: "underline",
    fontFamily: theme.fontFamily.medium,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 8,
    fontFamily: theme.fontFamily.primary,
  },
});

export default Login;
