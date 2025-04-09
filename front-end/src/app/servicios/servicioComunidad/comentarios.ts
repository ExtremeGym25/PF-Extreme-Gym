"use server";
import { IComment } from "@/app/tipos";
import axios from "axios";

const axiosApiBack = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const getCommentsByPublicationId = async (publicationId: string) => {
  try {
    const response = await axiosApiBack.get(
      `/comments/publication/${publicationId}`,
      {}
    );
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

export const createComment = async (
  commentData: { content: string; publicationId: string },
  token: string
) => {
  try {
    const response = await axiosApiBack.post(`/comments`, commentData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
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
export const updateComment = async (
  id: string,
  content: string,
  token: string
) => {
  try {
    const response = await axiosApiBack.put(
      `/comments/${id}`,
      { content },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
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
export const deleteComments = async (id: string, token: string) => {
  try {
    const response = await axiosApiBack.delete(`/comments/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
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
