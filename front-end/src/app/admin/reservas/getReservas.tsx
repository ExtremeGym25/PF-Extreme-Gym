"use client";
import ButtonPrimary from "@/app/components/buttons/buttonPrimary";
import { getBookings, getBookingsId } from "@/app/servicios/reservas";
import { IReservas } from "@/app/tipos";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import DeleteBookings from "./deleteBookings";

const GetReservasAdmin = () => {
  const [bookings, setBookings] = useState<IReservas[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchId, setSearchId] = useState("");
  const [searchedBooking, setSearchedBooking] = useState<IReservas | null>(
    null
  );
  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No has iniciado sesión");
        setError("No has iniciado sesión");
        setLoading(false);
        return;
      }

      const data = await getBookings(token);
      setBookings(data);
      console.log(data);
    } catch (error: any) {
      console.error("Error al obtener mis planes:", error);
      toast.error(error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleSearch = async () => {
    if (!searchId.trim()) {
      toast.error("Ingresa un ID de reserva");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No hay un token disponible.");
      }

      const reserva = await getBookingsId(token, searchId);
      setSearchedBooking(reserva);
      toast.success("Reserva encontrada");
      setSearchId("");
    } catch (error) {
      setSearchedBooking(null);
      toast.error("Reserva no encontrada");
    }
  };
  return (
    <div className="max-w-4xl p-6 mx-auto">
      <h2 className="mb-6 text-2xl font-bold text-center text-white">
        Reservas
      </h2>

      <div className="flex items-center gap-2 mb-6">
        <input
          type="text"
          placeholder="Ingrese ID de reserva"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="w-full p-2 text-black bg-white rounded"
        />
        {searchId && (
          <button
            onClick={handleSearch}
            className="px-4 py-2 text-white bg-blue-600 rounded"
          >
            Buscar
          </button>
        )}

        {searchedBooking && (
          <button
            onClick={() => {
              setSearchId("");
              setSearchedBooking(null);
            }}
            className="px-2 text-sm text-white bg-red-600 rounded"
          >
            Limpiar Filtro
          </button>
        )}
      </div>

      {searchedBooking && (
        <div className="w-full p-4 mb-6 text-white border rounded-lg shadow-md bg-azul2 border-verde">
          <p>
            <strong>Nombre Usuario:</strong> {searchedBooking.user.name}
          </p>
          <p>
            <strong>Numero Reserva:</strong> {searchedBooking.id}
          </p>
          <p>
            <strong>Fecha de Reserva:</strong>{" "}
            {new Date(searchedBooking.bookingsDate).toLocaleDateString()}
          </p>
          <p className="capitalize">
            <strong>Evento:</strong>{" "}
            {searchedBooking?.event.name ?? "Evento sin nombre"}
          </p>
          <p>
            <strong>Contacto Usuario:</strong> {searchedBooking.user.phone}
          </p>
          <p>
            <strong>Personas en la reserva:</strong>{" "}
            {searchedBooking.numberOfPeople}
          </p>
          <p>
            <strong>Estado Reserva:</strong>{" "}
            {searchedBooking.isCancelled ? "Cancelada" : "Activa"}
          </p>
        </div>
      )}

      {bookings.length > 0 ? (
        <div className="flex flex-col gap-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="flex flex-col items-center justify-between w-full p-4 text-white rounded-lg shadow-md md:flex-row bg-azul2"
            >
              <div className="flex flex-col">
                <p>
                  <strong>Nombre Usuario:</strong> {booking.user.name}
                </p>
                <p>
                  <strong>Numero Reserva:</strong> {booking.id}
                </p>
                <p>
                  <strong>Fecha de Reserva:</strong>{" "}
                  {new Date(booking.bookingsDate).toLocaleDateString()}
                </p>
                <p className="capitalize">
                  <strong>Evento:</strong>{" "}
                  {booking?.event.name ?? "Evento sin nombre"}
                </p>
                <p>
                  <strong>Contacto Usuario:</strong> {booking.user.phone}
                </p>
                <p>
                  <strong>Personas en la reserva:</strong>{" "}
                  {booking.numberOfPeople}
                </p>
                <p>
                  <strong>Estado Reserva:</strong>{" "}
                  {booking.isCancelled ? "Cancelada" : "Activa"}
                </p>
              </div>

              {/* {booking.isCancelled ? (
                <p className="font-bold text-red-500">🚨 Evento Cancelado</p>
              ) : (
                // <div className="flex gap-4">
                //   <button
                //     onClick={() => handleEdit(booking)}
                //     className="px-4 py-2 text-white bg-yellow-500 rounded"
                //   >
                //     Editar
                //   </button>
                //   <DeleteBookings
                //     id={booking.id}
                //     onSuccess={(updatedEvents) => setEventos(updatedEvents)}
                //   />
                // </div>
              )} */}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No tienes reservas aún.</p>
      )}
    </div>
  );
};

export default GetReservasAdmin;
