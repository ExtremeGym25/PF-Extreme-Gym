"use client";
import ButtonPrimary from "@/app/components/buttons/buttonPrimary";
import { useAuth } from "@/app/contextos/contextoAuth";
import { routes } from "@/app/routes/routes";
import { getMyBookings } from "@/app/servicios/userevents";
import { IEvent, IReservas } from "@/app/tipos";
import { Link } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

const MisReservas = () => {
  const { isAuth } = useAuth();
  const [bookings, setBookings] = useState<IReservas[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMyBookings = useCallback(async () => {
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

      const data = await getMyBookings(token);
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
    fetchMyBookings();
  }, [fetchMyBookings]);

  return (
    <div className="max-w-4xl p-6 mx-auto">
      <h2 className="mb-6 text-2xl font-bold text-center">Mis Reservas</h2>

      {bookings?.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="flex flex-col items-center p-4 text-center bg-white border border-gray-300 rounded-lg shadow-md"
            >
              <h3 className="text-lg font-semibold capitalize">
                {booking?.event.name ?? "Evento sin nombre"}
              </h3>
              <p className="text-justify text-gray-600 capitalize">
                <strong> Descripcion:</strong>{" "}
                {booking?.event.description ?? "Evento sin nombre"}
              </p>
              <p className="text-gray-600">
                <strong> Fecha:</strong>{" "}
                {new Date(booking.event.date).toLocaleDateString()}
              </p>
              <p className="text-gray-600">
                <strong> Hora:</strong> {booking.event.time}
              </p>
              <p className="text-gray-600 capitalize">
                <strong>📍 Ubicación:</strong>{" "}
                {booking?.event.location ?? "No especificada"}
              </p>
              <p className="text-gray-600">
                <strong>👥 Personas:</strong> {booking?.numberOfPeople ?? 1}
              </p>

              <div className="flex gap-2 mt-4">
                <ButtonPrimary className="px-3 py-2">Modificar</ButtonPrimary>

                <ButtonPrimary className="px-3 py-2">Cancelar</ButtonPrimary>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No tienes reservas aún.</p>
      )}
    </div>
  );
};
export default MisReservas;
