/* eslint-disable @next/next/no-img-element */

"use client";
import React, { useEffect, useState } from "react";
import { getEvents } from "../servicios/eventos";

const EventosView = () => {
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    const fetchEventos = async () => {
      const data = await getEvents();
      setEventos(data);
    };
    fetchEventos();
  }, []);

  return (
    <div className="min-h-screen bg-blanco text-azul1 p-6">
      <h1 className="text-4xl font-bold text-center mb-6">Lista de Eventos</h1>
      <div className="max-w-4xl mx-auto space-y-6">
        {eventos.length === 0 ? (
          <p className="text-center text-black text-2xl">No hay eventos disponibles.</p>
        ) : (
          eventos.map((evento) => (
            <div
              key={evento.id}
              className="bg-blanco border border-verde p-4 rounded-lg shadow-lg flex flex-col md:flex-row items-center"
            >
              {evento.image && (
                <img
                  src={evento.image}
                  alt={evento.name}
                  className="w-40 h-40 object-cover rounded-lg mb-4 md:mb-0 md:mr-6"
                />
              )}
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-black uppercase">{evento.name}</h2>
                <p className="text-naranja">{new Date(evento.date).toLocaleDateString()} - {evento.time}</p>
                <p className="text-black mt-2">{evento.description}</p>
                <p className="text-black font-bold uppercase mt-2">{evento.location}</p>
                <p className="text-verde font-semibold">Capacidad: {evento.capacity}</p>
              </div>
              <button className="mt-4 md:mt-0 bg-verde text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">
                Registrarse
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventosView;
