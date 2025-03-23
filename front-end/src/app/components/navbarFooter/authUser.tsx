"use client";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { routes } from "@/app/routes/routes";
import { useAuth } from "@/app/contextos/contextoAuth";
import { FaRegUserCircle } from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";

const UserAuth = () => {
  const { isAuth, resetUserData, user } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const authRef = useRef<HTMLDivElement>(null);

  // Cerrar el dropdown si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (authRef.current && !authRef.current.contains(event.target as Node)) {
        setIsAuthOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (isAuth === null) {
    return <div>loading...</div>;
  }

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
            <div className="absolute right-0 z-50 p-4 mt-2 transition-transform origin-top-right transform rounded-lg shadow-lg w-80 bg-azul text-blanco animate-slide-down">
              <h3 className="text-xl font-bold">Perfil de Usuario</h3>
              <hr className="my-2 border-verde" />
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-center gap-4">
                  <p className="text-center">
                    {" "}
                    ¡Hola, {user?.name || "Usuario"}! 👋{" "}
                  </p>
                  {user?.profileImage && (
                    <img
                      src={user.profileImage}
                      alt="Foto de perfil"
                      className="border-2 rounded w-28 h-28 border-verde"
                    />
                  )}
                </div>
                <Link href={routes.miPerfil} className="hover:text-verde">
                  Mi Perfil
                </Link>
                <Link href={routes.miPerfil} className="hover:text-verde">
                  Rutinas
                </Link>
                <Link href={routes.miPerfil} className="hover:text-verde">
                  Mis rutinas favoritas
                </Link>
                <Link href={routes.miPerfil} className="hover:text-verde">
                  Notificaciones
                </Link>
                <Link href={routes.miPerfil} className="hover:text-verde">
                  Ayuda y Soporte
                </Link>
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
            <button className="px-6 py-2 transition rounded-md font-poppins hover:bg-verde hover:scale-110 ring-2 ring-gray-300 ring-opacity-100 ">
              Ingresa
            </button>
          </Link>
          <Link href={routes.registro}>
            <button className="px-6 py-2 transition rounded-md font-poppins hover:bg-verde hover:scale-110 ring-2 ring-gray-300 ring-opacity-100 ">
              Registrate
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserAuth;
