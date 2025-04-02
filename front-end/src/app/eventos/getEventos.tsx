"use client";
import React, { useEffect, useMemo, useState } from "react";
import { getEvents } from "../servicios/eventos";
import { toast } from "react-toastify";
import { ExtremeSportCategory, IEvent } from "../tipos";
import FiltroEventos from "./filtroEventos";
import ButtonPrimary from "../components/buttons/buttonPrimary";

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
        console.log("Datos  recibidos Ruitans:", data);
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

  return (
    <div className="max-w-4xl p-4 mx-auto text-foreground">
      <h1 className="mb-6 text-4xl font-bold text-center">Nuestros Eventos</h1>

      <p className="px-16 py-4 text-lg text-center ">
        {" "}
        ¡No te limites! Reserva varios cupos para ti y tu acompañante y
        disfruten juntos la experiencia. 🚀💪
      </p>
      <div>
        <FiltroEventos
          categories={Object.values(ExtremeSportCategory)}
          onCategoryChange={(cat) => setCategoria(cat)}
          currentCategory={categoria}
        />
      </div>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col gap-4 mb-4 md:flex-row"></div>
        {eventosFiltrados.length === 0 ? (
          <p className="text-2xl text-center text-black">
            No hay eventos disponibles.
          </p>
        ) : (
          eventosFiltrados.map((evento) => (
            <div
              key={evento.id}
              className="flex flex-col items-center p-4 border rounded-lg shadow-lg bg-blanco border-verde md:flex-row"
            >
              {/* {evento.image && ( */}
              <img
                src="https://png.pngtree.com/thumb_back/fh260/background/20230521/pngtree-sunflower-full-screen-backdrop-widescreen-photos-image_2684387.jpg"
                alt={evento.name}
                className="object-cover w-40 h-40 mb-4 rounded-lg md:mb-0 md:mr-6"
              />
              {/* )} */}
              <div className="flex-1">
                <h2 className="text-xl font-semibold uppercase text-foreground">
                  {evento.name}
                </h2>
                <p className="text-foreground">
                  {new Date(evento.date).toLocaleDateString()} - {evento.time}
                </p>
                <p className="mt-2 text-foreground">{evento.description}</p>
                <p className="mt-2 uppercase text-foreground">
                  {evento.location}
                </p>
                <p className="font-semibold text-verde">
                  Capacidad: {evento.capacity}
                </p>
              </div>
              <ButtonPrimary>Reservar</ButtonPrimary>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GetEventos;
