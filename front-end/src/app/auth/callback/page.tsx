import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth0 } from "@auth0/auth0-react";

const AuthCallback = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const router = useRouter();

  useEffect(() => {
    const sendTokenToBackend = async () => {
      if (isAuthenticated) {
        const token = await getAccessTokenSilently();
        console.log("Token de Auth0:", token);

        // Enviar el token al backend
        const response = await fetch(
          "http://localhost:3000/auth/auth0/protected",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Enviar el token en el Header
            },
          }
        );

        if (response.ok) {
          console.log("Autenticación exitosa en el backend");
          router.push("/dashboard"); // Redirigir después de autenticación
        } else {
          console.error("Error en la autenticación del backend");
        }
      }
    };

    sendTokenToBackend();
  }, [isAuthenticated]);

  return <div>Cargando autenticación...</div>;
};

export default AuthCallback;
