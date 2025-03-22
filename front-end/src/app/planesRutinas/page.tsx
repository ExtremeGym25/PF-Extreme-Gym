"use client";
import React from "react";
import { useAuth } from "@/app/contextos/contextoAuth";

const PlanesRutinasView = () => {
  const { isAuth, user } = useAuth();
  console.log(user);
  if (isAuth === null) {
    return <div>loading</div>;
  }
  if (isAuth) {
    return (
      <div className="bg-fondo font-poppins text-blanco ">
        planesRutinasView
      </div>
    );
  }

  return <div className="bg-fondo font-poppins text-blanco">Paga!!!!!</div>;
};

export default PlanesRutinasView;
