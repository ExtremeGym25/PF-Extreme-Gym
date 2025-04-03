"use client";
import React, { useEffect, useMemo, useState } from "react";
import { getEvents } from "../servicios/eventos";
import { toast } from "react-toastify";
import { ExtremeSportCategory, IEvent } from "../tipos";
import FiltroEventos from "./filtroEventos";
import Reservar from "./reservar";

const GetEventos = () => {
  const [eventos, setEventos] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categoria, setCategoria] = useState<ExtremeSportCategory | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchEventos = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No hay token disponible");
          return;
        }
        const data = await getEvents(token);
        setEventos(data);
        console.log("Datos  recibidos eventos:", data);
      } catch (error: any) {
        console.error("Error en eventos", error.message);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEventos();
    return () => {
      isMounted = false;
    };
  }, []);
  const eventosFiltrados = useMemo(() => {
    if (!categoria) return eventos;
    return eventos.filter(
      (evento) =>
        evento.isActive && (!categoria || evento.category === categoria)
    );
  }, [categoria, eventos]);

  return (
    <div className="max-w-4xl p-4 mx-auto text-foreground">
      <h1 className="mb-6 text-4xl font-bold text-center">Nuestros Eventos</h1>

      <p className="px-16 py-4 text-lg text-center">
        ¡No te limites! Reserva varios cupos para ti y tu acompañante y
        disfruten juntos la experiencia. 🚀💪
      </p>

      <FiltroEventos
        categories={Object.values(ExtremeSportCategory)}
        onCategoryChange={(cat) => setCategoria(cat)}
        currentCategory={categoria}
      />

      <div className="max-w-4xl mx-auto space-y-6">
        {eventosFiltrados.filter((evento) => !evento.isCancelled).length ===
        0 ? (
          <p className="py-4 text-2xl text-center text-black">
            No hay eventos disponibles.
          </p>
        ) : (
          eventosFiltrados
            .filter((evento) => !evento.isCancelled)
            .map((evento) => (
              <div
                key={evento.id}
                className="flex flex-col p-4 border rounded-lg shadow-lg bg-blanco border-verde md:flex-row md:items-center md:gap-6"
              >
                <div className="w-[300px] h-[200px] flex-shrink-0">
                  {evento.imageUrl ? (
                    <img
                      className="object-cover w-full h-full rounded-md"
                      src={evento.imageUrl}
                      alt="Imagen del evento"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gray-700 rounded-md">
                      <span className="text-gray-400">
                        No hay imagen disponible
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold capitalize text-foreground">
                    {evento.name}
                  </h2>
                  <p className="text-foreground">
                    {new Date(evento.date).toLocaleDateString()} - {evento.time}
                  </p>
                  <p className="mt-2 text-justify capitalize text-foreground line-clamp-3">
                    {evento.description}
                  </p>
                  <p className="mt-2 capitalize text-foreground">
                    {evento.location}
                  </p>
                  <p className="font-semibold text-verde">
                    Capacidad: {evento.capacity}
                  </p>
                </div>

                <Reservar eventoId={evento.id} />
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default GetEventos;
