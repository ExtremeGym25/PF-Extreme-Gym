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

import { IResponseBack, IUser } from "../tipos";

// Que queremos guardar en el contexto
interface AuthContextType {
  user: IUser | null;
  isAuth: boolean | null;
  token?: string | null;
  // action
  saveUserData: (token: string) => void;
  resetUserData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Un componente que recibe un children, que genera otro componente y retorna nuestro provider con el children de hijo
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthContextType["user"]>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuth, setIsAuth] = useState<AuthContextType["isAuth"]>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const saveUserData = (token: string) => {
    try {
      console.log("Token recibido en saveUserData:", token);
      if (typeof token !== "string" || !token) {
        throw new Error("Token inválido o nulo");
      }

      const decodedToken: any = jwtDecode(token);
      console.log("Token decodificado en saveUserData:", decodedToken);

      const user: IResponseBack = {
        email: decodedToken.email,
      };

      setUser(user);
      setIsAuth(true);
      setToken(token);

      // Guardar en localStorage
      const userData = JSON.stringify({ user, token });
      localStorage.setItem("userData", userData);
      console.log("Datos guardados en el almacenamiento:", userData);
    } catch (error) {
      console.error("Error al decodificar el token en saveUserData:", error);
      setIsAuth(false);
    }
  };

  const resetUserData = () => {
    setUser(null);
    setIsAuth(false);
    setToken(null);
    localStorage.removeItem("userData");
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Asegurar que solo se ejecute en el cliente
      const storageData = localStorage.getItem("userData");

      console.log("Datos en localStorage:", storageData);
      if (!storageData) {
        setIsAuth(false);
        setLoading(false);
        return;
      }

      try {
        const parsedData: { token: string } = JSON.parse(storageData);
        console.log("Datos parseados correctamente:", parsedData);

        const decodedToken: any = jwtDecode(parsedData.token);
        console.log("Token decodificado:", decodedToken);

        if (decodedToken) {
          const user: IUser = {
            email: decodedToken.email,
            name: decodedToken.name,
            address: decodedToken.address,
            phone: decodedToken.phone,
            password: decodedToken.password,
            confirmPassword: decodedToken.confirmPassword,
            country: decodedToken.country,
            city: decodedToken.city,
            profileImage: decodedToken.profileImage,
          };

          setUser(user);
          setToken(parsedData.token);
          setIsAuth(true);
        } else {
          setIsAuth(false);
        }
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
