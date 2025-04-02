"use client";

import React, { useEffect, useState } from "react";
import { IEvent } from "@/app/tipos";
import { getEvents, updateEventRequest } from "@/app/servicios/eventos";
import { useMemo } from "react";
import DeleteEventos from "./deleteEventos";

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
      console.log(data, " eventos que me llegan");
      console.log("Eventos después de setEventos:", eventos);
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

  useEffect(() => {
    console.log("Eventos actualizados:", eventos);
  }, [eventos]);

  const eventosFiltrados = useMemo(() => {
    if (!categoria) return eventos;
    return eventos.filter((evento) => evento.category === categoria);
  }, [categoria, eventos]);
  console.log("Eventos filtrados:", eventosFiltrados);
  eventos.forEach((evento) => console.log(evento.category));

  const handleEdit = (evento: IEvent) => {
    setEditingId(evento.id);
    setEditedEvent(evento);
  };

  const handleUpdate = async () => {
    if (!editedEvent) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No hay token disponible");
        return;
      }
      console.log("ANTES DE EDITAR");
      console.log("ID del evento a actualizar:", editedEvent?.id);
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

  const handleEventDelete = (id: string) => {
    console.log("Intentando eliminar el evento con id:", id);
    setEventos((prevEventos) => {
      const nuevosEventos = prevEventos.filter((evento) => evento.id !== id);
      console.log("Eventos después de eliminar:", nuevosEventos);
      return nuevosEventos;
    });
  };

  const eventosCancelados = useMemo(
    () => eventos.filter((evento) => evento.isCancelled),
    [eventos]
  );
  return (
    <div className="max-w-4xl p-4 mx-auto text-white">
      <h2 className="mb-4 text-lg font-bold text-center md:text-2xl">
        Eventos
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
      ) : (
        <ul className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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
                  <h3 className="text-lg font-bold">{evento.name}</h3>
                  <p className="flex-grow text-sm">{evento.description}</p>

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
                      <DeleteEventos
                        id={evento.id}
                        onDelete={handleEventDelete}
                      />
                    </div>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="max-w-4xl p-4 mx-auto text-white">
        <h3 className="mt-4 text-xl font-bold text-red-500">
          Eventos Cancelados
        </h3>
        {eventosCancelados.length > 0 ? (
          <ul className="space-y-4">
            {eventosCancelados.map((evento) => (
              <li
                key={evento.id}
                className="p-4 bg-gray-800 rounded-lg shadow-md"
              >
                <h3 className="text-lg font-bold">{evento.name}</h3>
                <p className="text-sm">{evento.description}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No hay eventos cancelados.</p>
        )}
      </div>
    </div>
  );
};

export default ListasEventos;
