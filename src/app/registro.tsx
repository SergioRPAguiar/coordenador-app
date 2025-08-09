import React, { useState, useCallback } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Alert,
  Text,
  TouchableOpacity,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { API_URL, useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { theme } from "@/theme";
import Input from "@/components/Input";
import axios from "axios";
import DynamicLogo from "@/components/DynamicLogo";
import BotaoComLoading from "@/components/BotaoComLoading";
import { useFocusEffect } from "@react-navigation/native";

const schema = yup.object({
  name: yup.string().required("Informe o nome"),
  email: yup.string().email("Email inválido").required("Informe o email"),
  contato: yup
    .string()
    .required("Informe o contato")
    .matches(/^\d{11}$/, "Contato deve ter 11 dígitos numéricos"),
  password: yup
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres")
    .required("Informe a senha"),
});

const formatPhone = (value: string) => {
  const cleaned = value.replace(/\D/g, "").slice(0, 11);

  if (cleaned.length < 3) return cleaned;
  if (cleaned.length < 8) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
  return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
};

const Register = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { onRegister } = useAuth();
  const router = useRouter();
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setIsLoading(false);
    }, [])
  );

  const handleRegister = async (data: {
    name: string;
    email: string;
    contato: string;
    password: string;
  }) => {
    try {
      setEmailError("");
      setIsLoading(true);
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
        <Text style={styles.subtitle}>Crie sua conta</Text>
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
          render={({ field: { onChange, onBlur, value } }) => {
            const cleaned = (value || "").replace(/\D/g, "").slice(0, 11);
            return (
              <Input
                placeholder="Contato"
                keyboardType="phone-pad"
                value={formatPhone(cleaned)}
                onChangeText={(text) => {
                  const onlyDigits = text.replace(/\D/g, "").slice(0, 11);
                  onChange(onlyDigits);
                }}
                onBlur={onBlur}
                errorMessage={errors.contato?.message}
              />
            );
          }}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="Senha"
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
          title="Registrar"
          onPress={handleSubmit(handleRegister)}
          loading={isLoading}
        />
      </View>
      <View style={styles.linkContainer}>
        <TouchableOpacity
          onPress={() => router.push("/login")}
          disabled={isLoading}
          style={{ opacity: isLoading ? 0.5 : 1 }}
        >
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
    color: "#32A041",
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
