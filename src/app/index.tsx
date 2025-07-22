import { useRouter } from "expo-router";
import { useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import { Text, View } from "react-native";

export default function Index() {
  const { authState, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      const isProfessor = authState.user?.professor;
      if (authState.authenticated) {
        router.replace(isProfessor ? "/professor" : "/aluno");
      } else {
        router.replace("/login");
      }
    }
  }, [authState, isLoading, router]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return null;
}
