import React, { useState } from "react";
import {
  ScrollView,
  View,
  Image,
  StyleSheet,
  Alert,
  Text,
  TouchableOpacity,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { API_URL, useAuth } from "@/app/context/AuthContext";
import { useRouter } from "expo-router";
import { theme } from "@/theme";
import Botao from "@/components/Botao";
import Input from "@/components/Input";
import { useSegments } from "expo-router";
import axios from "axios";
import DynamicLogo from "@/components/DynamicLogo";

const schema = yup.object({
  name: yup.string().required("Informe o nome"),
  email: yup.string().email("Email inválido").required("Informe o email"),
  contato: yup.string().required("Informe o contato"),
  password: yup
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres")
    .required("Informe a senha"),
});

const Register = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { authState } = useAuth();
  const { onRegister } = useAuth();
  const router = useRouter();
  const [emailError, setEmailError] = useState("");

  const handleRegister = async (data: {
    name: string;
    email: string;
    contato: string;
    password: string;
  }) => {
    try {
      setEmailError("");
      const result = await onRegister!(
        data.name,
        data.email,
        data.contato,
        data.password
      );

      if (result && result.error) {
        if (result.msg.includes("já está em uso")) {
          setEmailError(result.msg);
        }
        Alert.alert(result.msg);
      } else {
        Alert.alert(
          "✅ Cadastro realizado!",
          "Verifique seu e-mail para o código de confirmação."
        );
        router.push({
          pathname: "/confirmarCodigo",
          params: { email: data.email },
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        setEmailError(error.response.data.message);
      } else {
        Alert.alert("Erro", "Falha no registro");
      }
    }
  };

  const segments = useSegments();
  const currentRoute = segments[0];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.cabecalho}>
        <DynamicLogo />
      </View>
      <View style={styles.form}>
        <Text style={styles.subtitle}>Acesse sua conta</Text>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="Nome"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              errorMessage={errors.name?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="Email"
              onChangeText={(text) => {
                onChange(text.toLowerCase());
                setEmailError("");
              }}
              onBlur={onBlur}
              value={value}
              errorMessage={errors.email?.message || emailError}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
        />

        <Controller
          control={control}
          name="contato"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="Contato"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              errorMessage={errors.contato?.message}
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
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              errorMessage={errors.password?.message}
            />
          )}
        />

        <Botao title="Registrar" onPress={handleSubmit(handleRegister)} />
      </View>
      <View style={styles.linkContainer}>
        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={styles.linkText}>Já tem conta? Faça login aqui</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 50,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#fff",
  },
  cabecalho: {
    alignItems: "center",
    backgroundColor: "#fff",
    marginTop: -20,
  },
  text: {
    marginTop: 10,
    maxWidth: "80%",
    textAlign: "center",
    fontSize: 50,
    color: "#008739",
    fontFamily: theme.fontFamily.secondary,
    lineHeight: 54,
  },
  form: {
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  linkContainer: {
    marginTop: 5,
    alignItems: "center",
  },
  linkText: {
    color: "#008739",
    fontSize: 14,
    textDecorationLine: "underline",
    fontFamily: theme.fontFamily.medium,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
    fontFamily: theme.fontFamily.primary,
  },
});

export default Register;
