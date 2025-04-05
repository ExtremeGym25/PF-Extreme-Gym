"use client";

import React from "react";
import { motion } from "framer-motion";

const CuartoElementoHome = () => {
  return (
    <div>
      <div className="text-center">
        <h2 className="py-2 text-3xl font-bold transition-transform duration-300 hover:scale-110">
          ¿Porque entrenar con nosostros?
        </h2>
      </div>
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1 }}
      >
        <div className="grid grid-cols-2 gap-4 px-4 pb-10 md:grid-cols-5 md:px-8 ">
          <div className="flex flex-col items-center justify-center p-4 transition-transform duration-300 border rounded-lg shadow border-verde hover:scale-110">
            <div className="flex items-center h-40">
              <img
                src="https://res.cloudinary.com/dixcrmeue/image/upload/v1743870277/home1_vob5wv.png"
                alt="imagenhome1"
                className="object-cover w-full h-full pb-2"
              />
            </div>
            <h3 className="pb-2 font-bold text-center ">
              Entrenamiento Integral en un Solo Lugar
            </h3>
            <p className="text-sm text-justify">
              Combina lo mejor del fitness convencional con deportes extremos
              como escalada, triatlón y ciclismo de montaña. ¡Nunca más
              necesitarás múltiples plataformas para entrenar!
            </p>
            <p></p>
          </div>
          <div className="flex flex-col items-center justify-center p-4 transition-transform duration-300 border rounded-lg shadow border-verde hover:scale-110">
            <div className="flex items-center h-40">
              <img
                src="https://res.cloudinary.com/dixcrmeue/image/upload/v1743870102/home2_vqvtp2.png"
                alt="Imagen 2 home 2"
                className="object-cover w-full h-full pb-2"
              />
            </div>
            <h3 className="pb-2 font-bold text-center">
              Planes Personalizados y Desafiantes
            </h3>
            <p className="text-sm text-justify">
              Recibe rutinas adaptadas a tus objetivos personales, ya sea
              mejorar tu resistencia, ganar masa muscular o prepararte para
              deportes extremos.
            </p>
            <p></p>
          </div>
          <div className="flex flex-col items-center justify-center p-4 transition-transform duration-300 border rounded-lg shadow border-verde hover:scale-110">
            <div className="flex items-center h-40">
              <img
                src="https://res.cloudinary.com/dixcrmeue/image/upload/v1743871139/home_3_3_lbve7r.png"
                alt="imagen home 3"
                className="object-cover w-full h-full pb-2"
              />
            </div>
            <h3 className="pb-2 font-bold text-center">
              Comunidad de Apasionados
            </h3>
            <p className="text-sm text-justify">
              Conéctate con otros entusiastas del fitness y deportes extremos,
              comparte logros y encuentra compañeros de entrenamiento que te
              motiven a dar lo mejor de ti.
            </p>
            <p></p>
          </div>
          <div className="flex flex-col items-center justify-center p-4 transition-transform duration-300 border rounded-lg shadow border-verde hover:scale-110">
            <img
              src="https://res.cloudinary.com/dixcrmeue/image/upload/v1743870808/Home_3_2_n1slul.png"
              alt="imagen home 4"
              className="h-40 pb-0"
            />
            <h3 className="pt-0 pb-2 font-bold text-center ">
              Acceso a Clases Exclusivas y Eventos Extremos
            </h3>
            <p className="text-sm text-justify">
              Reserva clases de deportes intensos o sesiones de entrenamiento
              personalizadas con los mejores instructores y participa en eventos
              especiales.
            </p>
            <p></p>
          </div>
          <div className="flex flex-col items-center justify-center p-4 transition-transform duration-300 border rounded-lg shadow border-verde hover:scale-110">
            <div className="flex items-center h-40">
              <img
                src="https://res.cloudinary.com/dixcrmeue/image/upload/v1743871004/home_4_rb1boz.png"
                alt="imagen home 5"
                className="object-cover w-full h-full pb-2"
              />
            </div>
            <h3 className="pb-2 font-bold text-center">
              Soporte en Tiempo Real y Asistencia Personalizada
            </h3>
            <p className="text-sm text-justify">
              Chatea con nosotros para resolver dudas o recibir consejos.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CuartoElementoHome;
