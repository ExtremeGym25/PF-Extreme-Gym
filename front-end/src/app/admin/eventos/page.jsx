"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { createEvent, getEvents } from "../../servicios/eventos";

const Eventos = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    date: "",
    time: "",
    capacity: "",
  });

  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    const fetchEventos = async () => {
      const data = await getEvents();
      setEventos(data);
    };
    fetchEventos();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const eventData = { ...formData, capacity: Number(formData.capacity) };

    try {
      await createEvent(eventData);
      alert("Evento creado exitosamente");
      setFormData({
        name: "",
        description: "",
        location: "",
        date: "",
        time: "",
        capacity: "",
      });
    } catch (error) {
      alert("Hubo un error al crear el evento");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0D1F2D]">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <h2 className="my-6 text-4xl font-bold text-center text-white">
          Crear Evento
        </h2>
        <div className="p-6 mx-auto mt-6 shadow-md bg-azul2 rounded-xl w-max">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-3">
              <input
                type="text"
                name="name"
                placeholder="Nombre"
                value={formData.name}
                onChange={handleChange}
                className="w-full col-span-2 p-2 text-black rounded bg-blanco"
                required
              />
              <div className="grid grid-cols-2 col-span-1 gap-3">
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full p-2 text-black rounded bg-blanco"
                  required
                />
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full p-2 text-black rounded bg-blanco"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                name="location"
                placeholder="Ubicación del Evento"
                value={formData.location}
                onChange={handleChange}
                className="p-2 text-black rounded bg-blanco"
                required
              />
              <input
                type="number"
                name="capacity"
                placeholder="Capacidad de Personas"
                value={formData.capacity}
                onChange={handleChange}
                className="p-2 text-black rounded bg-blanco"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <textarea
                name="description"
                placeholder="Descripción"
                value={formData.description}
                onChange={handleChange}
                className="p-2 text-black rounded bg-blanco"
                required
              />
              <div className="flex flex-col justify-center">
                <label className="block mb-2 text-blanco">Subir Imagen</label>
                <input
                  type="file"
                  name="image"
                  className="p-2 rounded bg-blanco"
                />
              </div>
            </div>
            <button
              type="submit"
              className="p-2 mx-auto font-bold text-black rounded bg-verde w-80 hover:bg-green-600 hover:text-blanco"
            >
              Crear Evento
            </button>
          </form>
        </div>
        <h2 className="my-6 text-4xl font-bold text-center text-white">
          Evento Creados
        </h2>
        <div className="flex flex-col items-center gap-4">
          {eventos.map((evento) => (
            <div
              key={evento.id}
              className="p-4 text-black rounded-lg shadow-md bg-azul2 w-max"
            >
              <div className="grid grid-cols-5 grid-rows-1 gap-4">
                <div className="col-span-2 text-lg font-bold text-blanco">
                  {evento.name}
                </div>
                <div className="text-naranja">
                  {new Date(evento.date).toLocaleDateString()} - {evento.time}
                </div>
                <div className="col-start-4">
                  <button className="px-4 py-2 text-white rounded bg-naranja">
                    Actualizar
                  </button>
                </div>
                <div className="col-start-5">
                  <button className="px-4 py-2 text-white bg-red-500 rounded">
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Eventos;
