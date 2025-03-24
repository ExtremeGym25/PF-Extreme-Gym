"use client";
import React from "react";
import { useAuth } from "../contextos/contextoAuth";

const MiPerfilUsuario = () => {
  const { user } = useAuth();
  console.log("Imagen de perfil:", user?.profileImage);

  return (
    <div>
      <div className="h-auto py-8 mx-auto transition-transform duration-300 rounded-lg shadow-md w-96">
        <h3 className="text-xl font-bold text-center capitalize">
          Usuario: {user?.name}
        </h3>
        {user?.profileImage && (
          <div className="flex justify-center my-2">
            <img
              src={user.profileImage}
              alt="Imagen de Perfil"
              className="object-cover w-40 h-40 m-1 border-2 rounded-full hover:scale-110 border-verde"
            />
          </div>
        )}
        <p className="text-center capitalize text-l">País: {user?.country}</p>
        <p className="text-center capitalize text-l">Ciudad: {user?.city}</p>
        <p className="text-center capitalize text-l">
          Dirección: {user?.address}
        </p>
        <p className="text-center text-l">Teléfono: {user?.phone}</p>
        <p className="text-center text-l">Email: {user?.email}</p>
      </div>
    </div>
  );
};

export default MiPerfilUsuario;
