"use client";
import { useAuth } from "@/app/contextos/contextoAuth";
import React from "react";
import ButtonPrimary from "../buttons/buttonPrimary";
import { motion } from "framer-motion";
import Link from "next/link";

const TercerElementoHome = () => {
  const { user } = useAuth();

  const isFree = user?.subscriptionType === "free";
  const isPremium = user?.subscriptionType === "premium";
  if (isPremium) {
    return (
      <div className="px-4">
        <motion.div
          initial={{ opacity: 0, x: +50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1 }}
        >
          <div className="flex flex-col items-center justify-center pb-4 mx-auto space-y-1 text-center md:space-y-2 lg:space-y-4">
            <h2 className="text-2xl font-bold transition-transform duration-300 md:text-4xl lg:text-5xl hover:scale-110">
              ¿Estás Listo?
            </h2>
            <p className="text-base text-gray-600 transition-transform duration-300 md:text-lg lg:text-xl hover:scale-110">
              ¡Mira nuestras rutinas!
            </p>
            <Link href="/planesRutinas">
              <ButtonPrimary>Rutinas</ButtonPrimary>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="px-4">
      <motion.div
        initial={{ opacity: 0, x: +50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1 }}
      >
        <div className="flex flex-col items-center justify-center pb-4 mx-auto space-y-1 text-center md:space-y-2 lg:space-y-4">
          <h2 className="text-2xl font-bold transition-transform duration-300 md:text-4xl lg:text-5xl hover:scale-110">
            ¿Estás Listo?
          </h2>
          <p className="text-base text-gray-600 transition-transform duration-300 md:text-lg lg:text-xl hover:scale-110">
            ¡Forma parte de nuestra familia!
          </p>
          <Link href="/tarifas">
            <ButtonPrimary>Mira nuestras tarifas</ButtonPrimary>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default TercerElementoHome;
