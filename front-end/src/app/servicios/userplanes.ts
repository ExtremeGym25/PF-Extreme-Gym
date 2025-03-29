"use server";
import axios from "axios";
import { IPlans } from "../tipos";

const axiosApiBack = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});
export const getPlanService = async (
  token: string,
  page: number = 1,
  limit: number = 10,
  categoria?: string
) => {
  try {
    const endpoint = categoria ? `/plans/${categoria}` : "/plans";

    const response = await axiosApiBack.get(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { page, limit },
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
