// src/app/context/AuthContext.tsx
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
  authenticated: boolean;
  user: User | null;
  logoConfig: {
    url: string;
    appName: string;
  };
}

interface AuthProps {
  authState: AuthState;
  isLoading: boolean;
  onRegister: (
    name: string,
    email: string,
    contact: string,
    password: string
  ) => Promise<any>;
  onLogin: (email: string, password: string) => Promise<any>;
  onLogout: () => Promise<void>;
  onConfirm: (email: string, code: string) => Promise<any>;
  refreshLogo: () => Promise<void>;
}

const TOKEN_KEY = "my-jwt";
export const API_URL = "http://179.191.13.98:2065";
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
      url: `${API_URL}/files/logo.png`, // URL padrão
    },
  });

  const [isLoading, setIsLoading] = useState(true);

  const refreshLogo = async () => {
    try {
      const response = await axios.get(`${API_URL}/config`);
      setAuthState(prev => ({
        ...prev,
        logoConfig: {
          appName: response.data.appName || "Agenda Cotad",
          url: response.data.logoUrl || `${API_URL}/files/logo.png`
        }
      }));
    } catch (error) {
      console.error("Erro ao atualizar logo:", error);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const [token, config] = await Promise.all([
          SecureStore.getItemAsync(TOKEN_KEY),
          axios.get(`${API_URL}/config`)
        ]);

        const newAuthState: AuthState = {
          token,
          authenticated: !!token,
          user: null,
          logoConfig: {
            appName: config.data.appName || "Agenda Cotad",
            url: config.data.logoUrl || `${API_URL}/files/logo.png`
          }
        };

        if (token) {
          try {
            const user = await fetchUserInfo(token);
            newAuthState.user = user;
          } catch (error) {
            console.error("Erro ao validar token:", error);
            await SecureStore.deleteItemAsync(TOKEN_KEY);
            newAuthState.token = null;
            newAuthState.authenticated = false;
          }
        }

        setAuthState(newAuthState);
      } catch (error) {
        console.error("Erro na inicialização:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const fetchUserInfo = async (token: string): Promise<User> => {
    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  };

  const register = async (
    name: string,
    email: string,
    contato: string,
    password: string
  ) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        name,
        email: email.toLowerCase(),
        contato,
        password
      });
      
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        msg: error.response?.data?.message || "Erro no registro"
      };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: email.toLowerCase(),
        password
      });

      const { access_token } = response.data;
      await SecureStore.setItemAsync(TOKEN_KEY, access_token);
      
      const user = await fetchUserInfo(access_token);
      
      setAuthState(prev => ({
        ...prev,
        token: access_token,
        authenticated: true,
        user
      }));

      router.replace(user.professor ? "/professor" : "/aluno");
      return { success: true };
    } catch (error: any) {
      return {
        error: true,
        msg: error.response?.data?.message || "Erro no login"
      };
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    setAuthState({
      token: null,
      authenticated: false,
      user: null,
      logoConfig: {
        appName: "Agenda Cotad",
        url: `${API_URL}/files/logo.png`
      }
    });
    router.replace("/login");
  };

  const confirm = async (email: string, code: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/confirm`, {
        email,
        code
      });
      return response.data;
    } catch (error: any) {
      return {
        error: true,
        msg: error.response?.data?.message || "Erro na confirmação"
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        isLoading,
        refreshLogo,
        onRegister: register,
        onLogin: login,
        onLogout: logout,
        onConfirm: confirm
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};