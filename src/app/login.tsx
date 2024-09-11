import React from 'react';
import { View, Image, StyleSheet, Alert, Text } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'expo-router';
import { theme } from '@/theme';
import Botao from '@/components/Botao';
import Input from '@/components/Input';

const schema = yup.object({
  email: yup.string().email("Email inválido").required("Informe o email"),
  password: yup.string().min(6, "A senha deve ter pelo menos 6 caracteres").required("Informe a senha"),
});

const Login = () => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const { onLogin } = useAuth();
  const router = useRouter();

  const handleLogin = async (data: { email: string, password: string }) => {
    const result = await onLogin!(data.email, data.password);
    if (result && result.error) {
      Alert.alert(result.msg);
    } else {
      Alert.alert("Sucesso", "Login bem-sucedido!");
      router.replace('/'); // Substitui a página atual pela página principal, causando um refresh
    }
  };

  const handleNavigateToRegister = () => {
    router.push('/registro');
  };

  return (
    <View style={styles.container}>
      <View style={styles.cabecalho}>
        <Image
          style={styles.image}
          source={require("../../assets/images/logoif.png")}
        />
        <Text style={styles.text}>
          AGENDA{"\n"}COTAD
        </Text>
      </View>
      <View style={styles.form}>
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

        <Botao title="Login" onPress={handleSubmit(handleLogin)} />
        <Botao title="Criar Conta" onPress={handleNavigateToRegister} />
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
});

export default Login;
