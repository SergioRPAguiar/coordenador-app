import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

// Interface para o usuário
interface User {
  id: string;
  name: string;
  email: string;
}

// Interface do estado de autenticação
interface AuthState {
  token: string | null;
  authenticated: boolean | null;
  user: User | null;
}

// Interface das propriedades do AuthContext
interface AuthProps {
  authState: AuthState;
  user: User | null;  // Incluindo user na interface AuthProps
  onRegister: (email: string, password: string) => Promise<any>;
  onLogin: (email: string, password: string) => Promise<any>;
  onLogout: () => Promise<any>;
}

const TOKEN_KEY = "my-jwt";
export const API_URL = "http://localhost:5000";
const AuthContext = createContext<AuthProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<AuthState>({
    token: null,
    authenticated: null,
    user: null,
  });

  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      console.log("stored token", token);

      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const userInfo = await fetchUserInfo(token);
        setAuthState({
          token,
          authenticated: true,
          user: userInfo,
        });
      }
    };
    loadToken();
  }, []);

  const fetchUserInfo = async (token: string): Promise<User | null> => {
    try {
      const response = await axios.get(`${API_URL}/auth/me`);
      return response.data.user;
    } catch (e) {
      console.error("Erro ao buscar informações do usuário:", e);
      return null;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const result = await axios.post(`${API_URL}/users`, { email, password });
      return result;
    } catch (e) {
      const errorMsg = (e as any).response?.data?.message || "Erro ao registrar. Por favor, tente novamente.";
      return { error: true, msg: `Falha no registro: ${errorMsg}` };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const result = await axios.post(`${API_URL}/auth`, { email, password });

      const userInfo = await fetchUserInfo(result.data.token);

      setAuthState({
        token: result.data.token,
        authenticated: true,
        user: userInfo,
      });

      axios.defaults.headers.common["Authorization"] = `Bearer ${result.data.token}`;
      await SecureStore.setItemAsync(TOKEN_KEY, result.data.token);

      return result;
    } catch (e) {
      const errorMsg = (e as any).response?.data?.message || "Erro ao fazer login. Por favor, tente novamente.";
      return { error: true, msg: `Falha no login: ${errorMsg}` };
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      delete axios.defaults.headers.common["Authorization"];
      setAuthState({
        token: null,
        authenticated: false,
        user: null,
      });
    } catch (e) {
      console.log("Erro ao sair:", e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        user: authState.user,  // Aqui está o user sendo passado no contexto
        onRegister: register,
        onLogin: login,
        onLogout: logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
