import { toast } from "react-toastify";
import ButtonPrimary from "../components/buttons/buttonPrimary";
import { reservaEventosService } from "../servicios/userevents";
import { useAuth } from "../contextos/contextoAuth";
import { useCallback, useEffect, useState } from "react";
import { getBookings } from "../servicios/reservas";
import { IReservas } from "../tipos";

const Reservar = ({ eventId }: { eventId?: string }) => {
  const { user } = useAuth();
  const [error, setError] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [reservaExitosa, setReservaExitosa] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOnSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No hay token disponible");
        toast.error("No has iniciado sesión");
        return;
      }
      const userId = user?.id ?? "";
      if (!userId) {
        toast.error("Error: No se encontró el usuario");
        return;
      }
      if (numberOfPeople < 1) {
        toast.error("Debes reservar al menos para una persona");
        return;
      }
      if (!eventId) {
        toast.error("No se encontró el evento");
        return;
      }

      const data = await reservaEventosService(
        token,
        eventId,
        userId,
        numberOfPeople
      );

      if (data) {
        toast.success("Reserva realizada con éxito");
        setMostrarModal(false);
        setReservaExitosa(true);
      } else {
        toast.error("Error al realizar la reserva");
      }
    } catch (error: any) {
      if (
        error.message.includes(
          "El usuario ya tiene una reserva para este evento"
        )
      ) {
        toast.error("Ya tienes una reserva para este evento.");
        setReservaExitosa(true);
      } else {
        toast.error(`Error: ${error.message}`);
      }
    }
  };

  return (
    <div>
      <ButtonPrimary
        onClick={() => setMostrarModal(true)}
        disabled={reservaExitosa}
      >
        {reservaExitosa ? "Reservado" : "Reservar"}
      </ButtonPrimary>

      {mostrarModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
            <button
              onClick={() => setMostrarModal(false)}
              className="absolute text-2xl text-gray-600 top-2 right-3 hover:text-black"
            >
              ✖
            </button>

            <h2 className="mb-4 text-xl font-bold text-center">
              ¿Para cuántas personas?
            </h2>

            <input
              type="number"
              value={numberOfPeople.toString()}
              onChange={(e) => setNumberOfPeople(Number(e.target.value) || 1)}
              min="1"
              className="w-full p-2 border rounded-md"
            />

            <ButtonPrimary onClick={handleOnSubmit} className="w-full mt-4">
              Confirmar Reserva
            </ButtonPrimary>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reservar;
