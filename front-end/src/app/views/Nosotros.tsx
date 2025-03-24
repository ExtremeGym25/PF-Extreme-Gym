import React from "react";

import TrainersCarousel from "../components/viewcomponents/trainers";
import NuestraHistoria from "../components/viewcomponents/nuestraHistoria";
import Ubicacion from "../components/viewcomponents/ubicacion";
import Contacto from "../components/viewcomponents/contacto";

const Nosotros = () => {
  return (
    <div className="py-4 font-poppins bg-fondo">
      <NuestraHistoria />
      <Ubicacion />
      <TrainersCarousel />
      <Contacto />
    </div>
  );
};

export default Nosotros;
