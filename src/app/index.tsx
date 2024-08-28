import { useRouter } from "expo-router";
import { useEffect } from "react";
import { useAuth } from "./context/AuthContext";

export default function Index() {
  const { authState } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authState?.authenticated !== null) {
      const isProfessor = true; 
      if (authState.authenticated) {
        if (isProfessor) {
          router.push("/professor/index");
        } else {
          router.push("/aluno/index");
        }
      } else {
        router.push("/login");
      }
    }
  }, [authState, router]);

  return null;
}
