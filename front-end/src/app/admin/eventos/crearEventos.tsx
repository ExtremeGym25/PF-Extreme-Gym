"use client";
import React, { useState, useRef } from "react";
import { createEvent, imagenEventService } from "../../servicios/eventos";
import { toast } from "react-toastify";

const Eventos = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    longitude: "",
    latitude: "",
    date: "",
    time: "",
    capacity: "",
    category: "",
    file: null as File | null,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: { target: { name: any; value: any } }) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        file,
      }));
    }
    if (!file) {
      toast.error("Por favor, selecciona un archivo.");
      return;
    }

    const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Formato no válido. Usa JPG, PNG o WEBP.");
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("El archivo es demasiado grande. Máximo 5MB.");
      return;
    }

    setFormData({ ...formData, file });
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (typeof window === "undefined") {
      console.error("localStorage no está disponible");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No se encontró el token en localStorage");
      toast.error("Debe iniciar sesión para crear un evento");
      toast.error("Debe iniciar sesión para crear un evento");
      return;
    }

    const decoded = JSON.parse(atob(token.split(".")[1]));
    const userId = decoded.id;

    const eventData = {
      ...formData,
      capacity: Number(formData.capacity),
      userId,
      latitude: parseFloat(formData.latitude) || 0,
      longitude: parseFloat(formData.longitude) || 0,
    };
    console.log("Category seleccionada:", formData.category);

    try {
      const evento = await createEvent(eventData, token);
      if (!evento?.id) {
        throw new Error("Error al crear la rutina");
      }
      if (formData.file) {
        await imagenEventService(formData.file, evento.id, token);
      }
      console.log("Evento creado exitosamente - Toast debería mostrarse");

      toast.success("Evento creado exitosamente");
      setFormData({
        name: "",
        description: "",
        location: "",
        longitude: "",
        latitude: "",
        date: "",
        time: "",
        capacity: "",
        category: "",
        file: null as File | null,
      });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error: any) {
      if (error.response) {
        console.error("Error del backend:", error.response.data);
      } else {
        console.error("Error en la solicitud:", error.message);
      }
      toast.error(error.message);
    }
  };

  return (
    <div className="flex w-full p-4 bg-fondo">
      <div className="w-full max-w-4xl mx-auto">
        <h2 className="my-6 text-2xl font-bold text-center text-foreground md:text-4xl">
          Crear Evento
        </h2>
        <div className="p-6 shadow-md bg- rounded-xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <input
                type="text"
                name="name"
                placeholder="Nombre"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 text-black bg-white rounded"
                required
              />
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full p-2 text-black bg-white rounded"
                required
              />
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full p-2 text-black bg-white rounded"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <input
                type="text"
                name="location"
                placeholder="Ubicación del Evento"
                value={formData.location}
                onChange={handleChange}
                className="p-2 text-black bg-white rounded"
                required
              />{" "}
              <input
                type="number"
                name="latitude"
                placeholder="Ingresa la latitud de la ubicacion"
                value={formData.latitude}
                onChange={handleChange}
                className="p-2 text-black bg-white rounded"
                required
                step="any"
              />
              <input
                type="number"
                name="longitude"
                placeholder="Ingresa la longitud de la ubicacion"
                value={formData.longitude}
                onChange={handleChange}
                className="p-2 text-black bg-white rounded"
                required
                step="any"
              />
              <input
                type="number"
                name="capacity"
                placeholder="Capacidad de Personas"
                value={formData.capacity}
                onChange={handleChange}
                className="p-2 text-black bg-white rounded"
                required
              />
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="p-2 text-black bg-white rounded"
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
              className="p-2 text-black bg-white rounded"
              required
            />
            <input
              type="file"
              name="imageUrl"
              ref={fileInputRef}
              className="w-full p-2 text-black rounded bg-blanco"
              onChange={handleFileChange}
            />

            <button
              type="submit"
              className="w-full px-4 py-2 mt-4 text-sm transition rounded-md md:w-auto md:px-6 font-poppins bg-fondo text-foreground hover:bg-verde hover:scale-110 ring-2 ring-gray-300 ring-opacity-100 md:text-base"
            >
              Crear Evento
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Eventos;
