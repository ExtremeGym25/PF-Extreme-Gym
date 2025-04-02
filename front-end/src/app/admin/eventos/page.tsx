import React from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import CrearEvento from "./crearEventos";
import ListasEventos from "./getEventos";
const eventosView = () => {
  return (
    <div className="flex min-h-screen bg-[#0D1F2D]">
      <Sidebar />
      <div className="flex-1 p-4">
        <Header />
        <div className="py-4">
          <CrearEvento />
          <ListasEventos />
        </div>
      </div>
    </div>
  );
};

export default eventosView;
