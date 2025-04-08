// "use client";

// import React, { useState } from "react";
// import { useRouter } from "next/navigation";
// import { toast } from "react-toastify";
// import { useAuth } from "../contextos/contextoAuth";
// import { loadStripe } from "@stripe/stripe-js";
// import {
//   Elements,
//   CardElement,
//   useStripe,
//   useElements,
// } from "@stripe/react-stripe-js";
// import axios from "axios";

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

// const CheckoutForm = ({ planId }: { planId: string }) => {
//   const stripe = useStripe();
//   const elements = useElements();
//   const router = useRouter();
//   const { user } = useAuth();
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!stripe || !elements) return;

//     const cardElement = elements.getElement(CardElement);
//     if (!cardElement) return;

//     const token = localStorage.getItem("token");
//     if (!token) {
//       toast.error("No has iniciado sesión");
//       return;
//     }

//     const customerId = user?.stripeCustomerId;
//     if (!customerId) {
//       toast.error("No se encontró tu ID de cliente en Stripe");
//       return;
//     }

//     setLoading(true);
//     try {
//       const { paymentMethod, error } = await stripe.createPaymentMethod({
//         type: "card",
//         card: cardElement,
//       });

//       if (error || !paymentMethod) {
//         toast.error(error?.message || "Error creando método de pago");
//         return;
//       }

//       const res = await axios.post(
//         "http://localhost:300/stripe/subscribe",
//         {
//           customerId,
//           planId,
//           paymentMethodId: paymentMethod.id, // 👈 Aquí se lo mandas al backend
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       toast.success("¡Suscripción exitosa!");
//       router.push("/perfil");
//     } catch (err: any) {
//       toast.error(err?.response?.data?.error || "Error al suscribirte");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="mt-4 space-y-4">
//       <CardElement />
//       <button
//         type="submit"
//         disabled={loading}
//         className="px-4 py-2 text-white rounded bg-verde hover:bg-green-600"
//       >
//         {loading ? "Procesando..." : "Confirmar pago"}
//       </button>
//     </form>
//   );
// };

// const Precios = () => {
//   const [planSeleccionado, setPlanSeleccionado] = useState<string | null>(null);

//   return (
//     <div className="px-4 py-4">
//       <h2 className="text-3xl font-bold text-center">Nuestros Precios</h2>
//       <div className="grid gap-6 md:grid-cols-2">
//         {/* Plan mensual */}
//         <div className="p-6 border shadow rounded-xl bg-fondo border-verde">
//           <h3 className="text-2xl font-bold text-center text-verde">
//             Tarifa Mensual
//           </h3>
//           <p className="mt-2 text-sm text-justify">
//             Accede a todas las categorías y deportes extremos.
//           </p>
//           <div className="mt-6 text-center">
//             <span className="text-3xl font-extrabold text-verde">$100</span>
//             <p className="text-sm text-gray-500">por mes</p>
//           </div>
//           <button
//             onClick={() =>
//               setPlanSeleccionado("price_1R9IJi2LBi4exdRbAqcijuNx")
//             }
//             className="w-full px-4 py-2 mt-4 text-white rounded bg-verde hover:bg-green-600"
//           >
//             Seleccionar
//           </button>
//         </div>

//         {/* Plan anual */}
//         <div className="p-6 border shadow rounded-xl bg-fondo border-verde">
//           <h3 className="text-2xl font-bold text-center text-verde">
//             Tarifa Anual
//           </h3>
//           <p className="mt-2 text-sm text-justify">
//             Incluye acceso total por 12 meses y eventos especiales.
//           </p>
//           <div className="mt-6 text-center">
//             <span className="text-3xl font-extrabold text-verde">$1.100</span>
//             <p className="text-sm text-gray-500">por año</p>
//           </div>
//           <button
//             onClick={() =>
//               setPlanSeleccionado("price_1R9IJi2LBi4exdRbgq4lADW5")
//             }
//             className="w-full px-4 py-2 mt-4 text-white rounded bg-verde hover:bg-green-600"
//           >
//             Seleccionar
//           </button>
//         </div>
//       </div>

//       {/* Módulo de pago */}
//       {planSeleccionado && (
//         <div className="mt-6">
//           <h3 className="text-xl font-semibold text-center">
//             Completa el pago para tu plan
//           </h3>
//           <Elements stripe={stripePromise}>
//             <CheckoutForm planId={planSeleccionado} />
//           </Elements>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Precios;
