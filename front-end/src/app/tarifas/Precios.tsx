"use client";

import { toast } from "react-toastify";
import { useAuth } from "@/app/contextos/contextoAuth";
import ButtonPrimary from "@/app/components/buttons/buttonPrimary";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
const axiosApiBack = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

const Precios = () => {
  const { user } = useAuth();
  const [error, setError] = useState("");

  const searchParams = useSearchParams();
  const canceled = searchParams.get("canceled");

  useEffect(() => {
    if (canceled === "true") {
      toast.info("Suscripción cancelada.");
    }
  }, [canceled]);

  const redirectToCheckout = async (type: "monthly" | "yearly") => {
    if (!user) {
      toast.error("Inicia sesión para hacer la compra");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No hay token disponible");
        return;
      }

      const priceId =
        type === "monthly"
          ? "price_1R9IJi2LBi4exdRbAqcijuNx"
          : "price_1R9IJi2LBi4exdRbgq4lADW5";

      const response = await axiosApiBack.post(
        "/stripe/create-checkout-session",
        {
          customerId: user.stripeCustomerId,
          priceId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { checkoutUrl } = response.data;

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        toast.error("No se pudo generar la URL de pago.");
      }
    } catch (error: any) {
      console.error(error);
      toast.error("Error al generar la suscripción.");
    }
  };

  return (
    <div className="px-4 py-10 bg-fondo">
      <div className="max-w-6xl mx-auto">
        <h2 className="py-2 text-3xl font-bold text-center transition-transform duration-300 hover:scale-110">
          Escoge tu plan de suscripción
        </h2>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Plan mensual */}
          <div className="overflow-hidden transition-transform duration-300 border-2 shadow-lg border-verde bg-fondo rounded-3xl hover:scale-105">
            <div className="p-6 text-white bg-gradient-to-r from-verde to-green-600">
              <h3 className="text-2xl font-semibold">Plan Mensual</h3>
              <p className="mt-1 text-sm">Acceso completo por 30 días</p>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-extrabold text-verde">
                  $9.99
                </span>
                <span className="text-sm text-gray-500">por mes</span>
              </div>
              <ul className="mb-6 space-y-1 text-sm text-gray-600">
                <li className="flex items-center">
                  <span className="mr-2 text-verde">✔️</span>
                  <span>Acceso a todas las funciones</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-verde">✔️</span>
                  <span>Cancelación en cualquier momento</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-verde">✔️</span>
                  <span>Soporte prioritario</span>
                </li>
              </ul>
              <ButtonPrimary onClick={() => redirectToCheckout("monthly")}>
                Comprar plan mensual
              </ButtonPrimary>
            </div>
          </div>

          {/* Plan anual */}
          <div className="overflow-hidden transition-transform duration-300 border-2 shadow-lg bg-fondo border-verde rounded-3xl hover:scale-105">
            <div className="p-6 text-white bg-gradient-to-r from-green-600 to-verde">
              <h3 className="text-2xl font-semibold">Plan Anual</h3>
              <p className="mt-1 text-sm">12 meses de acceso + 1 gratis</p>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-extrabold text-verde">
                  $99.99
                </span>
                <span className="text-sm text-gray-500">por año</span>
              </div>
              <ul className="mb-6 space-y-1 text-sm text-gray-600">
                <li className="flex items-center">
                  <span className="mr-2 text-verde">✔️</span>
                  <span>Acceso a todas las funciones</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-verde">✔️</span>
                  <span>Cancelación en cualquier momento</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-verde">✔️</span>
                  <span>Soporte prioritario</span>
                </li>
              </ul>
              <ButtonPrimary onClick={() => redirectToCheckout("yearly")}>
                Comprar plan anual
              </ButtonPrimary>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Precios;
