"use client";
import CancelarBookings from "@/app/admin/reservas/cancelarBookings";
import ButtonPrimary from "@/app/components/buttons/buttonPrimary";
import MapaEventos from "@/app/components/map/MapEventos";
import { useAuth } from "@/app/contextos/contextoAuth";
import { routes } from "@/app/routes/routes";
import { updateBookingService } from "@/app/servicios/reservas";
import { getMyBookings } from "@/app/servicios/userevents";
import { IEvent, IReservas } from "@/app/tipos";
import { Link } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const MisReservas = () => {
  const { isAuth, user } = useAuth();
  const router = useRouter();

  const isFree = user?.subscriptionType === "free";
  const isPremium = user?.subscriptionType === "premium";
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
      console.error("Error al obtener mis rutinas:", error);
      toast.error("No tienes reservas");
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
      toast.success("Reserva Modificada");
      setEditingId(null);
      console.log(response, "respuesta");
    } catch (error: any) {
      console.error("Error en updateEvent:", error);
      toast.error("Error al modificar reserva");

      setError("Error al actualizar el reserva");
    }
  };
  return (
    <div className="max-w-4xl p-6 pt-8 mx-auto font-poppins">
      {isPremium && (
        <div>
          <h2 className="mb-6 text-3xl font-bold text-center text-foreground">
            Mis Reservas
          </h2>

          {bookings.length > 0 ? (
            <div className="grid gap-6">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 border rounded-lg shadow-lg border-verde bg-fondo"
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
                    <p>
                      <strong>Descripción:</strong> {booking.event.description}
                    </p>
                    <p>
                      <strong>Locación:</strong> {booking.event.location}
                    </p>
                    <p
                      className={` ${
                        booking.isCancelled ? "text-red-500" : "text-verde"
                      }`}
                    >
                      <strong>Estado:</strong>{" "}
                      {booking.isCancelled ? "Cancelada" : "Activa"}
                    </p>
                    <div className="mt-1">
                      <MapaEventos
                        latitude={+booking.event.latitude}
                        longitude={+booking.event.longitude}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-4 sm:flex-row">
                    {editingId === booking.id ? (
                      <>
                        <input
                          type="number"
                          className="w-20 p-2 bg-white border rounded text-foreground"
                          value={editedBooking?.numberOfPeople || ""}
                          onChange={(e) =>
                            setEditedBooking({
                              ...editedBooking!,
                              numberOfPeople: Number(e.target.value),
                            })
                          }
                        />

                        <button
                          onClick={handleUpdate}
                          className="px-2 py-2 text-sm transition rounded-md md:w-auto md:px-6 font-poppins bg-fondo text-foreground hover:bg-verde hover:scale-110 ring-2 ring-gray-300 ring-opacity-100 md:text-base"
                        >
                          Editar{" "}
                        </button>
                      </>
                    ) : (
                      <>
                        <p className="text-sm">
                          <strong>Personas:</strong> {booking.numberOfPeople}
                        </p>
                        <button
                          onClick={() => handleEdit(booking)}
                          className="py-2 text-sm transition rounded-md x-2 md:w-auto md:px-6 font-poppins bg-fondo text-foreground hover:bg-verde hover:scale-110 ring-2 ring-gray-300 ring-opacity-100 md:text-base"
                        >
                          Guardar
                        </button>
                      </>
                    )}
                    {!booking.isCancelled && (
                      <CancelarBookings id={booking.id} />
                    )}
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
      )}{" "}
      {isFree && (
        <div className="flex flex-col items-center justify-center w-full min-h-screen">
          <h2 className="mb-4 text-3xl font-bold text-center transition-transform duration-300 hover:scale-110 md:text-2xl">
            No tienes acceso mira nuestras tarifas
          </h2>
          <button
            onClick={() => router.push("/tarifas")}
            className="px-6 py-2 text-sm transition rounded-md text-foreground font-poppins bg-fondo hover:bg-verde hover:scale-110 ring-2 ring-gray-300 ring-opacity-100"
          >
            Ver Tarifas
          </button>
        </div>
      )}
    </div>
  );
};
export default MisReservas;
