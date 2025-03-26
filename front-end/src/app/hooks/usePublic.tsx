import { useRouter } from "next/navigation";
import { routes } from "../routes/routes";
import { useAuth } from "../contextos/contextoAuth";
import { useEffect, useState } from "react";

const usePublic = () => {
  const { isAuth } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuth) {
      router.push(routes.miPerfil);
    }
    setLoading(false);
  }, [isAuth, router]);

  return loading;
};

export default usePublic;
