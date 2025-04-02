import { deleteEventoService } from "@/app/servicios/eventos";
import { IEvent } from "@/app/tipos";
import { useState } from "react";
import { toast } from "react-toastify";

interface DeleteEventosProps {
  id: string;
  onDelete: (id: string) => void;
}

const DeleteEventos: React.FC<DeleteEventosProps> = ({ id, onDelete }) => {
  const [eventos, setEventos] = useState<IEvent[]>([]);
  const [error, setError] = useState("");

  const handleEventDelete = async (id: string) => {
    console.log("Intentando eliminar el evento con id:", id);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No hay token disponible");
        return;
      }

      const success = await deleteEventoService(id, token);

      if (!success) {
        throw new Error("No se pudo eliminar el evento en la base de datos.");
      }

      setEventos((prevEventos) =>
        prevEventos.filter((evento) => evento.id !== id)
      );
      console.log("Evento eliminado con éxito:", id);
    } catch (error) {
      console.error("Error al eliminar el evento:", error);
      setError("Error al eliminar el evento.");
    }
  };

  return (
    <button
      onClick={() => {
        console.log("Botón de eliminar clickeado para ID:", id);
        onDelete(id);
      }}
      className="p-2 ml-2 text-white bg-red-500 rounded"
    >
      Cancelar
    </button>
  );
};

export default DeleteEventos;
