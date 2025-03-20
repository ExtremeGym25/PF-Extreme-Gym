"use client";
import React, { useState, useEffect } from "react";
import { GoChevronLeft } from "react-icons/go";
import { GoChevronRight } from "react-icons/go";
import { routes } from "../../routes/routes";
import Link from "next/link";

const images = [
  "/casosExito1.jpg",
  "/landing2.jpg",
  "/landing3.jpg",
  "/landing4.jpg",
];

const CarouselCasosExito = () => {
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
export default CarouselCasosExito;
