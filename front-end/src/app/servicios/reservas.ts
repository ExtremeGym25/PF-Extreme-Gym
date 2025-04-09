"use server";
import axios from "axios";
import { IReservas } from "../tipos";

const axiosApiBack = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const getBookings = async (token: string) => {
  try {
    const response = await axiosApiBack.get("/bookings", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Respuesta de la APIbookiimg:", response.data);
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
export const getBookingsId = async (token: string, searchId: string) => {
  try {
    const response = await axiosApiBack.get(`/bookings/${searchId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Respuesta de la API:", response.data);
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
export const cancelarBookingsService = async (
  id: string,
  token: string | null
): Promise<boolean> => {
  if (!token) {
    console.error("No hay token disponible. No se puede eliminar el evento.");
    return false;
  }

  console.log("Llamando al servicio de eliminación con ID:", id);

  try {
    const response = await axiosApiBack.delete(`/bookings/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Respuesta del servidor:", response.data);
    return response.status === 200;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Error desde el backend:", error.response.data);
    }
    return false;
  }
};
export const updateBookingService = async (
  token: string,
  id: string,
  userId: string,
  numberOfPeople: number
) => {
  try {
    const response = await axiosApiBack.put(
      `/bookings/${id}`,
      { numberOfPeople, userId },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(response.data, "respuesta servicio");
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
