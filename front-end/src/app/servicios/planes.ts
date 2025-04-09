"use server";
import axios from "axios";
import { IPlans } from "../tipos";
interface ErrorResponse {
  message?: string;
}

const axiosApiBack = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});
export const createPlanService = async (planData: FormData, token: string) => {
  try {
    const plan = await axiosApiBack.post("/plans", planData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log("Respuesta creación planes rutinas:", plan);
    return plan.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Error desde el backend:", error.response.data);
      throw new Error(error.response.data.message || "Error desconocido");
    } else if (axios.isAxiosError(error) && error.request) {
      console.error("No hubo respuesta del servidor:", error.request);
      throw new Error("No hubo respuesta del servidor");
    } else {
      console.error("Error inesperado:", (error as Error).message);
      throw new Error((error as Error).message || "Error desconocido");
    }
  }
};
export const getPlanService = async (
  token: string,
  page: number = 1,
  limit: number = 10,
  categoria?: string
) => {
  try {
    const params: Record<string, string | number> = { page, limit };
    if (categoria) {
      params.categoria = categoria;
    }

    const response = await axiosApiBack.get("/plans", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    });

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error de Axios:",
        error.response?.data.message || error.message
      );
      throw new Error(error.response?.data?.message || "Error desconocido");
    } else {
      console.error("Error desconocido:", error);
      throw new Error("Ocurrió un error inesperado");
    }
  }
};
export const updatePlanService = async (
  token: string,
  id: string,
  dto: IPlans
) => {
  try {
    if (!token) {
      throw new Error("No se proporcionó un token.");
    }

    let decoded;
    try {
      decoded = JSON.parse(atob(token.split(".")[1]));
      console.log("Token decodificado:", decoded);
    } catch (error) {
      throw new Error("Token inválido o mal formado.");
    }

    if (!decoded.isAdmin) {
      throw new Error("El usuario no tiene permisos de administrador.");
    }

    if (!dto || Object.keys(dto).length === 0) {
      throw new Error("El objeto de datos (dto) está vacío.");
    }

    const response = await axiosApiBack.put(`/plans/${id}`, dto, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(response.data, "respuesta servicio");
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error de Axios:",
        error.response?.data.message || error.message
      );
      throw new Error(error.response?.data?.message || "Error desconocido");
    } else {
      console.error("Error desconocido:", error);
      throw new Error("Ocurrió un error inesperado");
    }
  }
};
export const deletePlanService = async (id: string, token: string) => {
  try {
    console.log("Token de autenticación:", token);
    const response = await axiosApiBack.delete(`/plans/${id}`, {
      headers: {
        Authorization: `Bearer ${token.trim()}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error de Axios:",
        error.response?.data.message || error.message
      );
      throw new Error(error.response?.data?.message || "Error desconocido");
    } else {
      console.error("Error desconocido:", error);
      throw new Error("Ocurrió un error inesperado");
    }
  }
};
export const imagePlanService = async (
  file: File,
  planId: string,
  token: string
) => {
  if (!file) {
    console.error(" Error: No se recibió un archivo para subir.");
    throw new Error("No se recibió un archivo válido.");
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const imagenPlan = await axiosApiBack.post(
      `/plans/upload-image/${planId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(" Imagen subida con éxito:", imagenPlan.data.imageUrl);
    return imagenPlan.data;
  } catch (error) {
    let errorMessage = "Error desconocido";
    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message || error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error(" Error en Cloudinary:", errorMessage);
    throw new Error(errorMessage);
  }
};
