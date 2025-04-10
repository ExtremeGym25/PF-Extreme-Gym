import React, { useState } from "react";
import { useAuth } from "../contextos/contextoAuth";
import { deleteUserService } from "../servicios/auth";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { routes } from "../routes/routes";

const DeleteUsuario = () => {
  const { user, resetUserData } = useAuth();
  const [error, setError] = useState("");

  const router = useRouter();

  const handleDeleteUser = async () => {
    if (!user?.id) {
      toast.error("No hay usuario autenticado.");
      return;
    }

    if (!window.confirm("¿Estás seguro de que deseas eliminar tu cuenta?"))
      return;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No hay token disponible");
        return;
      }
      await deleteUserService(user.id, token);
      toast.success("Cuenta eliminada correctamente.");

      resetUserData();

      setTimeout(() => {
        router.push(routes.registro);
      }, 1000);
    } catch (error: any) {
      console.error("Error al eliminar usuario:", error);
      toast.error(error.message);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <h2 className="text-lg font-bold text-center ">
        No queremos que te vayas. Habla con nosotros.
      </h2>
      <button
        onClick={handleDeleteUser}
        className="p-2 mt-2 font-bold border-gray-300 rounded shadow-md bg-azul1 text-blanco hover:bg-verde"
      >
        Eliminar mi cuenta
      </button>
    </div>
  );
};

export default DeleteUsuario;
