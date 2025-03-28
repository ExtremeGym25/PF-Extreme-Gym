"use client";
import React, { useEffect, useState } from "react";
import { IPlans } from "@/app/tipos";
import { getPlanService } from "@/app/servicios/planes";
import DeleteRutinas from "./DeleteRutinas";

const ListaRutinas = () => {
  const [rutinas, setRutinas] = useState<IPlans[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [categoria, setCategoria] = useState<string>("");

  useEffect(() => {
    const fetchRutinas = async () => {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No hay token disponible");
          return;
        }

        const data = await getPlanService(token, page, limit, categoria);
        console.log("Datos obtenidos:", data);
        setRutinas(data.data);
      } catch (err) {
        setError("Error al obtener rutinas");
      } finally {
        setLoading(false);
      }
    };

    fetchRutinas();
  }, [page, categoria, limit]);

  return (
    <div className="p-4 text-blanco">
      <h2 className="pt-1 pb-0 mb-0 font-bold text-center text-blanco sm:text-xs md:text-xl lg:text-2xl">
        Lista de Rutinas
      </h2>
      <div className="flex flex-col gap-4 mb-6 sm:flex-row">
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="flex-1 p-2 text-xs text-white border border-gray-600 rounded bg-azul1"
        >
          <option value="">Selecciona una categoría</option>
          <option value="salud">Salud</option>
          <option value="fuerza">Fuerza</option>
          <option value="especializado">Especializado</option>
          <option value="funcional">Funcional</option>
          <option value="acuatico">Acuático</option>
          <option value="mentecuerpo">Mente y Cuerpo</option>
          <option value="artesmarciales">Artes Marciales</option>
          <option value="aerobico">Aeróbico</option>
        </select>

        <select
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="flex-1 p-2 text-white border border-gray-600 rounded bg-azul1"
        >
          <option value="5">5 por página</option>
          <option value="10">10 por página</option>
          <option value="20">20 por página</option>
        </select>
      </div>

      {loading ? (
        <p className="py-8 text-center">Cargando...</p>
      ) : error ? (
        <p className="py-8 text-center text-red-500">{error}</p>
      ) : (
        <ul className="space-y-6">
          {rutinas.map((rutina) => (
            <li key={rutina.id} className="p-4 rounded-lg bg-azul2">
              <h3 className="text-xl font-semibold">{rutina.nombre}</h3>
              <p className="mt-2 text-gray-300">{rutina.descripcion}</p>
              <div className="mt-4 aspect-w-16 aspect-h-9">
                <video controls className="w-full rounded-lg">
                  <source src={rutina.descripcion} type="video/mp4" />
                  Tu navegador no soporta el elemento de video.
                </video>
                <DeleteRutinas
                  id={rutina.id || ""}
                  onPlanDeleted={() => {
                    setRutinas(rutinas.filter((r) => r.id !== rutina.id));
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="font-medium">Página {page}</span>
        <button
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-gray-700 rounded"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default ListaRutinas;
