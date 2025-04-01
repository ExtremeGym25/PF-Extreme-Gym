/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import axios from "axios";
import { IEvent } from "../tipos";

const axiosApiBack = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const createEvent = async (eventData: any, token: string) => {
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
export const getEvents = async (token: string) => {
  try {
    const response = await axiosApiBack.get("/events", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
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
export const updateEventRequest = async (
  editedEvent: IEvent,
  token: string,
  id: string
) => {
  try {
    const response = await axios.put(
      `http://localhost:3000/events/${id}`,
      editedEvent,
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
    console.error("Error en updatePlanService:", error);

    throw new Error(
      error.response?.data?.message || "Error al actualizar el plan."
    );
  }
};
export const deleteEventoService = async (id: string, token: string) => {
  try {
    console.log("Token de autenticación:", token);
    const response = await axios.delete(`http://localhost:3000/events/${id}`, {
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
