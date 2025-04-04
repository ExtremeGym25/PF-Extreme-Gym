"use client";

import React, { useEffect, useState } from "react";
import { IEvent } from "@/app/tipos";
import { getEvents, updateEventRequest } from "@/app/servicios/eventos";
import { useMemo } from "react";
import DeleteEventos from "./deleteEventos";
import { useCallback } from "react";

const ListasEventos = () => {
  const [eventos, setEventos] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedEvent, setEditedEvent] = useState<IEvent | null>(null);
  const [categoria, setCategoria] = useState<string>("");

  const fetchEventos = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      console.log("Token obtenido:", token);

      if (!token) {
        setError("No hay token disponible");
        return;
      }

      const data = await getEvents(token);
      console.log("Datos de la API recibidos:", data);
      console.log("Eventos antes de setEventos:", eventos);

      if (Array.isArray(data)) {
        setEventos(data);
      }
    } catch (err) {
      console.error("Error en fetchEventos:", err);
      setError("Error al obtener Eventos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Fetching eventos...");
    fetchEventos();
  }, []);

  const eventosFiltrados = useMemo(() => {
    if (!categoria) return eventos;
    return eventos.filter((evento) => evento.category === categoria);
  }, [categoria, eventos]);

  console.log("Eventos filtrados:", eventosFiltrados);
  eventos.forEach((evento) => console.log(evento.category));

  const handleEdit = (evento: IEvent) => {
    setEditingId(evento.id);
    setEditedEvent({ ...evento });
  };

  const handleUpdate = async () => {
    if (!editedEvent) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No hay token disponible");
        return;
      }
      const response = await updateEventRequest(
        editedEvent,
        token,
        editedEvent.id
      );
      setEventos((prev) =>
        prev.map((evt) => (evt.id === editedEvent.id ? editedEvent : evt))
      );
      setEditingId(null);
      console.log(response, "respuesta");
    } catch (err) {
      console.error("Error en updateEvent:", err);
      setError("Error al actualizar el evento");
    }
  };

  return (
    <div className="max-w-4xl mx-auto text-white">
      <h2 className="my-6 text-2xl font-bold text-center text-white md:text-4xl">
        Listado Eventos
      </h2>

      <div className="flex flex-col gap-4 mb-4 md:flex-row">
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="w-full p-2 border rounded bg-azul1 md:w-auto"
        >
          <option value="">Seleccione una categoría</option>
          <option value="Deportes Aéreos">Deportes Aéreos</option>
          <option value="Deportes Acuáticos">Deportes Acuáticos</option>
          <option value="Deportes de Montaña">Deportes de Montaña</option>
          <option value="Deportes de Motor">Deportes de Motor</option>
          <option value="Deportes de Aventura">Deportes de Aventura</option>
          <option value="Deportes de Invierno">Deportes de Invierno</option>
        </select>
      </div>

      {loading ? (
        <p className="text-center">Cargando...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : eventosFiltrados.length > 0 ? (
        <ul className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
          {eventosFiltrados.map((evento) => (
            <li
              key={evento.id}
              className="flex flex-col justify-between p-4 bg-gray-800 rounded-lg shadow-md"
            >
              {editingId === evento.id ? (
                <div>
                  <input
                    type="text"
                    value={editedEvent?.name || ""}
                    onChange={(e) =>
                      setEditedEvent({
                        ...editedEvent!,
                        name: e.target.value,
                      })
                    }
                    className="w-full p-2 mb-2 text-black rounded"
                  />
                  <textarea
                    value={editedEvent?.description || ""}
                    onChange={(e) =>
                      setEditedEvent({
                        ...editedEvent!,
                        description: e.target.value,
                      })
                    }
                    className="w-full p-2 text-black rounded"
                  />

                  <button
                    onClick={handleUpdate}
                    className="w-full p-2 mt-2 text-white bg-blue-500 rounded"
                  >
                    Guardar
                  </button>
                </div>
              ) : (
                <div className="flex flex-col h-full">
                  <h3 className="text-lg font-bold capitalize ">
                    {evento.name}
                  </h3>
                  <p className="flex-grow text-sm text-justify capitalize ">
                    {evento.description}
                  </p>
                  <p className="flex-grow text-sm text-justify capitalize ">
                    Capacidad:
                    {evento.capacity}
                  </p>
                  <p className="flex-grow text-sm text-justify capitalize ">
                    Lugar:{evento.location}
                  </p>
                  <p className="flex-grow text-sm text-justify capitalize ">
                    Fecha:{new Date(evento.date).toLocaleDateString()}
                  </p>
                  <p className="flex-grow text-sm text-justify capitalize ">
                    Hora:{evento.time}
                  </p>

                  {evento.imageUrl ? (
                    <img
                      className="object-cover w-full mt-2 rounded-md h-60"
                      src={
                        typeof evento.imageUrl === "string"
                          ? evento.imageUrl
                          : "https://res.cloudinary.com/dixcrmeue/image/upload/v1743014544/xTREME_GYM_2_tjw1rv.png"
                      }
                      alt="Imagen del evento"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full mt-2 bg-gray-700 rounded-md h-60">
                      <span className="text-gray-400">
                        No hay imagen disponible
                      </span>
                    </div>
                  )}
                  {evento.isCancelled ? (
                    <p className="mt-2 font-bold text-center text-red-500">
                      🚨 Evento Cancelado
                    </p>
                  ) : (
                    <div className="flex flex-col gap-2 mt-4 md:flex-row">
                      <button
                        onClick={() => handleEdit(evento)}
                        className="w-full p-2 text-white bg-yellow-500 rounded md:w-auto"
                      >
                        Editar
                      </button>
                      <DeleteEventos id={evento.id} />
                    </div>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-400">No hay eventos disponibles.</p>
      )}
    </div>
  );
};
export default ListasEventos;
