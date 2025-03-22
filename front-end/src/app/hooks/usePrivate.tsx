"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../contextos/contextoAuth";
import { useRouter } from "next/navigation";
import { routes } from "../routes/routes";

const usePrivate = (): boolean => {
  const { isAuth } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isAuth === null) {
      setIsLoading(true); // Cargando si el estado aún no está determinado
    } else if (!isAuth) {
      router.push(routes.home);
    } else {
      setIsLoading(false); // Deja de cargar si el usuario está autenticado
    }
  }, [isAuth, router]);

  return isLoading;
};

export default usePrivate;
