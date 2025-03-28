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
      <div className="py-10 text-black bg-fondo font-poppins">
        planesRutinasView
      </div>
    );
  }

  return (
    <div className="py-10 text-black bg-fondo font-poppins">Paga!!!!!</div>
  );
};

export default PlanesRutinasView;
