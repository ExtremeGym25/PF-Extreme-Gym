import React from "react";
import Tarifas from "../views/Tarifas";
import Beneficios from "../components/viewcomponents/beneficios";

const tarifasView = () => {
  return (
    <div className="py-2 bg-fondo font-poppins text-foreground">
      {" "}
      <Tarifas></Tarifas>
      <Beneficios></Beneficios>
    </div>
  );
};

export default tarifasView;
