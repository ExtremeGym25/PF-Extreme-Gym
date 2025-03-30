import React from "react";
import CreacionRutinas from "./rutinas";

import Header from "../components/Header";

import Sidebar from "../components/Sidebar";
import ListaRutinas from "./listaRutinas";
const rutinasView = () => {
  return (
    <div className="flex min-h-screen bg-[#0D1F2D]">
      <Sidebar />
      <div className="flex-1 p-4">
        <Header />
        <div className="py-4">
          <CreacionRutinas />
        </div>
        <ListaRutinas />
      </div>
    </div>
  );
};

export default rutinasView;
