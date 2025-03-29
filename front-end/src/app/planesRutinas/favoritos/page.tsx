"use client";
import { useEffect, useState, useCallback } from "react";
import { getMyPlans } from "../../servicios/userplanes";
import { toast } from "react-toastify";
import { IPlans } from "@/app/tipos";

const MisPlanes = () => {
  const [rutinas, setRutinas] = useState<IPlans[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMyPlans = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No has iniciado sesión");
        setError("No has iniciado sesión");
        setLoading(false);
        return;
      }

      const data = await getMyPlans(token);
      setRutinas(data);
    } catch (error: any) {
      console.error("Error al obtener mis planes:", error);
      toast.error(error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyPlans();
  }, [fetchMyPlans]);

  return (
    <div className="max-w-4xl p-4 py-16 mx-auto text-foreground">
      <h2 className="mb-4 text-3xl font-bold text-center transition-transform duration-300 hover:scale-110 md:text-2xl">
        Mis Planes
      </h2>

      {loading ? (
        <p className="text-center">Cargando...</p>
      ) : error ? (
        <div className="text-center">
          <p className="text-red-500">{error}</p>
          <button
            onClick={fetchMyPlans}
            className="px-4 py-2 mt-4 text-sm transition rounded-md -full md:w-auto md:px-6 font-poppins bg-fondo text-foreground hover:bg-verde hover:scale-110 ring-2 ring-gray-300 ring-opacity-100 md:text-base"
          >
            Reintentar
          </button>
        </div>
      ) : rutinas.length > 0 ? (
        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rutinas.map((rutina) => (
            <li
              key={rutina.id}
              className="relative p-4 transition transform border rounded-lg shadow-md border-verde hover:scale-105 font-poppins"
            >
              <h3 className="text-lg font-semibold text-center text-foreground">
                {rutina.nombre}
              </h3>
              <p className="mt-2 text-sm text-justify text-foreground">
                {rutina.descripcion}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-400">No tienes planes asignados.</p>
      )}
    </div>
  );
};

export default MisPlanes;
