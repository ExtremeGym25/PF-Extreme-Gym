"use client"
import React, { useState, useEffect } from 'react';
import Sidebar from "../components/Sidebar";
import Header from '../components/Header';
import { createEvent, getEvents } from '../../servicios/eventos'

const Eventos = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    date: '',
    time: '',
    capacity: ''
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
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(typeof window === "undefined") {
      console.error("localStorage no esta disponible");
      return;
    }

    const token = localStorage.getItem('token');
    if(!token){
      console.error("no se encontro el token en localStorage");
      alert("debe iniciar sesion para crear un evento")
    }
    const decoded = JSON.parse(atob(token.split('.')[1]))
    const userId = decoded.id
    
    const eventData = { ...formData, capacity: Number(formData.capacity), userId: userId }

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
      if(error.response) {
        console.error("error del backend:", error.response.data)
      } else {
        console.error("Error en la solicitud:", error.message)
      }
      alert("Hubo un error al crear el evento");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0D1F2D]">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <h2 className="text-center text-white text-4xl my-6 font-bold">Crear Evento</h2>
        <div className="bg-azul2 p-6 rounded-xl shadow-md w-max mx-auto mt-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className='grid grid-cols-3 gap-3'>
              <input 
                type="text" 
                name="name" 
                placeholder="Nombre" 
                value={formData.name} 
                onChange={handleChange} 
                className="col-span-2 w-full p-2 rounded bg-blanco text-black" 
                required 
              />
              <div className='col-span-1 grid grid-cols-2 gap-3'>
                <input 
                  type="date" 
                  name="date" 
                  value={formData.date} 
                  onChange={handleChange} 
                  className="w-full p-2 rounded bg-blanco text-black" 
                  required 
                />
                <input 
                  type="time" 
                  name="time" 
                  value={formData.time} 
                  onChange={handleChange} 
                  className="w-full p-2 rounded bg-blanco text-black" 
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
                className="p-2 rounded bg-blanco text-black" 
                required 
              />
              <input 
                type="number" 
                name="capacity" 
                placeholder="Capacidad de Personas" 
                value={formData.capacity} 
                onChange={handleChange} 
                className="p-2 rounded bg-blanco text-black" 
                required 
              />
              <select 
                name="category" 
                value={formData.category} 
                onChange={handleChange} 
                className="p-2 rounded bg-blanco text-black" 
                required
              >
                <option value="">Seleccione una categoría</option>
                <option value="Deportes Aéreos (Paracaidismo, Parapente, BASE Jumping)">Deportes Aéreos</option>
                <option value="Deportes Acuáticos (Surf, Kitesurf, Rafting en aguas bravas)">Deportes Acuáticos</option>
                <option value="Deportes de Montaña (Escalada en roca, Esquí Alpino, Snowboarding)">Deportes de Montaña</option>
                <option value="Deportes de Motor (Motocross, Rally, Carreras de velocidad)">Deportes de Motor</option>
                <option value="Deportes de Aventura (Puenting, Ciclismo de montaña, Senderismo extremo)">Deportes de Aventura</option>
                <option value="Deportes de Invierno (Esquí extremo, Snowboard extremo, Escalada en hielo)">Deportes de Invierno</option>
              </select>

            </div>

            <div className="grid grid-cols-2 gap-3">
              <textarea 
                name="description" 
                placeholder="Descripción" 
                value={formData.description} 
                onChange={handleChange} 
                className="p-2 rounded bg-blanco text-black" 
                required 
              />
              <div className='flex flex-col justify-center'>
                <label className="block mb-2 text-blanco">Subir Imagen</label>
                <input 
                  type="file"   
                  name='image' 
                  className='p-2 rounded bg-blanco' />
              </div>
            </div>
            <button 
              type="submit" 
              className="bg-verde p-2 rounded text-black font-bold w-80 mx-auto hover:bg-green-600 hover:text-blanco">
              Crear Evento
            </button>
          </form>
        </div>
        <h2 className="text-center text-white text-4xl my-6 font-bold">Evento Creados</h2>
        <div className="flex flex-col items-center gap-4">
          {eventos.map((evento) => (
            <div key={evento.id} className="bg-azul2 p-4 rounded-lg shadow-md w-max text-black">
            <div className="grid grid-cols-5 grid-rows-1 gap-4">
              <div className="col-span-2 font-bold text-lg text-blanco">{evento.name}</div>
              <div className="text-naranja">{new Date(evento.date).toLocaleDateString()} - {evento.time}</div>
              <div className="col-start-4">
                <button className="bg-naranja text-white px-4 py-2 rounded">Actualizar</button>
              </div>
              <div className="col-start-5">
                <button className="bg-red-500 text-white px-4 py-2 rounded">Cancelar</button>
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

