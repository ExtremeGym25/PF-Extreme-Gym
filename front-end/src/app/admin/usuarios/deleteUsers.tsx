import React from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import { deleteUserService } from "../../servicios/auth";

interface DeleteUsersProps {
  id: string;
}
const DeleteUsers: React.FC<DeleteUsersProps> = ({ id }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    console.log("Intentando eliminar el usuario con id:", id);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No hay token disponible");
        setLoading(false);
        return;
      }

      const success = await deleteUserService(id, token);
      if (!success) {
        throw new Error("No se pudo eliminar al usuario.");
      }

      toast.success("Usuario Eliminado Exitosamente");
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
      {loading ? "Desactivando..." : "Desactivar"}
    </button>
  );
};

export default DeleteUsers;
