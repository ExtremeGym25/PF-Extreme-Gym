import { deleteEventoService, getEvents } from "@/app/servicios/eventos";
import { toast } from "react-toastify";
import { useState } from "react";

interface DeleteEventosProps {
  id: string;
  onSuccess?: (updatedEvents: any[]) => void;
}

const DeleteEventos: React.FC<DeleteEventosProps> = ({ id, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    console.log("Intentando eliminar el evento con id:", id);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No hay token disponible");
        return;
      }

      const success = await deleteEventoService(id, token);
      if (!success) {
        throw new Error("No se pudo eliminar el evento.");
      }

      toast.success("Evento Cancelado ");

      const updatedEvents = await getEvents(token);
      onSuccess?.(updatedEvents);
      console.error("Error al eliminar el evento:", Error);
      toast.error("Error al cancelar el evento ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="p-2 ml-2 text-white bg-red-500 rounded"
      disabled={loading}
    >
      {loading ? "Cancelando..." : "Cancelar"}
    </button>
  );
};

export default DeleteEventos;
