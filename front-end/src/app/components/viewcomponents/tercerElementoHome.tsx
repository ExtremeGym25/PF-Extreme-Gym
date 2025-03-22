"use client";
import React from "react";
import ButtonPrimary from "../buttons/buttonPrimary";
import { motion } from "framer-motion";

const TercerElementoHome = () => {
  return (
    <div>
      {" "}
      <motion.div
        initial={{ opacity: 0, x: +50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1 }}
      >
        <div className="flex flex-col items-center justify-center pb-4 mx-auto space-x-4">
          <h2 className="text-3xl font-bold text-center transition-transform duration-300 hover:scale-110 ">
            ¿Estas Listo?
          </h2>
          <p className="text-gray-600 transition-transform duration-300 hover:scale-110">
            ¡Forma parte de nuestra familia!
          </p>
          <div>
            <ButtonPrimary> Registrate</ButtonPrimary>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TercerElementoHome;
