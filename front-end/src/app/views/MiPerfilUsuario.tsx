"use client";
import React from "react";
import { useAuth } from "../contextos/contextoAuth";

const MiPerfilUsuario = () => {
  const { user } = useAuth();

  return (
    <div>
      <div className="p-4 mx-auto transition-transform duration-300 rounded-lg shadow-md bg-blackP w-96 hover:scale-110">
        <h3 className="text-xl font-bold text-center capitalize">
          Usuario: {user?.name}
        </h3>
        {user?.profileImage && (
          <div className="flex justify-center my-2">
            <img
              src={user.profileImage}
              alt="Imagen de Perfil"
              className="object-cover w-24 h-24 rounded-full"
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
