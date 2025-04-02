import React, { useState } from "react";
import ButtonPrimary from "../components/buttons/buttonPrimary";
import { toast } from "react-toastify";
import { useAuth } from "../contextos/contextoAuth";
import { reservaEventosService } from "../servicios/userevents";

const Reservar = ({ eventoId }: { eventoId?: string }) => {
  const { user } = useAuth();
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [numberOfPeople, setnumberOfPeople] = useState(1);

  const handleReservarClick = () => {
    setShowForm(true);
  };

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
      if (!eventoId) {
        toast.error("No se encontró el evento");
        return;
      }
      const eventId = String(eventoId);
      const data = await reservaEventosService(
        token,
        eventId,
        userId,
        numberOfPeople
      );
      if (data) {
        toast.success("Reserva realizada con éxito");
        setShowForm(false);
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
      } else {
        toast.error(`Error: ${error.message}`);
      }
    }
  };

  return (
    <div>
      {!showForm ? (
        <ButtonPrimary onClick={handleReservarClick}>Reservar</ButtonPrimary>
      ) : (
        <div className="p-4 bg-gray-100 border rounded shadow-md">
          <p className="mb-2 font-semibold">
            ¿Para cuántas personas deseas reservar?
          </p>
          <input
            type="number"
            min="1"
            value={numberOfPeople}
            onChange={(e) => setnumberOfPeople(Number(e.target.value))}
            className="w-full p-2 mb-2 border rounded"
          />
          <ButtonPrimary onClick={handleOnSubmit}>
            Confirmar Reserva
          </ButtonPrimary>
        </div>
      )}
    </div>
  );
};

export default Reservar;
