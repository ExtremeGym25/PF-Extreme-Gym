"use client";
import React from "react";
import usePrivate from "../hooks/usePrivate";
import Acordeon from "../components/viewcomponents/acordeon";
import ButtonPrimary from "../components/buttons/buttonPrimary";
import { routes } from "../routes/routes";
import Link from "next/link";
import MiPerfilUsuario from "../views/MiPerfilUsuario";
import UpdatePerfilUsuario from "../views/UpdateUsuario";
import ImagenPerfil from "../views/ImagenPerfil";
import DeleteUsuario from "../views/DeleteUsuario";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { signOut } from "next-auth/react";

const MiPerfil = () => {
  const loading = usePrivate();
  const searchParams = useSearchParams();
  const success = searchParams.get("success");

  useEffect(() => {
    if (success === "true") {
      toast.success("¡Suscripción exitosa!");

      setTimeout(() => {
        const authMethod = localStorage.getItem("authMethod");

        if (authMethod === "nextauth") {
          // Cierra sesión con NextAuth (Google, etc.)
          signOut({
            callbackUrl: "/auth/login",
          });
        } else {
          // Cierra sesión local (elimina tokens, datos, etc.)
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("authMethod"); // Limpia también esto
          window.location.href = "/auth/login";
        }
      }, 2000);
    }
  }, [success]);
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl font-bold text-foreground">
          <Link href={routes.login}>
            <ButtonPrimary> Ingresa </ButtonPrimary>
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen py-8 bg-background font-poppins">
      <h2 className="pb-4 text-3xl font-bold text-center transition-transform duration-300 text-foreground hover:scale-105">
        Mi Perfil
      </h2>
      <div className="grid w-full max-w-6xl grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col items-center">
          <div className="w-full max-w-xl p-8 space-y-6 shadow-lg bg-fondo rounded-2xl">
            <p className="text-xl font-semibold text-center text-gray-700">
              Información del Usuario
            </p>

            <Acordeon title="Actualizar Informacíon Personal">
              <UpdatePerfilUsuario />
            </Acordeon>

            <Acordeon title="Actualizar Imagen de Perfil ">
              <ImagenPerfil />.
            </Acordeon>

            <Acordeon title="Eliminar Cuenta">
              <DeleteUsuario />
            </Acordeon>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center w-full max-w-xl min-h-screen p-8 space-y-4 shadow-lg bg-fondo rounded-2xl">
          <MiPerfilUsuario />
        </div>
      </div>
    </div>
  );
};

export default MiPerfil;
