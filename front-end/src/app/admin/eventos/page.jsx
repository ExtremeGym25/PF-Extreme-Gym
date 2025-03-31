"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { createEvent } from "../../servicios/eventos";

const Eventos = () => {
  const [formData, setFormData] = useState({
    name: "Hola",
    description: "como estas",
    location: "bien y tu",
    date: "",
    time: "",
    capacity: "",
    category: "",
  });

  const [eventos, setEventos] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (typeof window === "undefined") {
      console.error("localStorage no está disponible");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No se encontró el token en localStorage");
      alert("Debe iniciar sesión para crear un evento");
      return;
    }

    const decoded = JSON.parse(atob(token.split(".")[1]));
    const userId = decoded.id;

    const eventData = {
      ...formData,
      capacity: Number(formData.capacity),
      userId,
    };
    console.log("Category seleccionada:", formData.category);

    try {
      await createEvent(eventData, token); // Aquí pasas el token como segundo parámetro
      alert("Evento creado exitosamente");
      setFormData({
        name: "",
        description: "",
        location: "",
        date: "",
        time: "",
        capacity: "",
        category: "",
      });
    } catch (error) {
      if (error.response) {
        console.error("Error del backend:", error.response.data);
      } else {
        console.error("Error en la solicitud:", error.message);
      }
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

            <div className="grid grid-cols-3 gap-3">
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
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="p-2 text-black rounded bg-blanco"
                required
              >
                <option value="">Seleccione una categoría</option>
                <option value="Deportes Aéreos">Deportes Aéreos</option>
                <option value="Deportes Acuáticos">Deportes Acuáticos</option>
                <option value="Deportes de Montaña">Deportes de Montaña</option>
                <option value="Deportes de Motor">Deportes de Motor</option>
                <option value="Deportes de Aventura">
                  Deportes de Aventura
                </option>
                <option value="Deportes de Invierno">
                  Deportes de Invierno
                </option>
              </select>
            </div>

            <textarea
              name="description"
              placeholder="Descripción"
              value={formData.description}
              onChange={handleChange}
              className="p-2 text-black rounded bg-blanco"
              required
            />

            <button
              type="submit"
              className="p-2 mx-auto font-bold text-black rounded bg-verde w-80 hover:bg-green-600 hover:text-blanco"
            >
              Crear Evento
            </button>
          </form>
        </div>
        <h2 className="my-6 text-4xl font-bold text-center text-white">
          Eventos Creados
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
                <button className="px-4 py-2 text-white rounded bg-naranja">
                  Actualizar
                </button>
                <button className="px-4 py-2 text-white bg-red-500 rounded">
                  Cancelar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Eventos;
