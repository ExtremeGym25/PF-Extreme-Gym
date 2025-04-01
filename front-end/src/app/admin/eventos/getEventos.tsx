"use client";

import React, { useEffect, useState } from "react";
import { IEvent } from "@/app/tipos";
import { getEvents, updateEventRequest } from "@/app/servicios/eventos";
import DeleteEventos from "./deleteEventos";
import { useMemo } from "react";

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
      if (!token) {
        setError("No hay token disponible");
        return;
      }

      const data = await getEvents(token);
      console.log("Datos de la API recibidos:", data);

      if (Array.isArray(data)) {
        setEventos(data);
      }
      console.log(data, " eventos que me llegan");
    } catch (err) {
      console.error("Error en fetchEventos:", err);
      setError("Error al obtener Eventos");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchEventos();
  }, []);

  const eventosFiltrados = useMemo(() => {
    if (!categoria) return eventos;
    return eventos.filter((evento) => evento.category === categoria);
  }, [categoria, eventos]);

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

      console.log("ID del evento a actualizar:", editedEvent?.id);
      await updateEventRequest(editedEvent, token, editedEvent.id);
      setEventos((prev) =>
        prev.map((evt) => (evt.id === editedEvent.id ? editedEvent : evt))
      );
      setEditingId(null);
    } catch (err) {
      console.error("Error en updateEvent:", err);
      setError("Error al actualizar el evento");
    }
    const handleEventDeleted = (deletedId: string) => {
      setEventos((prevEventos) =>
        prevEventos.filter((eventos) => eventos.id !== deletedId)
      );
    };

    console.log("Renderizando con rutinas:");
  };
  function handleEventDeleted(id: string): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="max-w-4xl p-4 mx-auto text-white">
      <h2 className="mb-4 text-lg font-bold text-center md:text-2xl">
        Lista de Eventos
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
        <ul className="space-y-4">
          {eventosFiltrados.map((evento) => (
            <li
              key={evento.id}
              className="p-4 bg-gray-800 rounded-lg shadow-md"
            >
              {editingId === evento.id ? (
                <div>
                  <input
                    type="text"
                    value={editedEvent?.name || ""}
                    onChange={(e) =>
                      setEditedEvent({ ...editedEvent!, name: e.target.value })
                    }
                    className="w-full p-2 mb-2 text-black"
                  />
                  <textarea
                    value={editedEvent?.description || ""}
                    onChange={(e) =>
                      setEditedEvent({
                        ...editedEvent!,
                        description: e.target.value,
                      })
                    }
                    className="w-full p-2 text-black"
                  />
                  <button
                    onClick={handleUpdate}
                    className="p-2 mt-2 bg-blue-500 rounded"
                  >
                    Guardar
                  </button>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-bold">{evento.name}</h3>
                  <p className="text-sm">{evento.description}</p>
                  <button
                    onClick={() => handleEdit(evento)}
                    className="p-2 mt-2 bg-yellow-500 rounded"
                  >
                    Editar
                  </button>
                  <DeleteEventos
                    id={evento.id ?? ""}
                    onPlanDeleted={handleEventDeleted}
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ListasEventos;
