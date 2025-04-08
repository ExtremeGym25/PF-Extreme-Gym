"use server";
import axios from "axios";
const axiosApiBack = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});
type CheckoutResponse = {
  checkoutUrl: string;
};
export const StripeService = async (
  planType: "monthly" | "yearly",
  customerId: string,
  token: string
): Promise<CheckoutResponse> => {
  try {
    const response = await axiosApiBack.post(
      "/stripe/checkout",
      { planType, customerId },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.checkoutUrl;
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
