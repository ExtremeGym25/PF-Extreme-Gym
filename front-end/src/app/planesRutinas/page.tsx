"use client";
import React from "react";
import { useAuth } from "@/app/contextos/contextoAuth";
import ListaRutinas from "./listaRutinas";
import { useRouter } from "next/navigation";

const PlanesRutinasView = () => {
  const router = useRouter();

  const { user } = useAuth();
  if (!user) {
    return (
      <div className="py-10 text-black bg-fondo font-poppins">
        <p>Cargando información del usuario...</p>
      </div>
    );
  }

  const isFree = user.subscriptionType === "free";
  const isPremium = user.subscriptionType === "premium";

  return (
    <div className="py-10 text-black bg-fondo font-poppins">
      {isFree && (
        <>
          <p className="mb-4 text-lg text-center text-foreground">
            Mira nuestras tarifas para acceder a más contenido
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => router.push("/tarifas")}
              className="px-6 py-2 text-sm transition rounded-md text-foreground font-poppins bg-fondo hover:bg-verde hover:scale-110 ring-2 ring-gray-300 ring-opacity-100"
            >
              Ver Tarifas
            </button>
          </div>
        </>
      )}{" "}
      {isPremium && (
        <div className="py-10 text-black bg-fondo font-poppins">
          <ListaRutinas />
        </div>
      )}
    </div>
  );
};

export default PlanesRutinasView;
