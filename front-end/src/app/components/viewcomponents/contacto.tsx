"use client";

import React from "react";
import Image from "next/image";
import { GrCaretNext } from "react-icons/gr";
import { FaRegClock } from "react-icons/fa";
import { FaPhone } from "react-icons/fa6";
import { motion } from "framer-motion";
const Contacto = () => {
  return (
    <div>
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
          <Image
            src="/contacto.png"
            width={300} // Ajusta el tamaño según lo necesites
            height={300}
            alt="imagendecontacto"
            className="mx-auto transition-transform duration-300 hover:scale-110"
          ></Image>{" "}
          <div className="flex flex-col items-center justify-center space-y-2 ">
            <div className="flex items-center gap-2">
              <GrCaretNext />
              <h3>Asesoría y Servicio al Cliente</h3>
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
            <Image
              src="/whatsapp.png"
              alt="imagen"
              layout="responsive"
              width={256}
              height={96}
              className="h-24 mx-auto transition-transform duration-300 animate-pulse hover:scale-110"
            ></Image>
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default Contacto;
