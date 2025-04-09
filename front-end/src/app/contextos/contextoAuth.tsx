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
import { useSession, signOut } from "next-auth/react";
import type { ExtendedUser } from "@/app/lib/authOptions";
interface AuthContextType {
  user: IUser | null;
  isAuth: boolean;
  token?: string | null;
  saveUserData: (data: { user: IUser; token: string }) => void;
  resetUserData: () => void;
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuth, setIsAuth] = useState<boolean>(false);
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
    localStorage.removeItem("token");

    // Cierra sesión si es NextAuth
    signOut({ redirect: false });
  };

  // Verificar token local
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedToken && storedToken.split(".").length === 3) {
      try {
        const decodedToken: any = jwtDecode(storedToken);
        const currentTime = Math.floor(Date.now() / 1000);

        if (decodedToken.exp && decodedToken.exp > currentTime) {
          const parsedUser: IUser = storedUser
            ? JSON.parse(storedUser)
            : {
                id: decodedToken.id,
                email: decodedToken.email,
                name: decodedToken.name || "",
                profileImage: decodedToken.profileImage || "",
              };

          setUser(parsedUser);
          setToken(storedToken);
          setIsAuth(true);
        } else {
          resetUserData();
        }
      } catch (error) {
        console.warn("Error al decodificar token:", error);
        resetUserData();
      }
    }

    setLoading(false);
  }, []);

  // Si inicia sesión con Google
  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (status === "authenticated" && session?.accessToken && session?.user) {
      // Si ya tenemos token guardado, no lo sobrescribimos
      if (!storedToken || storedToken !== session.accessToken) {
        const extendedUser = session.user as ExtendedUser;

        const userData: IUser = {
          id: session.user.id ?? "",
          email: session.user.email ?? "",
          name: session.user.name ?? "",
          profileImage: session.user.profileImage ?? "",
          role: session.user.role ?? "",
          phone: extendedUser.phone ?? 0,
          country: extendedUser.country ?? "",
          address: extendedUser.address ?? "",
          city: extendedUser.city ?? "",
          subscriptionType: extendedUser.subscriptionType,
          stripeCustomerId: extendedUser.stripeCustomerId ?? "",
          stripeSubscriptionId: extendedUser.stripeSubscriptionId ?? "",
          subscriptionExpirationDate: extendedUser.subscriptionExpirationDate,
          isAdmin: extendedUser.isAdmin ?? false,
          isActive: extendedUser.isActive ?? true,
        };
        console.log(userData, "autenticacioon por terceros");
        console.log(session.accessToken, "autenticacion porterceros");
        saveUserData({ user: userData, token: session.accessToken });
      }
    } else if (status === "unauthenticated") {
      // Solo hacemos reset si no hay token local
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        resetUserData();
      }
    }
  }, [session, status]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuth,
        saveUserData,
        resetUserData,
        token,
        setUser,
      }}
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
