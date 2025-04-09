"use client";
import {
  getBookings,
  getBookingsId,
  updateBookingService,
} from "@/app/servicios/reservas";
import { IReservas } from "@/app/tipos";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import CancelarBookings from "./cancelarBookings";

const GetReservasAdmin = () => {
  const [bookings, setBookings] = useState<IReservas[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchId, setSearchId] = useState("");
  const [searchedBooking, setSearchedBooking] = useState<IReservas | null>(
    null
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedBooking, setEditedBooking] = useState<IReservas | null>(null);
  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError("");
    console.log("bookings:", bookings);

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
    } catch (error: any) {
      setSearchedBooking(null);
      toast.error(error.message);
    }
  };
  const handleEdit = (booking: IReservas) => {
    console.log("Editando reserva:", booking.id);
    setEditingId(booking.id);

    setEditedBooking({ ...booking });
  };
  const handleUpdate = async () => {
    if (!editedBooking) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No hay token disponible");
        return;
      }
      const payload = {
        ...editedBooking,
        userId: editedBooking.userId,
      };

      const response = await updateBookingService(
        token,
        editedBooking.id,
        editedBooking.userId,
        editedBooking.numberOfPeople ?? 1
      );
      setBookings((prev) =>
        prev.map((evt) => (evt.id === editedBooking.id ? editedBooking : evt))
      );
      setEditingId(null);
      console.log(response, "respuesta");
    } catch (err) {
      console.error("Error en updateEvent:", err);
      setError("Error al actualizar el evento");
    }
  };
  return (
    <div className="max-w-4xl p-6 mx-auto">
      <h2 className="my-6 text-2xl font-bold text-center text-foreground md:text-4xl">
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
            className="px-4 py-2 text-white bg-verde"
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
        <div className="w-full p-4 mb-6 border rounded-lg shadow-md text-foreground bg-fondo border-verde">
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

      <div className="flex flex-col gap-4">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="flex items-center justify-between w-full p-4 rounded-lg shadow-md text-foreground bg-fondo"
          >
            <div className="flex flex-col">
              <h3 className="text-lg font-bold capitalize">
                {booking.event.name}
              </h3>
              <p>
                <strong>Usuario:</strong> {booking.user.name}
              </p>
              <p>
                <strong>Fecha:</strong>{" "}
                {new Date(booking.bookingsDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Estado:</strong>{" "}
                {booking.isCancelled ? "Cancelada" : "Activa"}
              </p>
            </div>

            <div className="flex items-center gap-4">
              {editingId === booking.id ? (
                <>
                  <input
                    type="number"
                    value={editedBooking?.numberOfPeople || ""}
                    onChange={(e) =>
                      setEditedBooking({
                        ...editedBooking!,
                        numberOfPeople: Number(e.target.value),
                      })
                    }
                    className="w-20 p-2 text-black rounded"
                  />
                  <button
                    onClick={handleUpdate}
                    className="p-2 text-white bg-green-500 rounded"
                  >
                    Guardar
                  </button>
                </>
              ) : (
                <>
                  <p className="text-sm">
                    <strong>Personas:</strong> {booking.numberOfPeople}
                  </p>
                  <button
                    onClick={() => handleEdit(booking)}
                    className="p-2 text-white rounded bg-verde"
                  >
                    Editar
                  </button>
                </>
              )}
              {booking.isCancelled ? (
                <p className="font-bold text-red-500">Reserva Cancelada</p>
              ) : (
                <div className="flex gap-4">
                  <CancelarBookings id={booking.id} />
                </div>
              )}{" "}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default GetReservasAdmin;
