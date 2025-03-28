"use client";
import React from "react";
import { motion } from "framer-motion";
import CarouselCasosExito from "../components/viewcomponents/carouselcasosExito";
import EventosCasosExito from "../components/viewcomponents/eventosCasosExito";
import ButtonPrimary from "../components/buttons/buttonPrimary";
import GridCasosExito from "../components/viewcomponents/gridCasosExito";
import { useAuth } from "../contextos/contextoAuth";
import Link from "next/link";

const CasosExito = () => {
  const { isAuth } = useAuth();
  if (isAuth === null) {
    return <div>Loading...</div>;
  }
  if (isAuth) {
    return (
      <div className="py-2 pb-2 space-y-10 font-poppins bg-fondo">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <CarouselCasosExito />
        </motion.div>
        <div>
          <div className="text-center">
            <h2 className="text-2xl font-bold transition-transform duration-300 hover:scale-110">
              Opiniones de Nuestros Estudiantes
            </h2>
            <GridCasosExito />
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1 }}
        >
          <div className="flex flex-col items-center justify-center mx-auto ">
            <h2 className="text-3xl font-bold text-center transition-transform duration-300 hover:scale-110 ">
              ¡Eres parte de nuestra familia!
            </h2>

            <div>
              <Link href="/planesRutinas">
                <ButtonPrimary> Participa</ButtonPrimary>
              </Link>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1 }}
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold transition-transform duration-300 hover:scale-110">
              🔥 Nuestros Eventos 🔥
            </h2>
            <p className="text-gray-600 transition-transform duration-300 hover:scale-110">
              ¡Tu puedes participar en uno de ellos!
            </p>
          </div>
          <EventosCasosExito />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1 }}
        >
          <div className="flex flex-col items-center justify-center pb-4 mx-auto space-x-2">
            <h2 className="text-3xl font-bold text-center transition-transform duration-300 hover:scale-110 ">
              ¿Quieres Participar?
            </h2>
            <div>
              <Link href="/eventos">
                <ButtonPrimary> Eventos </ButtonPrimary>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }
  return (
    <div className="py-2 pb-2 space-y-10 font-poppins bg-fondo">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        <CarouselCasosExito />
      </motion.div>
      <div>
        <div className="text-center">
          <h2 className="text-2xl font-bold transition-transform duration-300 hover:scale-110">
            Opiniones de Nuestros Estudiantes
          </h2>
          <GridCasosExito />
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1 }}
      >
        <div className="flex flex-col items-center justify-center mx-auto ">
          <h2 className="text-3xl font-bold text-center transition-transform duration-300 hover:scale-110 ">
            ¿Estas Listo?
          </h2>
          <p className="text-gray-600 transition-transform duration-300 hover:scale-110">
            ¡Forma parte de nuestra familia!
          </p>
          <div>
            <Link href="/auth/registro">
              <ButtonPrimary> Registrate</ButtonPrimary>
            </Link>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1 }}
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold transition-transform duration-300 hover:scale-110">
            🔥 Nuestros Eventos 🔥
          </h2>
          <p className="text-gray-600 transition-transform duration-300 hover:scale-110">
            ¡Tu puedes participar en uno de ellos!
          </p>
        </div>
        <EventosCasosExito />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1 }}
      >
        <div className="flex flex-col items-center justify-center pb-4 mx-auto space-x-2">
          <h2 className="text-3xl font-bold text-center transition-transform duration-300 hover:scale-110 ">
            ¿Quieres Participar?
          </h2>
          <div>
            <Link href="/auth/registro">
              <ButtonPrimary> Eventos</ButtonPrimary>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CasosExito;
