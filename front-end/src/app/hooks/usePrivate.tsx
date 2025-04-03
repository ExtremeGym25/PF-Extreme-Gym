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
      setIsLoading(true);
    } else if (!isAuth) {
      router.push(routes.home);
    } else {
      setIsLoading(false);
    }
  }, [isAuth, router]);

  return isLoading;
};

export default usePrivate;
