/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect, FC } from "react";
import { GoChevronLeft } from "react-icons/go";
import { GoChevronRight } from "react-icons/go";
import { routes } from "../routes/routes";
import Link from "next/link";
import { motion } from "framer-motion";
import ButtonPrimary from "../components/buttons/buttonPrimary";

const images = [
  "/landing1.jpg",
  "/landing2.jpg",
  "/landing3.jpg",
  "/landing4.jpg",
];

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full mx-auto max-w-10xl">
      <div className="overflow-hidden rounded-lg">
        <Link href={routes.tarifas}>
          <img
            src={images[currentIndex]}
            alt={`Slide ${currentIndex + 1}`}
            className="object-cover w-full transition-transform duration-500 h-96"
          />
        </Link>
      </div>
      <button
        onClick={prevSlide}
        className="absolute p-2 -translate-y-1/2 rounded-full shadow-md top-1/2 left-2 text-blanco hover:bg-grisP"
      >
        <GoChevronLeft />
      </button>
      <button
        onClick={nextSlide}
        className="absolute p-2 -translate-y-1/2 rounded-full shadow-md top-1/2 right-2 text-blanco hover:bg-grisP"
      >
        <GoChevronRight />
      </button>

      <div className="absolute flex space-x-2 transform -translate-x-1/2 bottom-4 left-1/2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? "bg-fondo" : "bg-verde"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};
const testimonials = [
  "/landing1.jpg",
  "/landing2.jpg",
  "/landing3.jpg",
  "/landing4.jpg",
  "/landing3.jpg",

  ,
];

const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center gap-4 py-4">
      {testimonials.map((image, index) => (
        <motion.div
          onClick={() => setCurrentIndex(index)}
          key={index}
          className={`w-48 h-48 md:w-64 md:h-64 bg-verde shadow-md rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 ${
            index === currentIndex ? "opacity-100" : "opacity-50"
          }`}
        >
          <motion.img
            src={image}
            alt={`Testimonial ${index + 1}`}
            className="object-cover w-full h-full p-2"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      ))}
    </div>
  );
};

const Homeview = () => {
  return (
    <div className="pb-2 space-y-10 font-poppins bg-fondo">
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1 }}
      >
        <Carousel />
      </motion.div>
      <div className="text-center">
        <h2 className="text-2xl font-bold transition-transform duration-300 hover:scale-110">
          🔥 Nuestros Testimonios 🔥
        </h2>
        <p className="text-gray-600 transition-transform duration-300 hover:scale-110">
          ¡Tu puedes ser uno de ellos!
        </p>
      </div>
      <div>
        <TestimonialCarousel />
      </div>
      <div className="flex items-center justify-center pb-4 mx-auto space-x-4">
        <ButtonPrimary> Registrate</ButtonPrimary>
      </div>

      <div className="text-center">
        <h2 className="text-3xl font-bold transition-transform duration-300 hover:scale-110 ">
          ¿Porque entrenar con nosostro?
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-4 px-4 pb-10 md:grid-cols-5 md:px-8 ">
        <div className="flex flex-col items-center justify-center p-4 transition-transform duration-300 border rounded-lg shadow border-verde hover:scale-110">
          <div className="flex items-center h-40">
            <img
              src="/home1.png"
              alt="imagenhome1"
              className="object-cover w-full h-full pb-2"
            />
          </div>
          <h3 className="pb-2 font-bold text-center ">
            Entrenamiento Integral en un Solo Lugar
          </h3>
          <p className="text-sm text-justify">
            Combina lo mejor del fitness convencional con deportes extremos como
            escalada, triatlón y ciclismo de montaña. ¡Nunca más necesitarás
            múltiples plataformas para entrenar!
          </p>
          <p></p>
        </div>
        <div className="flex flex-col items-center justify-center p-4 transition-transform duration-300 border rounded-lg shadow border-verde hover:scale-110">
          <div className="flex items-center h-40">
            <img
              src="/home2.png"
              alt="Imagen 2 home 2"
              className="object-cover w-full h-full pb-2"
            />
          </div>
          <h3 className="pb-2 font-bold text-center">
            Planes Personalizados y Desafiantes
          </h3>
          <p className="text-sm text-justify">
            Recibe rutinas adaptadas a tus objetivos personales, ya sea mejorar
            tu resistencia, ganar masa muscular o prepararte para deportes
            extremos.
          </p>
          <p></p>
        </div>
        <div className="flex flex-col items-center justify-center p-4 transition-transform duration-300 border rounded-lg shadow border-verde hover:scale-110">
          <div className="flex items-center h-40">
            <img
              src="/home3.png"
              alt="imagen home 3"
              className="object-cover w-full h-full pb-2"
            />
          </div>
          <h3 className="pb-2 font-bold text-center">
            Comunidad de Apasionados del Deporte
          </h3>
          <p className="text-sm text-justify">
            Conéctate con otros entusiastas del fitness y deportes extremos,
            comparte logros y encuentra compañeros de entrenamiento que te
            motiven a dar lo mejor de ti.
          </p>
          <p></p>
        </div>
        <div className="flex flex-col items-center justify-center p-4 transition-transform duration-300 border rounded-lg shadow border-verde hover:scale-110">
          <img src="/home4.png" alt="imagen home 4" className="h-40 pb-0" />
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
              src="/home5.png"
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
      <div>
        <h2 className="text-3xl font-bold text-center transition-transform duration-300 hover:scale-110 ">
          Mira una de nuestras rutinas
        </h2>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1 }}
        >
          <div className="flex items-center justify-center p-4">
            <div className="relative w-full h-0 pb-[56.25%]">
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                src="https://www.youtube.com/embed/I_-ugvJXjLU?si=5M1NlWbinm6SB6EN"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </motion.div>
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
              <ButtonPrimary> Registrate</ButtonPrimary>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Homeview;
