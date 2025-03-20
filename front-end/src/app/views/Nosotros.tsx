"use client";
import React from "react";
import { GrCaretNext } from "react-icons/gr";
import { FaRegClock } from "react-icons/fa";
import { FaPhone } from "react-icons/fa6";
import Map from "../components/map/Map";
import { motion } from "framer-motion";
import TrainersCarousel from "../components/viewcomponents/trainers";

const Nosotros = () => {
  return (
    <div className="font-poppins bg-fondo">
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="py-4">
          <h2 className="text-3xl font-bold text-center transition-transform duration-300 hover:scale-110">
            Nuestra Historia
          </h2>
          <p className="px-16 py-4 text-lg text-justify ">
            {" "}
            Todo comenzó con un grupo de amigos apasionados por el deporte y la
            aventura. Cada uno tenía su propio estilo: algunos eran amantes del
            gimnasio tradicional, otros disfrutaban de escalar montañas, correr
            maratones o lanzarse en bicicleta por rutas extremas. Pero había
            algo en lo que todos coincidían: la dificultad de encontrar un lugar
            que combinara todas esas experiencias. <br />
            <br />
            Después de años entrenando en gimnasios convencionales y viajando a
            distintos lugares para practicar deportes extremos, surgió la idea:
            <br />
            ¿Por qué no crear un espacio donde el fitness y la adrenalina se
            encuentren? Así nació Xtreme Gym : un concepto innovador que reúne
            lo mejor de ambos mundos en un solo lugar. Un centro integral donde
            cualquiera puede entrenar de manera convencional y, al mismo tiempo,
            prepararse para desafíos extremos. <br />
            <br />
            El propósito era claro: romper con la rutina monótona y ofrecer una
            experiencia completa y motivadora. Además, querían que el espíritu
            de comunidad fuera el corazón del proyecto, un lugar donde los
            deportistas se apoyen mutuamente y compartan experiencias únicas.{" "}
            <br />
            <br />
            Con esfuerzo, dedicación y el apoyo de una comunidad creciente de
            deportistas apasionados, Extreme Gym & Sports se convirtió en mucho
            más que un gimnasio: es un estilo de vida para aquellos que buscan
            superar sus límites, tanto dentro como fuera del gimnasio.
          </p>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1 }}
      >
        <div className="grid grid-cols-2 gap-4 py-4 md:px-16 md:grid-cols-2">
          <div className="flex flex-col justify-center">
            <h2 className="py-2 text-3xl font-bold text-center transition-transform duration-300 hover:scale-110">
              Nuestra ubicacion
            </h2>
            <h3 className="text-center transition-transform duration-300 text-1xl hover:scale-110">
              Centro Comercial Andino Cra. 11 #82-71, Bogotá
            </h3>
          </div>
          <Map></Map>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1 }}
        className="flex-col"
      >
        <TrainersCarousel />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1 }}
      >
        <div className="py-8 space-y-1">
          <h2 className="text-3xl font-bold text-center transition-transform duration-300 hover:scale-110">
            Contact Center
          </h2>
          <img
            src="/contacto.png"
            alt="imagendecontacto"
            className="mx-auto transition-transform duration-300 hover:scale-110"
          ></img>{" "}
          <div className="flex flex-col items-center justify-center space-y-2 ">
            <div className="flex items-center gap-2">
              <GrCaretNext />
              <h3>Ventas, asesoría y Servicio al Cliente</h3>
            </div>
            <div className="flex items-center gap-2">
              <FaRegClock />

              <h3 className="text-center">
                Lunes a Viernes 10 am - 7 pm <br />
                Sábado 10 am - 3 pm
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <FaPhone />
              <h3>WhatsApp: (+57) 302 312 1847</h3>
            </div>
          </div>
          <a href="https://wa.me/573216599736">
            <img
              src="/whatsapp.png"
              alt="imagen"
              className="h-24 mx-auto transition-transform duration-300 animate-pulse hover:scale-110"
            ></img>
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default Nosotros;
