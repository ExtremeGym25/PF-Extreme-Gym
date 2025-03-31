/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import axios from "axios";

const axiosApiBack = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const createEvent = async (eventData: FormData, token: string) => {
  try {
    const response = await axiosApiBack.post("/events", eventData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type":
          eventData instanceof FormData
            ? "multipart/form-data"
            : "application/json",
      },
    });
    console.log(response.data);
    return response.data;
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
// export const getEvents = async () => {
//   try {
//     const response = await axiosApiBack.get("/events");
//     return response.data;
//   } catch (error) {
//     console.error("Error al obtener los eventos:", error);
//     throw error;
//   }
// };
