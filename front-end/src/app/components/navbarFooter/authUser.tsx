/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import Link from "next/link";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { routes } from "@/app/routes/routes";
import { useAuth } from "@/app/contextos/contextoAuth";
import { FaRegUserCircle } from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";
import Image from "next/image";

const UserAuth = () => {
  const { isAuth, resetUserData, user } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const authRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (authRef.current && !authRef.current.contains(event.target as Node)) {
        setIsAuthOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  if (isAuth === null) {
    return <div>Cargando...</div>;
  }

  const profileImage = useMemo(
    () => (user?.profileImage?.trim() ? user.profileImage : "/logox.png"),
    [user?.profileImage]
  );

  return (
    <div className="relative z-50 py-4" ref={authRef}>
      {isAuth ? (
        <>
          <button
            className="flex items-center gap-2 transition hover:text-verde"
            onClick={() => setIsAuthOpen(!isAuthOpen)}
          >
            <FaRegUserCircle className="text-xl" />
            {user?.name || "Usuario"}
          </button>

          {isAuthOpen && (
            <div className="fixed z-50 h-screen p-4 mt-2 transition-transform origin-top-right transform rounded-lg shadow-2xl backdrop-blur-md ring-opacity-100 ring-2 ring-gray-300 bg-fondo right-20 top-15 w-80 text-foreground animate-slide-down bg-opacity-90">
              <h3 className="text-xl font-bold">Perfil de Usuario</h3>
              <hr className="my-2 border-verde" />

              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-center gap-4">
                  <p className="text-center">
                    ¡Hola, {user?.name || "Usuario"}! 👋
                  </p>
                  <Image
                    src={profileImage}
                    alt="Foto de perfil"
                    width={112}
                    height={112}
                    className="border-2 rounded-full border-verde"
                  />
                </div>

                <div className="flex flex-col items-center py-4 space-y-2">
                  <hr className="w-full my-2 border-t-1 border-verde" />
                  {[
                    { label: "Mi Perfil", route: routes.miPerfil },
                    { label: "Rutinas", route: routes.miPerfil },
                    { label: "Rutinas Favoritas", route: routes.miPerfil },
                    { label: "Notificaciones", route: routes.miPerfil },
                    { label: "Otra Cosa", route: routes.miPerfil },
                    { label: "Ayuda y Soporte", route: routes.miPerfil },
                  ].map(({ label, route }) => (
                    <Link key={label} href={route} className="hover:text-verde">
                      {label}
                    </Link>
                  ))}
                </div>

                <hr className="my-2 border-verde" />
                <span
                  onClick={resetUserData}
                  className="flex items-center gap-2 transition cursor-pointer hover:text-verde"
                >
                  <IoIosLogOut />
                  Cerrar Sesión
                </span>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center gap-4">
          <Link href={routes.login}>
            <button className="px-6 py-2 transition rounded-md font-poppins hover:bg-verde hover:scale-110 ring-2 ring-gray-300 ring-opacity-100">
              Ingresa
            </button>
          </Link>
          <Link href={routes.registro}>
            <button className="px-6 py-2 transition rounded-md font-poppins hover:bg-verde hover:scale-110 ring-2 ring-gray-300 ring-opacity-100">
              Regístrate
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserAuth;
