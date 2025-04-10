"use client";
import { useEffect, useState, useCallback } from "react";
import { getMyPlans } from "../../servicios/userplanes";
import { toast } from "react-toastify";
import { IPlans } from "@/app/tipos";
import { useAuth } from "@/app/contextos/contextoAuth";
import Link from "next/link";
import { routes } from "@/app/routes/routes";

const MisPlanes = () => {
  const { user } = useAuth();
  const isFree = user?.subscriptionType === "free";
  const isPremium = user?.subscriptionType === "premium";
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
      setRutinas(data.map((item: { plan: any }) => item.plan));
      console.log(data.map((item: { plan: any }) => item.plan));
    } catch (error: any) {
      console.error("Error al obtener mis favoritos:", error);
      toast.error("No tienes rutinas favoritas");
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
      {isPremium && (
        <div>
          <h2 className="mb-4 text-3xl font-bold text-center transition-transform duration-300 hover:scale-110 md:text-2xl">
            Mis Rutinas Favoritas
          </h2>

          {loading ? (
            <p className="text-center">Cargando...</p>
          ) : error ? (
            <div className="text-center">
              <p className="text-red-500">{error}</p>
              <button
                onClick={fetchMyPlans}
                className="px-4 py-2 mt-4 text-sm transition rounded-md md:w-auto md:px-6 font-poppins bg-fondo text-foreground hover:bg-verde hover:scale-110 ring-2 ring-gray-300 ring-opacity-100 md:text-base"
              >
                Reintentar
              </button>
            </div>
          ) : rutinas.length > 0 ? (
            <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {rutinas.map((rutina, index) => (
                <li
                  key={rutina.id || index}
                  className="relative p-4 text-black transition transform border rounded-lg shadow-md border-verde hover:scale-105 font-poppins"
                >
                  <h3 className="text-lg font-semibold text-center text-foreground">
                    {rutina.nombre}
                  </h3>
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
                      Tu navegador no soporta el elemento de video.
                    </video>
                  ) : (
                    <p className="mt-2 text-center text-gray-400">
                      No hay video disponible
                    </p>
                  )}
                  <p className="mt-2 text-sm text-justify text-black">
                    {rutina.descripcion}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-400">
              No tienes planes asignados.
            </p>
          )}
        </div>
      )}

      {isFree && (
        <div className="flex flex-col items-center justify-center w-full min-h-screen">
          <h2 className="mb-4 text-3xl font-bold text-center transition-transform duration-300 hover:scale-110 md:text-2xl">
            No tienes acceso mira nuestras tarifas
          </h2>
          <div className="flex gap-4">
            <Link href={routes.tarifas}>
              <button className="px-6 py-2 transition rounded-md font-poppins hover:bg-verde hover:scale-110 ring-2 ring-gray-300 ring-opacity-100">
                Ver Tarifas
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default MisPlanes;
