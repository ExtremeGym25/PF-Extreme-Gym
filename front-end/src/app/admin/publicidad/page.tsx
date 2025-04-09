import React from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import ImagenesPublicidad from "./imagenes";

const Publicidad = () => {
  return (
    <div className="flex min-h-screen bg-azul1 ">
      <div className="w-1/4 bg-azul1">
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
