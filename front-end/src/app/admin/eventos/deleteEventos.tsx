"use client";
import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { deleteEventoService } from "@/app/servicios/eventos";

interface Props {
  id: string;
  onPlanDeleted: (id: string) => void; // Se pasa el ID eliminado
}

const DeleteEventos = ({ id, onPlanDeleted }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const handleDelete = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Debes iniciar sesión primero");
      return;
    }

    if (!id) {
      toast.error("ID inválido. No se puede eliminar el plan.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await deleteEventoService(id, token);
      console.log(deleteEventoService)
      toast.success("Plan eliminado correctamente");

      if (mountedRef.current) {
        setTimeout(() => {
          onPlanDeleted(id);
        }, 1000);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error desconocido";
      setError(
        errorMsg.includes("jwt")
          ? "Sesión expirada. Vuelve a iniciar sesión."
          : errorMsg
      );
      toast.error(errorMsg);
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  };

  return (
    <div>
      <button
        onClick={handleDelete}
        disabled={isLoading}
        className={`px-4 py-2 mt-4 text-sm transition rounded-md md:w-auto md:px-6 font-poppins text-white ring-2 ring-opacity-100 md:text-base ${
          isLoading
            ? "bg-red-800 cursor-not-allowed ring-red-900"
            : "bg-red-500 hover:bg-red-700 ring-red-900 hover:scale-110"
        }`}
      >
        {isLoading ? "Cancelando..." : "Cancalar"}
      </button>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default DeleteEventos;
