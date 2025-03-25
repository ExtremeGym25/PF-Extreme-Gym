"use client";
import React from "react";
import usePrivate from "../hooks/usePrivate";
import Acordeon from "../components/viewcomponents/acordeon";
import ButtonPrimary from "../components/buttons/buttonPrimary";
import { routes } from "../routes/routes";
import Link from "next/link";
import MiPerfilUsuario from "../views/MiPerfilUsuario";
import UpdatePerfilUsuario from "../views/UpdateUsuario";

const MiPerfil = () => {
  const loading = usePrivate();

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
      <h2 className="text-3xl font-bold text-center transition-transform duration-300 text-foreground hover:scale-105">
        Mi Perfil
      </h2>
      <div className="grid w-full max-w-6xl grid-cols-1 gap-8 pt-4 md:grid-cols-2">
        <div className="flex flex-col items-center">
          <div className="w-full max-w-xl p-8 space-y-6 shadow-lg bg-fondo rounded-2xl">
            <p className="text-xl font-semibold text-center text-gray-700">
              Información del Usuario
            </p>

            <Acordeon title="Actualizar Informacíon Personal">
              <UpdatePerfilUsuario />
            </Acordeon>

            <Acordeon title="Actualizar Imagen de Perfil ">
              <p>Actualiza tu Imagen de Perfil.</p>
            </Acordeon>

            <Acordeon title="Eventos">
              <p>Aquí va la información de eventos.</p>
            </Acordeon>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center w-full max-w-xl min-h-screen p-8 space-y-4 shadow-lg bg-fondo rounded-2xl">
          <MiPerfilUsuario />
        </div>
      </div>

      <div className="py-6">
        <h2 className="text-3xl font-bold text-center transition-transform duration-300 text-foreground hover:scale-105">
          Eventos
        </h2>
      </div>
    </div>
  );
};

export default MiPerfil;
