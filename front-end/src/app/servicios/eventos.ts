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
export const deleteEventoService = async (id: string, token: string | null) => {
  if (!token) {
    console.error(" No hay token disponible. No se puede eliminar el evento.");
    return;
  }

  console.log(" Llamando al servicio de eliminación con ID:", id);

  try {
    const response = await axios.delete(`http://localhost:3000/events/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Respuesta del servidor:", response);
    return response;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Error desde el backend:", error.response.data);
      return { error: error.response.data.message };
    }
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
    console.error(" Error en Cloudinary:", errorMessage); // Solo el mensaje
    throw new Error(errorMessage);
  }
};
