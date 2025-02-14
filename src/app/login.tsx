import React from "react";
import {
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
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "expo-router";
import { theme } from "@/theme";
import Botao from "@/components/Botao";
import Input from "@/components/Input";
import { useSegments } from "expo-router";

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

  const { onLogin } = useAuth();
  const router = useRouter();

  const handleLogin = async (data: { email: string; password: string }) => {
    const result = await onLogin!(data.email, data.password);
    if (result && result.error) {
      Alert.alert(result.msg);
    } else {
      Alert.alert("Sucesso", "Login bem-sucedido!");
      router.replace("/");
    }
  };

  const handleNavigateToRegister = () => {
    router.push("/registro");
  };

  const segments = useSegments();
  const currentRoute = segments[0];

  return (
    <View style={styles.container}>
      <View style={styles.cabecalho}>
        <Image
          style={styles.image}
          source={require("../../assets/images/logoif.png")}
        />
        <Text style={styles.text}>Agenda Cotad</Text>
      </View>
      <View style={styles.form}>
        <Text style={styles.subtitle}>
          {currentRoute === "login" ? "Acesse sua conta" : "Crie sua conta"}
        </Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="Email"
              onChangeText={(text) => onChange(text.toLowerCase())}
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
        <View style={styles.linkContainer}>
          <TouchableOpacity onPress={handleNavigateToRegister}>
            <Text style={styles.linkText}>Não tem conta? Crie uma aqui</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 100,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#fff",
    flex: 1,
  },
  cabecalho: {
    alignItems: "center",
    backgroundColor: "#fff",
    marginBottom: 30,
    marginTop: -30
  },
  text: {
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
  image: {
    maxWidth: 65,
    maxHeight: 65,
    resizeMode: "contain",
    marginBottom: 30,
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
    marginTop: 8,
    fontFamily: theme.fontFamily.primary,
  },
});

export default Login;
