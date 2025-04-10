"use client";
import React, { useEffect, useMemo, useState } from "react";
import { getEvents } from "../servicios/eventos";
import { toast } from "react-toastify";
import { ExtremeSportCategory, IEvent } from "../tipos";
import FiltroEventos from "./filtroEventos";
import Reservar from "./reservar";
import MapaEventos from "../components/map/MapEventos";

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
        console.log(
          "Categorías desde backend:",
          data.map((e: { category: any }) => e.category)
        );
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
    return eventos.filter((evento) => evento.category === categoria);
  }, [categoria, eventos]);

  console.log("Eventos filtrados:", eventosFiltrados);
  eventos.forEach((evento) => console.log(evento.category));
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
                  <img
                    className="object-cover w-full h-full rounded-md"
                    src={
                      evento.imageUrl ||
                      "https://res.cloudinary.com/dixcrmeue/image/upload/v1743014544/xTREME_GYM_2_tjw1rv.png"
                    }
                    alt="Imagen del evento"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold capitalize text-foreground">
                    {evento.name}
                  </h2>
                  <p className="tesemiboldxt-foreground">
                    {new Date(evento.date).toLocaleDateString()} - {evento.time}
                  </p>
                  <p className="mt-2 text-justify capitalize text-foreground line-clamp-3">
                    {evento.description}
                  </p>
                  <p className="mt-2 capitalize text-foreground">
                    {evento.location}
                  </p>
                  <p className="mt-2 capitalize text-foreground">
                    Capacidad: {evento.capacity}
                  </p>
                  <div className="mt-6">
                    <MapaEventos
                      latitude={+evento.latitude}
                      longitude={+evento.longitude}
                    />
                  </div>
                </div>

                <Reservar eventId={evento.id} />
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default GetEventos;
