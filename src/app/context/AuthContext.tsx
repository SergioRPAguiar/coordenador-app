import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

interface User {
  _id: string;
  name: string;
  email: string;
  contato: string;
  professor: boolean;
}

interface LogoConfig {
  appName: string;
  logoUrl: string;
}

interface AuthState {
  token: string | null;
  authenticated: boolean | null;
  user: User | null;
  logoConfig: LogoConfig;
}

interface AuthProps {
  authState: AuthState;
  user: User | null;
  isLoading: boolean;
  logoUrl: {
    url: string | null;
    appName: string;
  };
  onRegister: (
    name: string,
    email: string,
    contact: string,
    password: string
  ) => Promise<any>;
  onLogin: (email: string, password: string) => Promise<any>;
  onLogout: () => Promise<any>;
  onConfirm: (email: string, code: string) => Promise<any>;
  refreshLogo: () => Promise<void>;
}

const TOKEN_KEY = "my-jwt";
//export const API_URL = "https://ifms.pro.br:2008";
export const API_URL = "http://192.168.101.21:3000";
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
    authenticated: false,
    user: null,
    logoConfig: {
      appName: "Agenda Cotad",
      logoUrl: "",
    },
  });
  const [isLoading, setIsLoading] = useState(true);

  const refreshLogo = async () => {
    try {
      const response = await axios.get(`${API_URL}/config`);
      setAuthState((prev) => ({
        ...prev,
        logoUrl: {
          url: response.data.logoUrl,
          appName: response.data.appName || "Agenda Cotad",
        },
      }));
    } catch (error) {
      console.error("Erro ao atualizar logo:", error);
    }
  };

  useEffect(() => {
    console.log("Iniciando carga do AuthProvider");
    const loadToken = async () => {
      try {
        setIsLoading(true);
        const token = await SecureStore.getItemAsync(TOKEN_KEY);

        const configResponse = await axios.get(`${API_URL}/config`);
        if (token) {
          const userInfo = await fetchUserInfo(token);
          setAuthState({
            token,
            authenticated: true,
            user: userInfo,
            logoConfig: configResponse.data,
          });
        } else {
          setAuthState((prev) => ({
            ...prev,
            logoConfig: configResponse.data,
          }));
        }
      } catch (error) {
        setAuthState({
          token: null,
          authenticated: false,
          user: null,
          logoConfig: {
            appName: "Agenda Cotad",
            logoUrl: "",
          },
        });
      } finally {
        setIsLoading(false); 
      }
    };

    loadToken();
  }, []);

  const fetchUserInfo = async (token: string): Promise<User | null> => {
    try {
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (e) {
      console.error("Erro ao buscar informações do usuário:", e);
      return null;
    }
  };

  const fetchConfig = async () => {
    try {
      const response = await axios.get(`${API_URL}/config`);
      setAuthState((prev) => ({
        ...prev,
        logoConfig: response.data,
      }));
    } catch (error) {
      console.error("Erro ao buscar configurações:", error);
    }
  };

  const register = async (
    name: string,
    email: string,
    contato: string,
    password: string
  ) => {
    try {
      const result = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        contato,
        password,
      });
      return result;
    } catch (e) {
      const errorMsg =
        (e as any).response?.data?.message || "Erro ao registrar.";
      return { error: true, msg: `Falha no registro: ${errorMsg}` };
    }
  };

  const confirm = async (email: string, code: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/confirm`, {
        email,
        code,
      });
      return response.data;
    } catch (error) {
      return { error: true, msg: "Código inválido ou expirado" };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const result = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      const token = result.data.access_token;

      if (!token) throw new Error("Token JWT não retornado.");

      await SecureStore.setItemAsync(TOKEN_KEY, token);
      const userInfo = await fetchUserInfo(token);

      if (!userInfo) throw new Error("Falha ao obter informações do usuário");

      setAuthState({
        token: token,
        authenticated: true,
        user: null,
        logoConfig: {
          appName: "Agenda Cotad",
          logoUrl: "",
        },
      });
      if (userInfo.professor) {
        router.replace("/professor");
      } else {
        router.replace("/aluno");
      }

      return result;
    } catch (e) {
      const errorMsg =
        (e as any).response?.data?.message || "Erro ao fazer login.";
      return { error: true, msg: `Falha no login: ${errorMsg}` };
    }
  };

  const logout = async () => {
    console.log("Iniciando logout..."); 
    try {
      console.log("Removendo token...");
      await SecureStore.deleteItemAsync(TOKEN_KEY);

      console.log("Limpando headers...");
      delete axios.defaults.headers.common["Authorization"];

      console.log("Atualizando estado...");
      setAuthState({
        token: null,
        authenticated: false,
        user: null,
        logoConfig: {
          appName: "Agenda Cotad",
          logoUrl: "",
        },
      });

      console.log("Navegando para login...");
      router.replace("/login");
    } catch (error) {
      console.error("Erro completo no logout:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        user: authState.user,
        logoUrl: {
          url: authState.logoConfig.logoUrl,
          appName: authState.logoConfig.appName,
        },
        isLoading, 
        refreshLogo,
        onRegister: register,
        onLogin: login,
        onLogout: logout,
        onConfirm: confirm,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
