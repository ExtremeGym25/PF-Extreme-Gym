"use client";
import { useState } from "react";
import { opinionesUsuarios } from "../../helpers/arregloOpiniones";

const GridCasosExito = () => {
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);

  const handleCardClick = (index: number) => {
    setFlippedIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className="md:pl-16 font-poppins">
      <div className="grid items-center grid-cols-2 gap-4 px-4 pt-2 md:px-8 md:grid-cols-3">
        {opinionesUsuarios.map((opinion, index) => (
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
                  src={opinion.image}
                  alt={`review ${index + 1}`}
                  className="object-cover w-full h-full p-2 rounded-lg"
                />
              </div>

              <div
                className={`absolute inset-0 bg-gray-800 text-white flex items-center justify-center p-4 rounded-lg transform rotate-y-180 backface-hidden ${
                  flippedIndex === index ? "opacity-100" : "opacity-0"
                }`}
                style={{ backfaceVisibility: "hidden" }}
              >
                <p className="text-center">{opinion.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GridCasosExito;
