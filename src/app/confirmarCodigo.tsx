import React, { useEffect } from "react";
import { useState } from "react";
import { View, StyleSheet, Alert, Text, TouchableOpacity } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuth, API_URL } from "@/app/context/AuthContext";
import { useRouter, useLocalSearchParams } from "expo-router";
import Botao from "@/components/Botao";
import Input from "@/components/Input";
import axios from "axios";

const schema = yup.object({
  code: yup.string().required("Informe o código de confirmação"),
});

const ConfirmarCodigo = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [autoSendError, setAutoSendError] = useState("");
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
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const autoResendCode = async () => {
      try {
        setIsLoading(true);
        if (isMounted) {
          await axios.post(`${API_URL}/auth/resend-code`, { email });
          Alert.alert("Sucesso", "Código reenviado para seu e-mail");
        }
      } catch (error) {
        if (isMounted)
          setAutoSendError("Falha ao reenviar código automaticamente");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    if (email) {
      autoResendCode();
    }

    return () => {
      isMounted = false;
    };
  }, [email]);

  const handleConfirm = async (data: { code: string }) => {
    try {
      setIsLoading(true);
      const response = await axios.post(`${API_URL}/auth/confirm`, {
        email,
        code: data.code,
      });
  
      if (response.status === 201) {
      console.log('Confirmação bem-sucedida, redirecionando...');
      
      router.replace('/login');
      
      Alert.alert(
        "✅ Sucesso",
        "Conta confirmada com sucesso!",
        [
          {
            text: "OK",
            onPress: () => {}
          }
        ]
      );
    }
    } catch (error) {
      Alert.alert(
        "❌ Erro",
        axios.isAxiosError(error) 
          ? "Código de confirmação incorreto"
          : "Erro desconhecido"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setIsLoading(true);
      await axios.post(`${API_URL}/auth/resend-code`, { email });
      Alert.alert("Sucesso", "Novo código enviado para seu e-mail");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível reenviar o código");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirme seu e-mail</Text>
      <Text style={styles.subtitle}>
        Enviamos um código de 6 dígitos para {email}
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

      <Botao
        title={isLoading ? "Verificando..." : "Confirmar Código"}
        onPress={handleSubmit(handleConfirm)}
        disabled={isLoading || isConfirmed}
      />

      <TouchableOpacity onPress={handleResendCode} disabled={isLoading}>
        <Text style={styles.linkText}>
          {isLoading ? "Enviando..." : "Reenviar código"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.linkText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#008739",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  linkText: {
    color: "#008739",
    textAlign: "center",
    marginTop: 20,
    textDecorationLine: "underline",
  },
  errorText: {
    // Adicione este estilo
    color: "red",
    textAlign: "center",
    marginBottom: 20,
    fontSize: 14,
  },
});

export default ConfirmarCodigo;
