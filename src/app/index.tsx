import { useRouter } from "expo-router";
import { useEffect } from "react";
import { useAuth } from "./context/AuthContext";

export default function Index() {
  const { authState } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authState?.authenticated !== null) {
      const isProfessor = authState.user?.professor; // Verificar se o usuário é professor pelo campo 'professor'
      if (authState.authenticated) {
        if (authState.user?.professor) {
          router.push('/professor'); // Redireciona para a página do professor
        } else {
          router.push('/aluno'); // Redireciona para a página do aluno
        }
      } else {
        console.log("Indo para o login");
        router.replace("/login"); // Redireciona para a página de login se não autenticado
      }
    }
  }, [authState, router]);

  return null;
}
