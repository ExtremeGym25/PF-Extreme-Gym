import React from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import ImagenesPublicidad from "./imagenes";

const Publicidad = () => {
  return (
    <div className="flex min-h-screen bg-fondo ">
      <div className="w-1/4 bg-fondo">
        <Sidebar />
      </div>

      <div className="flex flex-col flex-1">
        <Header />

        <div className="flex items-center justify-center w-full py-4">
          <ImagenesPublicidad />
        </div>
      </div>
    </div>
  );
};
export default Publicidad;
