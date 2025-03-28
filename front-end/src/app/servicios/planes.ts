"use server";
import axios from "axios";
import { IPlans } from "../tipos";
interface ErrorResponse {
  message?: string;
}

const axiosApiBack = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});
export const createPlanService = async (planData: IPlans, token: string) => {
  try {
    const plan = await axiosApiBack.post("/plans/create", planData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log("Respuesta creación planes rutinas:", plan);
    return plan.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
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
export const deletePlanService = async (id: string, token: string) => {
  try {
    const response = await axios.delete(`http://localhost:3000/plans/${id}`, {
      headers: {
        Authorization: `Bearer ${token.trim()}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error completo:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Error al eliminar");
  }
};
