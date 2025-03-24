/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { jwtDecode } from "jwt-decode"; // Importación corregida

import { IUser } from "../tipos";

// Que queremos guardar en el contexto
interface AuthContextType {
  user: IUser | null;
  isAuth: boolean | null;
  token?: string | null;
  // actions
  saveUserData: (data: { user: IUser; token: string }) => void;
  resetUserData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthContextType["user"]>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuth, setIsAuth] = useState<AuthContextType["isAuth"]>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const saveUserData = (data: { user: IUser; token: string }) => {
    setUser(data.user);
    setIsAuth(true);
    setToken(data.token);
    localStorage.setItem("user", JSON.stringify(data));
  };

  const resetUserData = () => {
    setUser(null);
    setIsAuth(false);
    setToken(null);
    localStorage.removeItem("user");
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storageData = localStorage.getItem("user");

      console.log("Datos en localStorage:", storageData);
      if (!storageData) {
        setIsAuth(false);
        setLoading(false);
        return;
      }

      try {
        const parsedData: { user: IUser; token: string } =
          JSON.parse(storageData);

        // Validación del token
        if (!parsedData.token || parsedData.token.split(".").length !== 3) {
          console.warn("Token inválido o mal formado");
          resetUserData();
          setLoading(false);
          return;
        }

        const decodedToken: any = jwtDecode(parsedData.token);
        console.log("Token decodificado:", decodedToken);

        // Validar la expiración del token
        const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos
        if (decodedToken.exp && decodedToken.exp < currentTime) {
          console.warn("El token ha expirado");
          resetUserData();
          setLoading(false);
          return;
        }

        setUser(parsedData.user);
        setToken(parsedData.token);
        setIsAuth(true);
      } catch (error) {
        console.error("Error al parsear datos del usuario:", error);
        setIsAuth(false);
      }

      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  console.log("Contexto de autenticación:", { user, isAuth, token });

  return (
    <AuthContext.Provider
      value={{ user, isAuth, saveUserData, resetUserData, token }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};
