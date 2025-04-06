"use client";
import React from "react";
import ButtonPrimary from "../components/buttons/buttonPrimary";
import { useRouter } from "next/navigation";

const Precios = () => {
  const router = useRouter();
  return (
    <div className="px-4 py-4">
      <h2 className="text-3xl font-bold text-center transition-transform duration-300 hover:scale-110">
        Nuestros Precios
      </h2>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col justify-between p-6 transition-transform duration-300 border shadow-lg bg-fondo rounded-xl border-verde hover:scale-105">
          <h3 className="text-2xl font-bold text-center text-verde">
            Tarifa Mensual
          </h3>
          <p className="mt-4 text-sm text-justify">
            Accede a <strong>todas las categorías</strong> de entrenamiento:
            fuerza, salud, funcional, especializado, acuático, mente y cuerpo,
            artes marciales y aeróbico.
          </p>
          <p className="mt-2 text-sm text-justify">
            Además, participa sin costo adicional en eventos de deportes
            extremos como:
            <strong>
              {" "}
              deportes aéreos, acuáticos, de montaña, motor y aventura.
            </strong>
          </p>
          <div className="mt-6 text-center">
            <span className="text-3xl font-extrabold text-verde">$100 </span>
            <p className="text-sm text-gray-500">por mes</p>
          </div>
          <button
            onClick={() => router.push("/tarifas/compras")}
            className="w-full px-4 py-2 mt-4 text-sm transition rounded-md md:w-auto md:px-6 font-poppins bg-fondo text-foreground hover:bg-verde hover:scale-110 ring-2 ring-gray-300 ring-opacity-100 md:text-base"
          >
            Comprar
          </button>
        </div>

        <div className="flex flex-col justify-between p-6 transition-transform duration-300 border shadow-lg bg-fondo rounded-xl border-verde hover:scale-105">
          <h3 className="text-2xl font-bold text-center text-verde">
            Tarifa Anual
          </h3>
          <p className="mt-4 text-sm text-justify">
            Disfruta de <strong>12 meses completos</strong> de entrenamiento sin
            restricciones. Incluye acceso a todas nuestras categorías y eventos
            especiales.
          </p>
          <p className="mt-2 text-sm text-justify">
            Ideal para quienes quieren comprometerse con su bienestar físico y
            mental a largo plazo. ¡Ahorra más de un 15% comparado con la
            mensual!
          </p>
          <div className="mt-6 text-center">
            <span className="text-3xl font-extrabold text-verde">$1.100</span>
            <p className="text-sm text-gray-500">por año (1 mes gratis)</p>
          </div>
          <button
            onClick={() => router.push("/tarifas/compras")}
            className="w-full px-4 py-2 mt-4 text-sm transition rounded-md md:w-auto md:px-6 font-poppins bg-fondo text-foreground hover:bg-verde hover:scale-110 ring-2 ring-gray-300 ring-opacity-100 md:text-base"
          >
            Comprar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Precios;
