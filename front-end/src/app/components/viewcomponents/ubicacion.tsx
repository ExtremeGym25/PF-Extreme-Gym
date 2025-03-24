"use client";

import React from "react";
import Map from "../map/Map";
import { motion } from "framer-motion";

const Ubicacion = () => {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1 }}
      >
        <div className="grid grid-cols-2 gap-4 py-4 md:px-16 md:grid-cols-2 ">
          <div className="flex flex-col justify-center transition-transform duration-300 ring-2 hover:scale-110 ring-gray-300">
            <h2 className="py-2 text-3xl font-bold text-center ">
              Nuestra ubicación
            </h2>
            <h3 className="text-center text-1xl ">
              Centro Comercial Andino Cra. 11 #82-71, Bogotá
            </h3>
          </div>
          <Map></Map>
        </div>
      </motion.div>
    </div>
  );
};

export default Ubicacion;
