"use client";
import React, { useState, useEffect } from "react";

import { motion } from "framer-motion";

const testimonials = [
  "/landing1.jpg",
  "/landing2.jpg",
  "/landing3.jpg",
  "/landing4.jpg",
  "/landing3.jpg",

  ,
];

const SegundoCarouselHome = () => {
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
export default SegundoCarouselHome;
