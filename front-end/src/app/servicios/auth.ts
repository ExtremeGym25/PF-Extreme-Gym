/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import axios from "axios";
import { IUserLogin, IUser } from "../tipos";
interface ErrorResponse {
  message?: string;
}

const axiosApiBack = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const loginService = async (userData: Partial<IUserLogin>) => {
  try {
    const user = await axiosApiBack.post("/auth/signin", userData);
    console.log("Respuesta completa del login:", user);
    console.log("user en servicio", user.data);

    return user.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error de Axios:",
        error.response?.data.message || error.message
      );
      throw new Error(error.response?.data?.message || "Error desconocido");
    }
  }
};

export const registerService = async (userData: Partial<IUser>) => {
  try {
    await axiosApiBack.post("/auth/signup", userData);
    return "Registro exitoso";
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data as ErrorResponse;
      console.log("Error al registrarse", errorData?.message || error.message);
      throw new Error(errorData?.message || "Error_Register");
    } else {
      console.log("Error desconocido", error);
      throw new Error("Error_Register");
    }
  }
};

export const updateUser = async (
  userId: string,
  formData: Partial<IUser>,
  token: string
) => {
  try {
    console.log("Sending Data:", JSON.stringify(formData, null, 2));
    console.log("UserID:", userId);

    const response = await axiosApiBack.patch(`/users/${userId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log(response, "respuesta ");
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
export const uploadProfileImageService = async (
  file: File,
  id: string,
  token: string
): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("userId", id);

  try {
    const response = await axiosApiBack.patch("/users/profile", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
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
export const deleteUserService = async (userId: string, token: string) => {
  try {
    const response = await axiosApiBack.delete(`/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
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
