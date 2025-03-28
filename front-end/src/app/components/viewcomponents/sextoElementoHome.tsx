"use client";
import React from "react";

import { motion } from "framer-motion";
import ButtonPrimary from "../buttons/buttonPrimary";
import { useAuth } from "@/app/contextos/contextoAuth";
import Link from "next/link";

export const SextoElementoHome = () => {
  const { isAuth } = useAuth();

  if (isAuth === null) {
    return <div>Loading...</div>;
  }
  if (isAuth) {
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
    <div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1 }}
      >
        <div className="flex flex-col items-center justify-center pb-4 mx-auto space-x-4">
          <h2 className="text-3xl font-bold text-center transition-transform duration-300 hover:scale-110 ">
            ¿Estas Listo?
          </h2>
          <div>
            <Link href="/auth/registro">
              <ButtonPrimary>Regístrate</ButtonPrimary>
            </Link>{" "}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
export default SextoElementoHome;
