"use server";
import axios from "axios";
import { headers } from "next/headers";

const axiosApiBack = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const getDashboardAdmin = async () => {
  try {
    const response = await axiosApiBack.get("/dashboard/admin");
    return response.data;
  } catch (error) {
    console.error("Error a obtener estadisticas del dashboard", error);
    throw error;
  }
};

export default axiosApiBack;

export const getStats = async (token: string) => {
  try {
    const response = await axiosApiBack.get("/admin/stats", {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Respuesta de la API:", response.data);
    return response.data;
  } catch (error: any) {
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
