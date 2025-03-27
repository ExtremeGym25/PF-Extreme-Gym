/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import axios from "axios";


const axiosApiBack = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json"
    },
});

export const createEvent = async (eventData: any) => {
    try {
        const response = await axiosApiBack.post("/events", eventData);
        return response.data
    } catch (error) {
        console.error("Error al crear el evento:", error)
        throw error;        
    }
}
export const getEvents = async () => {
    try {
        const response = await axiosApiBack.get("/events");
        return response.data;
    } catch (error) {
        console.error("Error al obtener los eventos:", error);
        throw error;
    }
};

export default axiosApiBack