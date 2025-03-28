"use client";
import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import { imgUsuarios } from "../../helpers/arregoImagenes";

const EventosCasosExito = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % imgUsuarios.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center gap-4 py-4">
      {imgUsuarios.map((image, index) => (
        <motion.div
          onClick={() => setCurrentIndex(index)}
          key={index}
          className={`w-48 h-48 md:w-64 md:h-64 bg-verde shadow-md rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 ${
            index === currentIndex ? "opacity-100" : "opacity-50"
          }`}
        >
          <img
            src={image}
            alt={`eventos ${index + 1}`}
            className="object-cover w-full h-full p-2"
          />
        </motion.div>
      ))}
    </div>
  );
};
export default EventosCasosExito;
