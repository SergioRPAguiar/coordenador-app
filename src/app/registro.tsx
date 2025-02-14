import React from 'react';
import { View, Image, StyleSheet, Alert, Text, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'expo-router';
import { theme } from '@/theme';
import Botao from '@/components/Botao';
import Input from '@/components/Input';
import { useSegments } from "expo-router";

const schema = yup.object({
  name: yup.string().required("Informe o nome"),
  email: yup.string().email("Email inválido").required("Informe o email"),
  contato: yup.string().required("Informe o contato"),
  password: yup.string().min(6, "A senha deve ter pelo menos 6 caracteres").required("Informe a senha"),
});

const Register = () => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const { onRegister } = useAuth();
  const router = useRouter();

  const handleRegister = async (data: { name: string, email: string, contato: string, password: string }) => {
    const result = await onRegister!(data.name, data.email, data.contato, data.password);
    if (result && result.error) {
      Alert.alert(result.msg);
    } else {
      Alert.alert("Sucesso", "Cadastro bem-sucedido!");
      router.push('/login');
    }
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
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              errorMessage={errors.email?.message}
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
        <TouchableOpacity onPress={() => router.push('/login')}>
        <Text style={styles.linkText}>Já tem conta? Faça login aqui</Text>
      </TouchableOpacity>
</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#fff",
    flex: 1,
  },
  cabecalho: {
    alignItems: "center",
    backgroundColor: "#fff",
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
    alignItems: 'center',
  },
  linkText: {
    color: '#008739',
    fontSize: 14,
    textDecorationLine: 'underline',
    fontFamily: theme.fontFamily.medium,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 8,
    fontFamily: theme.fontFamily.primary,
  },
});

export default Register;
