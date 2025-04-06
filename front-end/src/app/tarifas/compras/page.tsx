"use client";
import { useRouter } from "next/navigation";
import ButtonPrimary from "../../components/buttons/buttonPrimary";
import { useAuth } from "../../contextos/contextoAuth";
import axios from "axios";
import { useState } from "react";
import {
  subscribeMonthly,
  subscribeYearly,
} from "@/app/servicios/pagosservice";
import { toast } from "react-toastify";

const Cart = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [error, setError] = useState("");

  const handlePurchase = async (type: "monthly" | "yearly") => {
    try {
      const userId = user?.id;
      if (!user?.id) {
        toast.error("Usuario no identificado");
        return;
      }

      if (type === "monthly") {
        await subscribeMonthly(user.id);
        toast.success("Suscripción mensual activada");
      } else {
        await subscribeYearly(user.id);
        toast.success("Suscripción anual activada");
      }

      router.push("/perfil");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="px-4 py-10 bg-fondo">
      <div className="max-w-6xl mx-auto">
        <h2 className="py-2 text-3xl font-bold text-center transition-transform duration-300 hover:scale-110">
          Escoge tu plan de suscripción
        </h2>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="overflow-hidden transition-transform duration-300 border-2 shadow-lg border-verde bg-fondo rounded-3xl hover:scale-105">
            <div className="p-6 text-white bg-gradient-to-r from-verde to-green-600">
              <h3 className="text-2xl font-semibold">Plan Mensual</h3>
              <p className="mt-1 text-sm">Acceso completo por 30 días</p>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-extrabold text-verde">$100</span>
                <span className="text-sm text-gray-500">por mes</span>
              </div>
              <ul className="mb-6 space-y-1 text-sm text-gray-600">
                <li className="flex items-center">
                  <span className="mr-2 text-verde">✔️</span>
                  <span>Acceso a todas las funciones</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-verde0">✔️</span>
                  <span>Cancelación en cualquier momento</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-verde">✔️</span>
                  <span>Soporte prioritario</span>
                </li>
              </ul>
              <ButtonPrimary
                onClick={() => handlePurchase("monthly")}
                className="w-full"
              >
                Comprar plan mensual
              </ButtonPrimary>
            </div>
          </div>

          <div className="overflow-hidden transition-transform duration-300 border-2 shadow-lg bg-fondo border-verde rounded-3xl hover:scale-105">
            <div className="p-6 text-white bg-gradient-to-r from-green-600 to-verde">
              <h3 className="text-2xl font-semibold">Plan Anual</h3>
              <p className="mt-1 text-sm">12 meses de acceso + 1 gratis</p>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-extrabold text-verde">
                  $1.100
                </span>
                <span className="text-sm text-gray-500">por año</span>
              </div>
              <ul className="mb-6 space-y-1 text-sm text-gray-600">
                <li className="flex items-center">
                  <span className="mr-2 text-verde">✔️</span>
                  <span>Acceso a todas las funciones</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-verde0">✔️</span>
                  <span>Cancelación en cualquier momento</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-verde">✔️</span>
                  <span>Soporte prioritario</span>
                </li>
              </ul>
              <ButtonPrimary
                onClick={() => handlePurchase("yearly")}
                className="w-full"
              >
                Comprar plan anual
              </ButtonPrimary>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Cart;
