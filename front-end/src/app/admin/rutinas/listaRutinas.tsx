"use client";
import React, { useEffect, useState, useRef } from "react";
import { IPlans } from "@/app/tipos";
import DeleteRutinas from "./deleteRutina";
import { getPlanService, updatePlanService } from "../../servicios/planes";
import { toast } from "react-toastify";

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

  const actualizarRutina = async (id: string, nuevaRutina: IPlans) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No hay token disponible");
      return;
    }

    try {
      await updatePlanService(token, id, nuevaRutina);
      toast.success("Rutina modificada con exito");
      setRutinas((prevRutinas) =>
        prevRutinas.map((r) => (r.id === id ? { ...r, ...nuevaRutina } : r))
      );

      setEditingId(null);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error: any) {
      console.error("Error al actualizar:", error);
      setError("Error al actualizar la rutina");
      toast.error(error.message);
    }
  };

  const handlePlanDeleted = (deletedId: string) => {
    setRutinas((prevRutinas) =>
      prevRutinas.filter((rutina) => rutina.id !== deletedId)
    );
  };

  console.log("Renderizando con rutinas:", rutinas);
  return (
    <div className="max-w-4xl p-4 mx-auto text-foreground">
      <h2 className="my-6 text-2xl font-bold text-center text-foreground md:text-4xl">
        Lista de Rutinas
      </h2>

      <div className="flex flex-col gap-4 mb-4 md:flex-row">
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="w-full p-2 border rounded bg-fondo md:w-auto"
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
          {rutinas.map((rutina) => (
            <li key={rutina.id} className="p-4 rounded-lg shadow-md bg-fondo">
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
                    className="w-full p-2 mb-2 bg-white border rounded"
                  />
                  <textarea
                    value={nuevaRutina?.descripcion || ""}
                    onChange={(e) =>
                      setNuevaRutina((prev) =>
                        prev ? { ...prev, descripcion: e.target.value } : null
                      )
                    }
                    className="w-full p-2 mb-2 bg-white border rounded"
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
                    className="w-full px-4 py-2 mt-4 text-sm transition rounded-md md:w-auto md:px-6 font-poppins bg-fondo text-foreground hover:bg-verde hover:scale-110 ring-2 ring-gray-300 ring-opacity-100 md:text-base"
                  >
                    Guardar
                  </button>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-bold">{rutina.nombre}</h3>
                  <p className="text-sm">{rutina.descripcion}</p>

                  {rutina.imageUrl ? (
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
                    <p className="text-gray-400">No hay video disponible</p>
                  )}

                  <div className="flex flex-col gap-2 mt-2 md:flex-row">
                    <button
                      onClick={() => {
                        setEditingId(rutina.id ?? "");
                        setNuevaRutina({ ...rutina });
                      }}
                      className="px-4 py-2 mt-4 text-sm transition rounded-md md:w-auto md:px-6 font-poppins bg-verde text-foreground hover:scale-110 ring-opacity-100 md:text-base"
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
