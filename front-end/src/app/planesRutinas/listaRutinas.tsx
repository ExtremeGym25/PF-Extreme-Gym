"use client";
import React, { useEffect, useState, useRef } from "react";
import { IPlans, PlanCategory } from "@/app/tipos";
import { getPlanService } from "../servicios/planes";
import Filtro from "./filtro";

const ListaRutinas = () => {
  const [rutinas, setRutinas] = useState<IPlans[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [categoria, setCategoria] = useState<PlanCategory | null>(null);
  const mountedRef = useRef(true);
  useEffect(() => {
    let isMounted = true; // variable local para controlar si el componente sigue montado

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
        console.log("Datos de la API recibidos:", data);

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
        Lista de Rutinas
      </h2>
      <div className="py-4">
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
        <ul className="space-y-4">
          {rutinas.map((rutina) => (
            <li key={rutina.id} className="p-4 bg-gray-800 rounded-lg">
              <h3 className="text-lg font-bold">{rutina.nombre}</h3>
              <p>{rutina.descripcion}</p>
              {rutina.imageUrl ? (
                <video controls className="w-full mt-2 rounded-lg">
                  <source src={rutina.imageUrl} type="video/mp4" />
                  Tu navegador no soporta el elemento de video.
                </video>
              ) : (
                <p className="text-gray-400">No hay video disponible</p>
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
          className="px-4 py-2 text-sm font-semibold text-blue-600 transition bg-white rounded-md hover:bg-gray-200 disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="text-white">Página {page}</span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="px-4 py-2 text-sm font-semibold text-blue-600 transition bg-white rounded-md hover:bg-gray-200"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default ListaRutinas;
