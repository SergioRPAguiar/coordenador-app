import { Link, Redirect } from "expo-router"
import { StyleSheet, Text, View } from "react-native"

export default function index() {
  return (
    
      <View style={styles.container}>
        <Link href="/painel">Painel </Link>
      </View>
    
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
  },
})
