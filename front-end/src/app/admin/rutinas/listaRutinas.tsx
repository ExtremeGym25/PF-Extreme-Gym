"use client";
import React, { useEffect, useState, useRef } from "react";
import { IPlans } from "@/app/tipos";
import { getPlanService, updatePlanService } from "../../servicios/planes";
import DeleteRutinas from "./deleteRutina";

const ListaRutinas = () => {
  const [rutinas, setRutinas] = useState<IPlans[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [categoria, setCategoria] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nuevaRutina, setNuevaRutina] = useState<IPlans | null>(null);
  const mountedRef = useRef(true);

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

        if (mountedRef.current) {
          setRutinas([...data.data]); // 🔥 Forzamos un nuevo array
          console.log("Rutinas después del setRutinas:", rutinas);
        }
      } catch (err) {
        console.error("Error en fetchRutinas:", err);
        if (mountedRef.current) {
          setError("Error al obtener rutinas");
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    };

    fetchRutinas();
  }, [page, categoria, limit]);

  const actualizarRutina = async (id: string, nuevaRutina: IPlans) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No hay token disponible");
      return;
    }

    try {
      await updatePlanService(token, id, nuevaRutina);

      setRutinas((rutinas) =>
        rutinas.map((r) => (r.id === id ? { ...r, ...nuevaRutina } : r))
      );

      setEditingId(null);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error al actualizar:", error);
      setError("Error al actualizar la rutina");
    }
  };

  const handlePlanDeleted = (deletedId: string) => {
    setRutinas((prevRutinas) =>
      prevRutinas.filter((rutina) => rutina.id !== deletedId)
    );
  };
  console.log("Renderizando con rutinas:", rutinas);
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
          <option value="salud">Especializado</option>
          <option value="fuerza">Funcional</option>
          <option value="salud">Acuático</option>
          <option value="fuerza">Mente y Cuerpo</option>
          <option value="salud">Artes Marciales</option>
          <option value="fuerza">Aeróbico</option>
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
          {rutinas.map((rutina) => (
            <li
              key={rutina.id}
              className="p-4 bg-gray-800 rounded-lg shadow-md"
            >
              {editingId === rutina.id ? (
                <>
                  <input
                    type="text"
                    value={nuevaRutina?.nombre || ""}
                    onChange={(e) =>
                      setNuevaRutina((prev) =>
                        prev ? { ...prev, nombre: e.target.value } : null
                      )
                    }
                    className="w-full p-2 mb-2 border rounded"
                  />
                  <textarea
                    value={nuevaRutina?.descripcion || ""}
                    onChange={(e) =>
                      setNuevaRutina((prev) =>
                        prev ? { ...prev, descripcion: e.target.value } : null
                      )
                    }
                    className="w-full p-2 mb-2 border rounded"
                  />
                  <button
                    onClick={() => {
                      if (editingId && nuevaRutina) {
                        actualizarRutina(editingId, nuevaRutina);
                      }
                    }}
                    disabled={
                      nuevaRutina?.nombre ===
                        rutinas.find((r) => r.id === editingId)?.nombre &&
                      nuevaRutina?.descripcion ===
                        rutinas.find((r) => r.id === editingId)?.descripcion
                    }
                    className="w-full px-3 py-1 text-white bg-green-500 rounded md:w-auto hover:bg-green-700"
                  >
                    Guardar
                  </button>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-bold">{rutina.nombre}</h3>
                  <p className="text-sm">{rutina.descripcion}</p>

                  {rutina.imageUrl ? (
                    <video controls className="w-full mt-2 rounded-lg">
                      <source src={rutina.imageUrl} type="video/mp4" />
                      Tu navegador no soporta el elemento de video.
                    </video>
                  ) : (
                    <p className="text-gray-400">No hay video disponible</p>
                  )}

                  <div className="flex flex-col gap-2 mt-2 md:flex-row">
                    <button
                      onClick={() => {
                        setEditingId(rutina.id ?? "");
                        setNuevaRutina({ ...rutina });
                      }}
                      className="px-4 py-2 mt-4 text-sm transition rounded-md md:w-auto md:px-6 font-poppins bg-verde text-foreground hover:bg-lime-200 hover:scale-110 ring-2 ring-lime-900 ring-opacity-100 md:text-base"
                    >
                      Editar
                    </button>

                    <DeleteRutinas
                      id={rutina.id ?? ""}
                      onPlanDeleted={handlePlanDeleted}
                    />
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-col justify-center gap-4 mt-4 mb-4 md:flex-row">
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
