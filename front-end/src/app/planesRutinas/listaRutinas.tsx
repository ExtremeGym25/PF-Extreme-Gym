"use client";
import React, { useEffect, useState, useRef } from "react";
import { IPlans, PlanCategory } from "@/app/tipos";
import { getPlanService } from "../servicios/userplanes";
import Filtro from "./filtro";
import ButtonPrimary from "../components/buttons/buttonPrimary";
import Link from "next/link";
import { routes } from "../routes/routes";
import { useAuth } from "./../contextos/contextoAuth";
import AssignFavoritos from "./assignFavoritos";

const ListaRutinas = () => {
  const [rutinas, setRutinas] = useState<IPlans[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [categoria, setCategoria] = useState<PlanCategory | null>(null);
  const mountedRef = useRef(true);
  const { isAuth } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const fetchRutinas = async () => {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No hay token disponible");
          return;
        }

        const data = await getPlanService(
          token,
          page,
          limit,
          categoria || undefined
        );
        console.log("Datos  recibidos Ruitans:", data);
        console.log("Datos  recibidos Ruitans:", data);

        if (isMounted) {
          setRutinas([...data.data]);
        }
      } catch (err) {
        console.error("Error en fetchRutinas:", err);
        if (isMounted) {
          setError("Error al obtener rutinas");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchRutinas();

    return () => {
      isMounted = false;
    };
  }, [page, categoria, limit]);

  return (
    <div className="max-w-4xl p-4 mx-auto text-foreground">
      <h2 className="mb-4 text-lg font-bold text-center md:text-2xl">
        Nuestras Rutinas
      </h2>
      <p className="px-16 py-4 text-lg text-center ">
        {" "}
        💪🔥 ¡Desafía tus límites y lleva tu energía al máximo! Entrena con
        intensidad, supera cada reto y siente la satisfacción de avanzar. ¡Tú
        puedes, el momento es ahora! 🚀🏋️‍♂️
      </p>
      <div className="py-4 ">
        <Filtro
          categories={Object.values(PlanCategory)}
          onCategoryChange={(cat) => setCategoria(cat)}
          currentCategory={categoria}
        />
      </div>
      {loading ? (
        <p className="text-center">Cargando...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : rutinas.length > 0 ? (
        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 ">
          {rutinas.map((rutina) => (
            <li
              key={rutina.id}
              className="relative p-4 transition transform border rounded-lg shadow-md border-verde hover:scale-105 font-poppins"
            >
              <AssignFavoritos planId={rutina.id || ""} />

              <h3 className="text-lg font-semibold text-center text-foreground">
                {rutina.nombre}
              </h3>
              {rutina.imageUrl ? (
                isAuth ? (
                  <video
                    controls
                    className="object-cover w-full mt-2 rounded-md h-60"
                  >
                    <source
                      src={
                        typeof rutina.imageUrl === "string"
                          ? rutina.imageUrl
                          : URL.createObjectURL(rutina.imageUrl)
                      }
                      type="video/mp4"
                    />
                  </video>
                ) : (
                  <div className="mt-2 text-center text-gray-400">
                    Debes iniciar sesión para ver el video.
                  </div>
                )
              ) : (
                <p className="mt-2 text-center text-gray-400">
                  No hay video disponible
                </p>
              )}

              <p className="mt-2 text-sm text-justify text-foreground">
                {rutina.descripcion}
              </p>
              {isAuth ? (
                <p></p>
              ) : (
                <Link href={routes.login}>
                  <ButtonPrimary>Inicia Sesión</ButtonPrimary>
                </Link>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-400">No hay rutinas disponibles.</p>
      )}

      <div className="flex flex-col justify-center gap-4 mt-4 mb-4 md:flex-row">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 text-sm font-semibold transition rounded-md bg-fondo text-azul1 hover:bg-verde disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="text-sm text-azul1">Página {page}</span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="px-4 py-2 text-sm font-semibold transition rounded-md bg-fondo text-azul1 hover:bg-verde"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default ListaRutinas;
