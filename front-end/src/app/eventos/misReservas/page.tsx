"use client";
import CancelarBookings from "@/app/admin/reservas/cancelarBookings";
import ButtonPrimary from "@/app/components/buttons/buttonPrimary";
import { useAuth } from "@/app/contextos/contextoAuth";
import { routes } from "@/app/routes/routes";
import { updateBookingService } from "@/app/servicios/reservas";
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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedBooking, setEditedBooking] = useState<IReservas | null>(null);
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
      <h2 className="mb-6 text-3xl font-bold text-center text-foreground">
        Mis Reservas
      </h2>

      {bookings.length > 0 ? (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="flex items-center justify-between p-4 border border-gray-700 rounded-lg shadow-lg bg-fondo"
            >
              <img
                src={
                  booking.event.imageUrl ||
                  "https://res.cloudinary.com/dixcrmeue/image/upload/v1743014544/xTREME_GYM_2_tjw1rv.png"
                }
                alt={booking.event.name}
                className="object-cover w-24 h-24 rounded-lg"
              />

              <div className="flex-1 ml-4">
                <h3 className="text-lg font-bold capitalize">
                  {booking.event.name}
                </h3>
                <p className="text-foreground">
                  <strong>Fecha:</strong>{" "}
                  {new Date(booking.bookingsDate).toLocaleDateString()}
                </p>
                <p
                  className={`font-semibold ${
                    booking.isCancelled ? "text-red-500" : "text-verde"
                  }`}
                >
                  <strong>Estado:</strong>{" "}
                  {booking.isCancelled ? "Cancelada" : "Activa"}
                </p>
              </div>

              <div className="flex flex-col items-center gap-4 sm:flex-row">
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
                      className="w-20 p-2 rounded text-foreground"
                    />
                    <ButtonPrimary onClick={handleUpdate} className="p-2">
                      Guardar
                    </ButtonPrimary>
                  </>
                ) : (
                  <>
                    <p className="text-sm">
                      <strong>Personas:</strong> {booking.numberOfPeople}
                    </p>
                    <ButtonPrimary
                      onClick={() => handleEdit(booking)}
                      className="p-2 "
                    >
                      Editar
                    </ButtonPrimary>
                  </>
                )}
                {!booking.isCancelled && <CancelarBookings id={booking.id} />}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-6 text-center text-gray-400">
          No tienes reservas aún.
        </p>
      )}
    </div>
  );
};
export default MisReservas;
