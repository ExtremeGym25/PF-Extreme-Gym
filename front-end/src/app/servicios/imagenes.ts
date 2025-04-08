"use server";

import axios from "axios";

const axiosApiBack = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const imageService = async (
  formData: FormData,
  token: string | null
) => {
  try {
    const imagenPlan = await axiosApiBack.post(`/upload/file`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Imagen subida con éxito:", imagenPlan.data);
    return imagenPlan.data;
  } catch (error) {
    let errorMessage = "Error desconocido";
    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message || error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error("Error en Cloudinary:", errorMessage);
    throw new Error(errorMessage);
  }
};
