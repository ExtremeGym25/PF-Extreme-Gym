"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { IUser } from "../tipos";
//Que queremos guardar en el contexto

interface AuthContextType {
  user: IUser | null;
  isAuth: boolean | null;
  token?: string | null; //
  //actions
  saveUserData: (data: { user: IUser; token: string }) => void;
  resetUserData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
// Un componente que recibe un children que genera otro componente y retorna nuestroi provider con el children de hijo
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthContextType["user"]>(null);
  const [token, setToken] = useState<string | null>(null);
  //Estado actual, se puede cambiar el valor actualizar estado =inicializa el estado
  const [isAuth, setIsAuth] = useState<AuthContextType["isAuth"]>(null);

  const saveUserData = (data: { user: IUser; token: string }) => {
    setUser(data.user);
    setIsAuth(true);
    setToken(data.token);
    //persistir datos EL LOCAL STROGA SOLO GUARDA STRINGS PARA PODER GUARDAR EL OBJETO USER SE USA JSON Y STRIGFLY QUE LO CONVIRTE EN UN STRING
    localStorage.setItem("user", JSON.stringify(data));
  };
  const resetUserData = () => {
    setUser(null);
    setIsAuth(false);
    localStorage.removeItem("user");
  };
  useEffect(() => {
    const mockUser = { name: "Carlos García", email: "carlosg@hotmail.com" };
    const mockToken = "fakeToken123";
    localStorage.setItem(
      "user",
      JSON.stringify({ user: mockUser, token: mockToken })
    );

    setUser(mockUser);
    setToken(mockToken);
    setIsAuth(true);

    console.log("Autenticación forzada para pruebas");
    const storage = localStorage.getItem("user");

    if (!storage) {
      setIsAuth(false);
      return;
    }

    try {
      const parsedData: { user: IUser; token: string } = JSON.parse(storage);
      console.log("Datos parseados correctamente:", parsedData);
      setUser(parsedData.user || null); // Evita errores si el user no existe
      setToken(parsedData.token || null);
      setIsAuth(!!parsedData.user); // Solo autentica si hay un usuario válido
    } catch (error) {
      console.error("Error al parsear datos del usuario:", error);
      setIsAuth(false);
    }
  }, []);

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
