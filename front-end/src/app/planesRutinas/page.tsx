"use client";
import React from "react";
import { useAuth } from "@/app/contextos/contextoAuth";
import ListaRutinas from "./listaRutinas";

const PlanesRutinasView = () => {
  const { isAuth, user } = useAuth();
  console.log(user);
  if (isAuth === null) {
    return <div>loading</div>;
  }

  return (
    <div className="py-10 text-black bg-fondo font-poppins">
      <ListaRutinas />
    </div>
  );
};

export default PlanesRutinasView;
