"use server";
import axios from "axios";
import { IUser } from "../tipos";

const axiosApiBack = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const loginService = async (userData: {
  email: string;
  password: string;
}) => {
  try {
    const user = await axiosApiBack.post("AQUI VA RUTA", userData);
    console.log("user en servicio", user.data);

    return user.data;
  } catch (error) {
    console.log("Error al Login", error);
    throw Error("Error_LogIn");
  }
};

export const registerService = async (userData: Partial<IUser>) => {
  try {
    await axiosApiBack.post("AQUI VARUTA", userData);
    return "Registro exitoso";
  } catch (error) {
    console.log("Error al registrarse", error);
    throw Error("Error_Register");
  }
};
