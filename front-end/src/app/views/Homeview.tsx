import React from "react";
import CarouselHome from "../components/viewcomponents/carruselHome";
import SegundoCarouselHome from "../components/viewcomponents/segundoCarouselHome";
import TercerElementoHome from "../components/viewcomponents/tercerElementoHome";
import CuartoElementoHome from "../components/viewcomponents/cuartoElementoHome";
import QuintoElementoHome from "../components/viewcomponents/quintoElementoHome";
import SextoElementoHome from "../components/viewcomponents/sextoElementoHome";

const Homeview = () => {
  return (
    <div>
      <div>
        <CarouselHome />
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-bold transition-transform duration-300 hover:scale-110">
          🔥 Nuestros Eventos 🔥
        </h2>
        <p className="text-gray-600 transition-transform duration-300 hover:scale-110">
          ¡Tu puedes ser parte de ellos!
        </p>
      </div>
      <div>
        <SegundoCarouselHome />
      </div>
      <div>
        <TercerElementoHome />
      </div>
      <CuartoElementoHome />
      <div>
        <h2 className="text-3xl font-bold text-center transition-transform duration-300 hover:scale-110 ">
          Mira una de nuestras rutinas
        </h2>
        <QuintoElementoHome />
        <SextoElementoHome />
      </div>
    </div>
  );
};

export default Homeview;
