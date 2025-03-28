/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { jwtDecode } from "jwt-decode";

import { IUser } from "../tipos";

// Que queremos guardar en el contexto
interface AuthContextType {
  user: IUser | null;
  isAuth: boolean | null;
  token?: string | null;
  // actions
  saveUserData: (data: { user: IUser; token: string }) => void;
  resetUserData: () => void;
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>; // <-- Agregado aquí
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
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);
  };

  const resetUserData = () => {
    setUser(null);
    setIsAuth(false);
    setToken(null);
    localStorage.removeItem("user");
    console.log("Se eliminó el token");
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      console.log("Datos en localStorage:", { storedUser, storedToken });

      if (!storedUser || !storedToken) {
        setIsAuth(false);
        setLoading(false);
        return;
      }

      try {
        const parsedUser: IUser = JSON.parse(storedUser);

        if (!storedToken || storedToken.split(".").length !== 3) {
          console.warn("Token inválido o mal formado");
          resetUserData();
          setLoading(false);
          return;
        }

        const decodedToken: any = jwtDecode(storedToken);
        console.log("Token decodificado:", decodedToken);

        const currentTime = Math.floor(Date.now() / 1000);
        if (decodedToken.exp && decodedToken.exp < currentTime) {
          console.warn("El token ha expirado");
          resetUserData();
          setLoading(false);
          return;
        }

        setUser(parsedUser);
        setToken(storedToken);
        setIsAuth(true);
      } catch (error) {
        console.error("Error al parsear los datos del usuario:", error);
        resetUserData();
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
      value={{ user, isAuth, saveUserData, resetUserData, token, setUser }}
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
