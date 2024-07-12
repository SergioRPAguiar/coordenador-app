import { useEffect, useState } from "react"
import { View, Image, Button, StyleSheet, TextInput, Alert, Text } from "react-native"
import { useAuth } from "./context/AuthContext"
import { theme } from "@/theme"
import Botao from "@/components/Botao"


const login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { onLogin, onRegister } = useAuth()

  const handleLogin = async () => {
    const result = await onLogin!(email, password)
    if (result && result.error) {
      Alert.alert(result.msg)
    } else {
      Alert.alert("Sucesso", "Login bem-sucedido!")
    }
  }

  const handleRegister = async () => {
    const result = await onRegister!(email, password)
    if (result && result.error) {
      Alert.alert(result.Msg)
    }
  }

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
        <Text style={styles.text}>
        </Text>
      </View>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={(text: string) => setEmail(text)}
          value={email}
        />
        <TextInput
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={(text: string) => setPassword(text)}
          value={password}
          style={styles.input}
        />
        <Botao title="Login" onPress={handleLogin} />
        <Botao title="Criar Conta" onPress={handleRegister} />
      </View>
    </View>
  )
}

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
  text:{
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
  input: {
    width: "80%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
  image: {
    maxWidth: 65,
    maxHeight: 65,
    resizeMode: "contain",
    marginBottom: 30,
  },
})

export default login
