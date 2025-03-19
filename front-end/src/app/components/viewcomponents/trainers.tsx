"use client";

import { useState } from "react";

const trainers = [
  {
    image: "/landing1.jpg",
    text: "Diego Torres - Entrenador Funcional y Preparador de Maratones",
  },
  {
    image: "/landing2.jpg",
    text: "Camila Rojas - Instructora de Escalada y Montañismo",
  },
  {
    image: "/landing3.jpg",
    text: "Mateo Ramírez - Preparador Físico y Coach de Triatlón",
  },
  {
    image: "/landing1.jpg",
    text: "Sofía Martínez - Instructora de Yoga y Flexibilidad para Deportistas",
  },
  {
    image: "/landing2.jpg",
    text: "Laura Luna - Instructora de Pesas",
  },
  {
    image: "/landing3.jpg",
    text: "Luis Lopez - Instructora de Pesas",
  },
];

const TrainersCarousel = () => {
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);

  const handleCardClick = (index: number) => {
    setFlippedIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className="grid grid-cols-2 gap-4 py-4 md:px-16 md:grid-cols-3">
      {trainers.map((trainer, index) => (
        <div
          key={index}
          className="w-48 h-48 overflow-hidden transition-transform duration-300 rounded-lg shadow-md md:w-64 md:h-64 bg-verde hover:scale-105 "
          onClick={() => handleCardClick(index)}
          style={{ perspective: "1000px" }}
        >
          <div
            className={`relative w-full h-full transform ${
              flippedIndex === index ? "rotate-y-180" : ""
            } transition-transform duration-500`}
          >
            <div
              className={`absolute inset-0 backface-hidden ${
                flippedIndex === index ? "opacity-0" : "opacity-100"
              }`}
              style={{ backfaceVisibility: "hidden" }}
            >
              <img
                src={trainer.image}
                alt={`Trainer ${index + 1}`}
                className="object-cover w-full h-full p-2 rounded-lg"
              />
            </div>

            <div
              className={`absolute inset-0 bg-gray-800 text-white flex items-center justify-center p-4 rounded-lg transform rotate-y-180 backface-hidden ${
                flippedIndex === index ? "opacity-100" : "opacity-0"
              }`}
              style={{ backfaceVisibility: "hidden" }}
            >
              <p className="text-center">{trainer.text}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrainersCarousel;
