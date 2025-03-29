import React, { useEffect, useState } from "react";
import { assignPlanService } from "../servicios/userplanes";
import { toast } from "react-toastify";
import { GrFavorite } from "react-icons/gr";

const AssignFavoritos = ({ planId }: { planId?: string }) => {
  if (!planId) return null;
  console.log("planId enviado:", planId);

  const [isFavorite, setIsFavorite] = useState(false);

  const [error, setError] = useState("");

  const handleOnSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No hay token disponible");
        toast.error("No has iniciado sesión");
        return;
      }

      const data = await assignPlanService(token, planId);

      if (data) {
        setIsFavorite(true);
        toast.success("Guardado en Favoritos");
      } else {
        toast.error("Error al guardar en Favoritos");
      }
      console.log("Datos de la API recibidos:", data);
    } catch (error: any) {
      console.error("Error al asignar plan:", error);
      const errorMessage =
        error.message || "Ocurrió un error al asignar el plan";
      toast.error(`Error: ${errorMessage}`);
    }
  };

  return (
    <div>
      <GrFavorite
        onClick={handleOnSubmit}
        className={`w-6 h-6 transition-colors duration-300 ${
          isFavorite ? "text-red-500" : "text-gray-500"
        }`}
      />
    </div>
  );
};
export default AssignFavoritos;
