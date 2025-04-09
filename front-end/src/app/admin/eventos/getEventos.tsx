"use client";

import React, { useEffect, useState } from "react";
import { IEvent } from "@/app/tipos";
import { getEvents, updateEventRequest } from "@/app/servicios/eventos";
import { useMemo } from "react";
import DeleteEventos from "./deleteEventos";
import { useCallback } from "react";
import { toast } from "react-toastify";
import MapaEventos from "@/app/components/map/MapEventos";

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
    setEditedEvent({
      ...evento,
      latitude: evento.latitude ? parseFloat(evento.latitude as any) : 0,
      longitude: evento.longitude ? parseFloat(evento.longitude as any) : 0,
    });
  };

  const handleUpdate = async () => {
    if (!editedEvent) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No hay token disponible");
        return;
      }
      const updatedEvent = {
        ...editedEvent,
        latitude: parseFloat(editedEvent.latitude as any) || 0,
        longitude: parseFloat(editedEvent.longitude as any) || 0,
      };
      const response = await updateEventRequest(
        updatedEvent,
        token,
        editedEvent.id
      );
      setEventos((prev) =>
        prev.map((evt) => (evt.id === editedEvent.id ? editedEvent : evt))
      );
      setEditingId(null);
      console.log(response, "respuesta");
      toast.success("Evento Editado");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error: any) {
      console.error("Error en updateEvent:", error);
      toast.error(error.message);
      setError("Error al actualizar el evento");
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  };

  return (
    <div className="max-w-6xl p-6 mx-auto text-foreground">
      <h2 className="my-6 text-2xl font-bold text-center md:text-4xl">
        Listado de Eventos
      </h2>

      <div className="flex flex-col gap-4 mb-6 md:flex-row">
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="w-full p-3 border border-gray-600 rounded text-foreground bg-fondo md:w-auto"
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
        <p className="text-lg text-center text-gray-300">Cargando...</p>
      ) : error ? (
        <p className="text-lg text-center text-red-500">{error}</p>
      ) : eventosFiltrados.length > 0 ? (
        <ul className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
          {eventosFiltrados.map((evento) => (
            <li
              key={evento.id}
              className="p-6 transition-transform shadow-lg bg-fondo rounded-xl hover:scale-105"
            >
              {editingId === evento.id ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editedEvent?.name || ""}
                    onChange={(e) =>
                      setEditedEvent({ ...editedEvent!, name: e.target.value })
                    }
                    className="w-full p-2 bg-white rounded text-foreground"
                  />
                  <textarea
                    value={editedEvent?.description || ""}
                    onChange={(e) =>
                      setEditedEvent({
                        ...editedEvent!,
                        description: e.target.value,
                      })
                    }
                    className="w-full p-2 bg-white rounded text-foreground"
                  />
                  <input
                    type="number"
                    value={editedEvent?.capacity || ""}
                    onChange={(e) =>
                      setEditedEvent({
                        ...editedEvent!,
                        capacity: e.target.value
                          ? parseInt(e.target.value, 10)
                          : 0,
                      })
                    }
                    className="w-full p-2 bg-white rounded text-foreground"
                  />
                  <input
                    type="text"
                    value={editedEvent?.location || ""}
                    onChange={(e) =>
                      setEditedEvent({
                        ...editedEvent!,
                        location: e.target.value,
                      })
                    }
                    className="w-full p-2 bg-white rounded text-foreground"
                  />
                  <input
                    type="number"
                    value={editedEvent?.longitude || ""}
                    onChange={(e) =>
                      setEditedEvent({
                        ...editedEvent!,
                        longitude: e.target.value
                          ? parseFloat(e.target.value)
                          : 0,
                      })
                    }
                    className="w-full p-2 bg-white rounded text-foreground"
                    step="any"
                  />
                  <input
                    type="number"
                    value={editedEvent?.latitude || ""}
                    onChange={(e) =>
                      setEditedEvent({
                        ...editedEvent!,
                        latitude: e.target.value
                          ? parseFloat(e.target.value)
                          : 0,
                      })
                    }
                    className="w-full p-2 bg-white rounded text-foreground"
                    step="any"
                  />
                  <input
                    type="date"
                    value={
                      editedEvent?.date
                        ? new Date(editedEvent.date).toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      setEditedEvent({
                        ...editedEvent!,
                        date: e.target.value
                          ? new Date(e.target.value)
                          : evento.date,
                      })
                    }
                    className="w-full p-2 bg-white rounded text-foreground"
                  />
                  <input
                    type="time"
                    value={editedEvent?.time || ""}
                    onChange={(e) =>
                      setEditedEvent({ ...editedEvent!, time: e.target.value })
                    }
                    className="w-full p-2 bg-white rounded text-foreground"
                  />
                  <div className="flex gap-4">
                    <button
                      onClick={handleUpdate}
                      className="w-full p-2 text-white rounded-lg bg-verde"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="w-full p-2 text-white bg-red-600 rounded-lg"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col">
                  <div className="flex flex-col gap-6 md:flex-row">
                    <div className="w-full md:w-1/2">
                      <img
                        className="object-cover w-full rounded-md h-80"
                        src={
                          evento.imageUrl ||
                          "https://res.cloudinary.com/dixcrmeue/image/upload/v1743014544/xTREME_GYM_1_ivgi8t.png"
                        }
                        alt="Imagen del evento"
                      />
                    </div>
                    <div className="w-full space-y-3 md:w-1/2">
                      <h3 className="text-xl font-semibold">{evento.name}</h3>
                      <p className="text-foreground">{evento.description}</p>
                      <p className="text-foreground">
                        Capacidad: {evento.capacity}
                      </p>
                      <p className="text-foreground">
                        Lugar: {evento.location}
                      </p>
                      <p className="text-foreground">
                        Latitud: {evento.latitude}
                      </p>
                      <p className="text-foreground">
                        Longitud: {evento.longitude}
                      </p>
                      <p className="text-foreground">
                        Fecha: {new Date(evento.date).toLocaleDateString()}
                      </p>
                      <p className="text-foreground">Hora: {evento.time}</p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <MapaEventos
                      latitude={+evento.latitude}
                      longitude={+evento.longitude}
                    />
                  </div>
                  {evento.isCancelled ? (
                    <p className="mt-2 text-lg font-bold text-center text-red-500">
                      🚨 Evento Cancelado
                    </p>
                  ) : (
                    <div className="flex flex-col gap-2 mt-4 md:flex-row">
                      <button
                        onClick={() => handleEdit(evento)}
                        className="w-full p-2 text-white rounded-lg bg-verde"
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
        <p className="text-lg text-center text-gray-400">
          No hay eventos disponibles.
        </p>
      )}
    </div>
  );
};
export default ListasEventos;
