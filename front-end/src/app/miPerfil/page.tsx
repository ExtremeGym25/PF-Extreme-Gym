"use client";
import React from "react";
import usePrivate from "../hooks/usePrivate";

const MiPerfil = () => {
  const loading = usePrivate();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl font-bold text-blanco">No tienes acceso...</p>
      </div>
    );
  }

  return (
    <div className="py-4 bg-background font-poppins">
      <div>
        <h2 className="py-2 text-3xl font-bold text-center transition-transform duration-300 hover:scale-110">
          Mi Perfil
        </h2>
      </div>

      <div className="p-4 mx-auto transition-transform duration-300 rounded-lg shadow-md bg-blackP w-96 hover:scale-110">
        <p className="text-center text-l">
          Información del usuario aún no disponible.
        </p>
      </div>
    </div>
  );
};

export default MiPerfil;
