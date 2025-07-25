import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter, useLocalSearchParams } from "expo-router";
import { API_URL } from "@/context/AuthContext";
import Input from "@/components/Input";
import axios from "axios";
import DynamicLogo from "@/components/DynamicLogo";
import { theme } from "@/theme";
import BotaoComLoading from "@/components/BotaoComLoading";
import { useFocusEffect } from "@react-navigation/native";

const schema = yup.object({
  code: yup.string().required("Informe o código de confirmação"),
});

export default function ConfirmarCodigo() {
  const [isLoading, setIsLoading] = useState(false);
  const [autoSendError, setAutoSendError] = useState("");
  const [isResending, setIsResending] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setIsLoading(false);
      setIsResending(false);
    }, [])
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;
  const modo = (params.modo as string) || "cadastro";

  const resendCode = async () => {
    try {
      setIsResending(true);
      await axios.post(`${API_URL}/auth/resend-code`, {
        email: email.toLowerCase(),
        mode: modo,
      });
      Alert.alert("Sucesso", "Código reenviado com sucesso!");
    } catch (error) {
      setAutoSendError("Não foi possível reenviar o código.");
    } finally {
      setIsResending(false);
    }
  };

  const handleConfirm = async (data: { code: string }) => {
    try {
      setIsLoading(true);

      if (modo === "cadastro") {
        await axios.post(`${API_URL}/auth/confirm`, {
          email: email.toLowerCase(),
          code: data.code,
        });
        Alert.alert("Sucesso", "Conta confirmada com sucesso.");
        router.replace("/login");
      } else if (modo === "senha") {
        await axios.post(`${API_URL}/auth/confirm-reset`, {
          email: email.toLowerCase(),
          code: data.code,
        });
        router.replace({
          pathname: "/novaSenha",
          params: { email: email.toLowerCase(), code: data.code },
        });
      }
    } catch (error: any) {
      console.error("Erro na confirmação:", error);
      Alert.alert("Erro", "Código inválido ou expirado.");
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
        <Text style={styles.title}>
          {modo === "senha" ? "Recuperar senha" : "Confirme seu e-mail"}
        </Text>
        <Text style={styles.subtitle}>
          {modo === "senha"
            ? `Enviamos um código para redefinir a senha de ${email}`
            : `Enviamos um código de confirmação para ${email}`}
        </Text>

        {autoSendError && <Text style={styles.errorText}>{autoSendError}</Text>}

        <Controller
          control={control}
          name="code"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="Código de confirmação"
              keyboardType="numeric"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              errorMessage={errors.code?.message}
            />
          )}
        />

        <BotaoComLoading
          title={isLoading ? "Verificando..." : "Confirmar Código"}
          onPress={handleSubmit(handleConfirm)}
          loading={isLoading}
        />

        <TouchableOpacity
          onPress={resendCode}
          disabled={isResending || isLoading}
          style={{ opacity: isResending || isLoading ? 0.5 : 1 }}
        >
          <Text style={styles.linkText}>
            {isResending ? "Enviando..." : "Reenviar código"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.back()}
          disabled={isLoading}
          style={{ opacity: isLoading ? 0.5 : 1 }}
        >
          <Text style={styles.linkText}>Voltar</Text>
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
    fontWeight: "bold",
    textAlign: "center",
    color: "#32A041",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#666",
    fontFamily: theme.fontFamily.primary,
  },
  linkText: {
    color: "#32A041",
    fontSize: 14,
    textDecorationLine: "underline",
    fontFamily: theme.fontFamily.medium,
    marginTop: 20,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: theme.fontFamily.primary,
  },
});
