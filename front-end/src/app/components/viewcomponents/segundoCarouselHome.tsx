"use client";
import React, { useState, useEffect } from "react";

import { motion } from "framer-motion";

const testimonials = [
  "https://res.cloudinary.com/dixcrmeue/image/upload/v1743873014/bison-race-obstacle-race-sports-competition-belarus-may-2019_tkaxsa.jpg",
  "https://res.cloudinary.com/dixcrmeue/image/upload/v1743873104/portrait-female-athlete-competing-olympic-games_y8bdpa.jpg",
  "https://res.cloudinary.com/dixcrmeue/image/upload/v1743873373/men-playing-rugby-field_cnxflm.jpg",
  "https://res.cloudinary.com/dixcrmeue/image/upload/v1743873374/man-steps-tyres-hanging-air_lknp7w.jpg",
  "https://res.cloudinary.com/dixcrmeue/image/upload/v1743873437/man-wakesurfing-wave-from-boat_mdswlx.jpg",

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
    <div className="flex flex-wrap justify-center gap-4 py-4 text">
      {testimonials.map((image, index) => (
        <div
          onClick={() => setCurrentIndex(index)}
          key={index}
          className={`w-36 h-36 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 bg-verde shadow-md rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 ${
            index === currentIndex ? "opacity-100" : "opacity-50"
          }`}
        >
          <img
            src={image}
            alt={`Testimonial ${index + 1}`}
            className="object-cover w-full h-full p-2"
          />
        </div>
      ))}
    </div>
  );
};
export default SegundoCarouselHome;
