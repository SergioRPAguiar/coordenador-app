import { useRouter } from "expo-router";
import { useEffect } from "react";
import { useAuth } from "./context/AuthContext";

export default function Index() {
  const { authState } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authState?.authenticated !== null) {
      const isProfessor = authState.user?.professor;
      if (authState.authenticated) {
        if (authState.user?.professor) {
          router.push('/professor'); 
        } else {
          router.push('/aluno');
        }
      } else {
        console.log("Indo para o login");
        router.replace("/login");
      }
    }
  }, [authState, router]);

  return null;
}
