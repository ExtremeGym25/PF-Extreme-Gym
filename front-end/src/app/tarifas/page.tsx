import React from "react";
import Tarifas from "../views/Tarifas";
import Beneficios from "../components/viewcomponents/beneficios";

const tarifasView = () => {
  return (
    <div className="bg-fondo font-poppins text-blanco ">
      {" "}
      <Tarifas></Tarifas>
      <Beneficios></Beneficios>
    </div>
  );
};

export default tarifasView;
