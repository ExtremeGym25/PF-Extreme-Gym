"use server";
import axios from "axios";

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
