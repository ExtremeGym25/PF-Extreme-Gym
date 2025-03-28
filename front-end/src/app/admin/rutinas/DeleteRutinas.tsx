import React, { useState, useEffect } from "react";
import { deletePlanService } from "../../servicios/planes";
import { toast } from "react-toastify";

interface Props {
  id: string;
  onPlanDeleted: () => void;
}

const DeleteRutinas = ({ id, onPlanDeleted }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Obtener el token solo cuando el componente se monta
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    } else {
      toast.error("No hay token disponible");
    }
  }, []);

  const handleDelete = async () => {
    if (!token) {
      toast.error("Debes iniciar sesión primero");
      return;
    }

    if (!window.confirm("¿Estás seguro de eliminar este plan?")) return;

    setIsLoading(true);
    setError(null);

    try {
      await deletePlanService(id, token);
      toast.success("Plan eliminado correctamente");
      onPlanDeleted();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error desconocido";
      setError(
        errorMsg.includes("jwt")
          ? "Sesión expirada. Vuelve a iniciar sesión."
          : errorMsg
      );
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={handleDelete}
        disabled={isLoading || !token}
        className={`px-3 py-1 text-sm text-white rounded ${
          !token
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-red-500 hover:bg-red-700"
        } disabled:opacity-50`}
      >
        {isLoading ? "Eliminando..." : "Eliminar"}
      </button>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default DeleteRutinas;
