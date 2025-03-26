"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { routes } from "@/app/routes/routes";

const images = [
  "/landing1.webp",
  "/landing2.webp",
  "/landing3.webp",
  "/landing4.webp",
];

const CarouselHome = () => {
  // const [images, setImages] = useState([]);
  // const [currentIndex, setCurrentIndex] = useState(0);

  // useEffect(() => {
  //   // Obtener imágenes desde la API
  //   const fetchImages = async () => {
  //     try {
  //       const res = await fetch("/api/carousel-images");
  //       const data = await res.json();
  //       setImages(data.map(item => item.image_url)); // Extraer URLs de la respuesta
  //     } catch (error) {
  //       console.error("Error cargando imágenes:", error);
  //     }
  //   };

  //   fetchImages();
  // }, []);
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
    <div className="pb-2 space-y-10 font-poppins bg-fondo">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="relative w-full mx-auto max-w-10xl">
          <div className="overflow-hidden rounded-lg">
            <Link href={routes.tarifas}>
              <img
                src={images[currentIndex]}
                alt={`Slide ${currentIndex + 1}`}
                className="object-cover w-full h-screen transition-transform duration-500"
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
                  index === currentIndex ? "bg-verde" : "bg-grisP"
                }`}
              ></button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CarouselHome;
