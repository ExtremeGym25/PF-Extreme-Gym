"use server";
import axios from "axios";
const axiosApiBack = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});
export const subscribeMonthly = async (userId: string) => {
  try {
    const response = await axiosApiBack.post(
      `/payments/subscribe/monthly/${userId}`
    );
    console.log(" Mensual:", response.data);

    return response.data.data.user;
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
export const subscribeYearly = async (userId: string) => {
  try {
    const response = await axiosApiBack.post(
      `payments/subscribe/yearly/${userId}`
    );
    console.log("Anual:", response.data);

    return response.data.user;
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
