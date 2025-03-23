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
        <p className="text-xl font-bold text-blanco">
          <Link href={routes.login}>
            <ButtonPrimary> Ingresa </ButtonPrimary>
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-background font-poppins">
      <h2 className="py-8 text-4xl font-extrabold text-center text-foreground">
        Mi Perfil
      </h2>
      <div className="grid w-full max-w-6xl grid-cols-1 md:grid-cols-2">
        <div className="flex flex-col items-center justify-center ">
          <div className="w-full max-w-xl p-6 space-y-4 shadow-2xl rounded-2xl">
            <p className="text-lg font-semibold text-center text-foreground">
              Información del usuario.
            </p>

            <Acordeon title=" Actualiza Información Personal">
              <UpdatePerfilUsuario />
            </Acordeon>

            <Acordeon title="Compras Realizadas">
              <p>Aquí va la información de compras.</p>
            </Acordeon>

            <Acordeon title="Eventos">
              <p>Aquí va la información de eventos.</p>
            </Acordeon>
          </div>
        </div>

        <div className="flex flex-col items-center w-full max-w-xl p-6 space-y-4 shadow-2xl bg-fondo rounded-2xl">
          <p className="text-lg font-semibold text-foreground">
            Información adicional del usuario.foto
          </p>
          <MiPerfilUsuario />
        </div>
      </div>
    </div>
  );
};

export default MiPerfil;
