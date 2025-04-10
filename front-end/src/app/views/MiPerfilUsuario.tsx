"use client";
import React, { useEffect, useMemo } from "react";
import { useAuth } from "../contextos/contextoAuth";

const MiPerfilUsuario = () => {
  const { user } = useAuth();
  useEffect(() => {
    console.log("Usuario actualizado:", user);
  }, [user]);
  console.log("Imagen de perfil:", user?.profileImage);
  console.log("Estado actual de user:", user);

  const profileImage = useMemo(
    () =>
      user?.profileImage?.trim()
        ? user.profileImage
        : "https://res.cloudinary.com/dixcrmeue/image/upload/v1743014544/xTREME_GYM_1_ivgi8t.png",
    [user?.profileImage]
  );

  return (
    <div className="flex justify-center">
      <div className="h-auto py-8 mx-auto transition-transform duration-300 rounded-lg shadow-md bg-fondo w-96">
        <h3 className="text-xl font-bold text-center capitalize">
          Usuario: {user?.name || "No especificado"}
        </h3>
        <div className="flex justify-center my-2">
          <img
            src={profileImage}
            alt="Imagen de Perfil"
            className="object-cover w-40 h-40 m-1 border-2 rounded-full hover:scale-110 border-verde"
          />
        </div>

        <p className="text-center text-l">
          Tipo de Usuario: {!!user?.isActive ? "Activo" : "Desactivado"}
        </p>

        {user?.subscriptionExpirationDate && (
          <p className="text-center text-l">
            Vence Premiun:
            {new Date(user.subscriptionExpirationDate).toLocaleDateString(
              "es-ES",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            )}
          </p>
        )}
        <p className="text-center capitalize text-l">
          País: {user?.country || "No especificado"}
        </p>
        <p className="text-center capitalize text-l">
          Ciudad: {user?.city || "No especificado"}
        </p>
        <p className="text-center capitalize text-l">
          Dirección: {user?.address || "No especificado"}
        </p>
        <p className="text-center text-l">
          Teléfono: {user?.phone || "No especificado"}
        </p>
        <p className="text-center text-l">
          Email: {user?.email || "No especificado"}
        </p>
      </div>
    </div>
  );
};

export default MiPerfilUsuario;
