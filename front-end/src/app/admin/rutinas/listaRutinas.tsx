"use client";
import React, { useEffect, useState } from "react";
import { IPlans } from "@/app/tipos";
import { getPlanService } from "../../servicios/userplanes";

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
        console.log("Datos de la API recibidos:", data);
        setRutinas([...data.data]);
      } catch (err) {
        console.error("Error en fetchRutinas:", err);
        setError("Error al obtener rutinas");
      } finally {
        setLoading(false);
      }
    };

    fetchRutinas();
  }, [page, categoria, limit]);

  return (
    <div className="max-w-4xl p-4 mx-auto text-white">
      <h2 className="mb-4 text-lg font-bold text-center md:text-2xl">
        Lista de Rutinas
      </h2>

      <div className="flex flex-col gap-4 mb-4 md:flex-row">
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="w-full p-2 border rounded bg-azul1 md:w-auto"
        >
          <option value="">Todas las categorías</option>
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
          className="w-full p-2 border rounded md:w-auto"
        >
          <option value="5">5 por página</option>
          <option value="10">10 por página</option>
        </select>
      </div>

      {loading ? (
        <p className="text-center">Cargando...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <ul className="space-y-4">
          {rutinas.length > 0 ? (
            rutinas.map((rutina) => (
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
            ))
          ) : (
            <p className="text-center text-gray-400">
              No hay rutinas disponibles.
            </p>
          )}
        </ul>
      )}

      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 text-white bg-gray-500 rounded hover:bg-gray-700 disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="text-white">Página {page}</span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="px-3 py-1 text-white bg-gray-500 rounded hover:bg-gray-700"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default ListaRutinas;
