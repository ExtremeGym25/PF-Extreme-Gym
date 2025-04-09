"use client";
import React from "react";
import Tarifas from "./Tarifas";
import Beneficios from "./beneficios";
import Precios from "./Precios";

const tarifasView = () => {
  return (
    <div className="py-2 bg-fondo font-poppins text-foreground">
      {" "}
      <Tarifas></Tarifas>
      <Beneficios></Beneficios>
      <Precios />
    </div>
  );
};

export default tarifasView;
