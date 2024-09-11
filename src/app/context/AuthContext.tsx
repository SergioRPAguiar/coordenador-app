import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

interface User {
  _id: string;
  name: string;
  email: string;
  contato: string;  // Adicionado o campo contato
  professor: boolean;
}

interface AuthState {
  token: string | null;
  authenticated: boolean | null;
  user: User | null;
}

interface AuthProps {
  authState: AuthState;
  user: User | null;
  onRegister: (name: string, email: string, contact: string, password: string) => Promise<any>;
  onLogin: (email: string, password: string) => Promise<any>;
  onLogout: () => Promise<any>;
}

const TOKEN_KEY = "my-jwt";
export const API_URL = "http://192.168.101.9:3000";  // URL da API
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
      try {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);  // Carregando o token do SecureStore
        if (token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          const userInfo = await fetchUserInfo(token);  // Buscando informações do usuário
          setAuthState({
            token,
            authenticated: true,
            user: userInfo,
          });
        } else {
          setAuthState({ token: null, authenticated: false, user: null });
        }
      } catch (error) {
        console.error("Erro ao carregar o token:", error);
        setAuthState({ token: null, authenticated: false, user: null });
      }
    };
  
    loadToken();
  }, []);

  const fetchUserInfo = async (token: string): Promise<User | null> => {
    try {
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;  // Retornando os dados do usuário
    } catch (e) {
      console.error("Erro ao buscar informações do usuário:", e);
      return null;
    }
  };

  const register = async (name: string, email: string, contato: string, password: string) => {
    try {
      const result = await axios.post(`${API_URL}/auth/register`, {
        name, email, contato, password
      });
      return result;
    } catch (e) {
      const errorMsg = (e as any).response?.data?.message || "Erro ao registrar.";
      return { error: true, msg: `Falha no registro: ${errorMsg}` };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const result = await axios.post(`${API_URL}/auth/login`, { email, password });
      const token = result.data.access_token;  // Obtendo o token JWT
      if (!token) throw new Error("Token JWT não retornado.");
      await SecureStore.setItemAsync(TOKEN_KEY, token);  // Salvando o token
      const userInfo = await fetchUserInfo(token);
      setAuthState({ token, authenticated: true, user: userInfo });
      return result;
    } catch (e) {
      const errorMsg = (e as any).response?.data?.message || "Erro ao fazer login.";
      return { error: true, msg: `Falha no login: ${errorMsg}` };
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      delete axios.defaults.headers.common["Authorization"];
      setAuthState({ token: null, authenticated: false, user: null });
    } catch (e) {
      console.error("Erro ao sair:", e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        user: authState.user,
        onRegister: register,
        onLogin: login,
        onLogout: logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
