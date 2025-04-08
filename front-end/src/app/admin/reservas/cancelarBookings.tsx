import React from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import { cancelarBookingsService } from "@/app/servicios/reservas";

interface CancelarBookingsProps {
  id: string;
}
const CancelarBookings: React.FC<CancelarBookingsProps> = ({ id }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    console.log("Intentando eliminar la reserva con id:", id);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No hay token disponible");
        setLoading(false);
        return;
      }

      const success = await cancelarBookingsService(id, token);
      if (!success) {
        throw new Error("No se pudo eliminar el evento.");
      }

      toast.success("Reserva Cancelada Exitosamente");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error: any) {
      console.error("Error al cancelar reserva:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="p-2 ml-1 text-white bg-red-500 rounded"
      disabled={loading}
    >
      {loading ? "Cancelando..." : "Cancelar"}
    </button>
  );
};

export default CancelarBookings;
