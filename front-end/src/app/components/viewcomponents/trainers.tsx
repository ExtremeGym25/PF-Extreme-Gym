"use client";
import { useState } from "react";
import { trainers } from "../../helpers/arreglotrainers";
import Image from "next/image";
import { motion } from "framer-motion";

const TrainersCarousel = () => {
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);

  const handleCardClick = (index: number) => {
    setFlippedIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className="md:pl-16 font-poppins">
      <h2 className="text-3xl font-bold text-center transition-transform duration-300 hover:scale-110">
        Nuestros Entrenadores{" "}
      </h2>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1 }}
        className="flex-col"
      >
        <div className="grid items-center grid-cols-2 gap-4 px-4 py-4 md:px-8 md:grid-cols-3">
          {trainers.map((trainer, index) => (
            <div
              key={index}
              className="relative overflow-hidden transition-transform duration-300 rounded-lg shadow-md w-44 h-44 md:w-56 md:h-56 bg-verde hover:scale-105"
              onClick={() => handleCardClick(index)}
              style={{ perspective: "1000px" }}
            >
              <div
                className={`relative w-full h-full transform ${
                  flippedIndex === index ? "rotate-y-180" : ""
                } transition-transform duration-500`}
              >
                <div
                  className={`absolute inset-2 backface-hidden h-[580px]${
                    flippedIndex === index ? "opacity-0" : "opacity-100"
                  }`}
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <Image
                    src={trainer.image}
                    alt={`Trainer ${index + 1}`}
                    layout="responsive"
                    width={200}
                    height={500}
                    className="rounded-md "
                  />
                  <p className="mt-2 text-center text-white">{trainer.name}</p>
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
      </motion.div>
    </div>
  );
};

export default TrainersCarousel;
