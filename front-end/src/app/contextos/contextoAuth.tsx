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
import { useSession } from "next-auth/react";

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
  const { data: session, status } = useSession();

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

      let parsedUser: IUser;

      if (!storedUser) {
        parsedUser = {
          id: decodedToken.id,
          email: decodedToken.email,
          name: decodedToken.name || "",
          profileImage: decodedToken.profileImage || "",
        };
        localStorage.setItem("user", JSON.stringify(parsedUser));
      } else {
        parsedUser = JSON.parse(storedUser);
      }

      setUser(parsedUser);
      console.log(parsedUser, "EL USER ");
      setToken(storedToken);
      setIsAuth(true);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (status === "authenticated" && session?.accessToken && session?.user) {
      const userData: IUser = {
        id: session.user.id || "",
        email: session.user.email || "",
        name: session.user.name || "",
        profileImage: session.user.profileImage || "",
      };

      saveUserData({ user: userData, token: session.accessToken });
      setLoading(false);
    } else if (status === "unauthenticated") {
      resetUserData();
      setLoading(false);
    }
  }, [session, status]);
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
