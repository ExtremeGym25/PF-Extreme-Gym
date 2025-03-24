"use client";

import React from "react";
import { motion } from "framer-motion";

const NuestraHistoria = () => {
  return (
    <div>
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
    </div>
  );
};

export default NuestraHistoria;
