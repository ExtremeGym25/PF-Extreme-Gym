"use server";
import axios from "axios";
import { IEvent } from "../tipos";

const axiosApiBack = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
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
export const getEvents = async (token: string) => {
  try {
    const response = await axiosApiBack.get("/events", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
export const updateEventRequest = async (
  editedEvent: IEvent,
  token: string,
  id: string
) => {
  try {
    const response = await axiosApiBack.put(`/events/${id}`, editedEvent, {
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
export const deleteEventoService = async (
  id: string,
  token: string | null
): Promise<boolean> => {
  if (!token) {
    console.error("No hay token disponible. No se puede eliminar el evento.");
    return false;
  }

  console.log("Llamando al servicio de eliminación con ID:", id);

  try {
    const response = await axiosApiBack.delete(`/events/${id}`, {
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
export const imagenEventService = async (
  file: File,
  eventId: string,
  token: string
) => {
  if (!file) {
    console.error(" Error: No se recibió un archivo para subir.");
    throw new Error("No se recibió un archivo válido.");
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const imagenEvent = await axiosApiBack.patch(
      `/events/${eventId}/upload-image`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(" Imagen subida con éxito:", imagenEvent.data.imageUrl);
    return imagenEvent.data;
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
