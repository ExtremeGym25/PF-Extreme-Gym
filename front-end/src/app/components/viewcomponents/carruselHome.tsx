"use client";
import React, { useEffect, useState } from "react";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { motion } from "framer-motion";
import Link from "next/link";
import { useImageContext } from "@/app/contextos/contextoImag"; // <---
import Image from "next/image";

const defaultImages = [
  "https://res.cloudinary.com/dixcrmeue/image/upload/v1743975863/xTREME_xzwmr7.png",
  "https://res.cloudinary.com/dixcrmeue/image/upload/v1743873104/portrait-female-athlete-competing-olympic-games_y8bdpa.jpg",
  "https://res.cloudinary.com/dixcrmeue/image/upload/v1744145916/xTREME_1_yl1lh6.png",
  "https://res.cloudinary.com/dixcrmeue/image/upload/v1743873374/man-steps-tyres-hanging-air_lknp7w.jpg",
  "https://res.cloudinary.com/dixcrmeue/image/upload/v1744145904/Sube_de_nivel_kc0cnt.png",
];
const CarouselHome = () => {
  const { images: contextImages } = useImageContext();
  const images = contextImages.length > 0 ? contextImages : defaultImages;

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
  }, [images.length]);

  return (
    <div className="pb-2 space-y-10 font-poppins bg-fondo">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="relative w-full mx-auto max-w-10xl">
          <div className="relative w-full aspect-[16/9]">
            <Link href="/tarifas">
              <Image
                src={images[currentIndex]}
                alt={`Slide ${currentIndex + 1}`}
                fill
                className="object-cover"
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
