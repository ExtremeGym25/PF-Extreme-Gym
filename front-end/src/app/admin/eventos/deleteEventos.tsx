import React from "react";
import { deleteEventoService } from "@/app/servicios/eventos";
import { useState } from "react";
import { toast } from "react-toastify";

interface DeleteEventosProps {
  id: string;
}

const DeleteEventos: React.FC<DeleteEventosProps> = ({ id }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    console.log("Intentando eliminar el evento con id:", id);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No hay token disponible");
        setLoading(false);
        return;
      }

      const success = await deleteEventoService(id, token);
      if (!success) {
        throw new Error("No se pudo eliminar el evento.");
      }

      toast.success("Evento cancelado");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error al eliminar el evento:", error);
      toast.error("Error al cancelar el evento");
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
