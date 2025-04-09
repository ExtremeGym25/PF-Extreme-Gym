import React from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import GetReservasAdmin from "./getReservas";

const ReservasAdminView = () => {
  return (
    <div className="flex w-full min-h-screen bg-fondo">
      <Sidebar />
      <div className="flex-1 p-4">
        <Header />
        <div className="py-4">
          <GetReservasAdmin />
        </div>
      </div>
    </div>
  );
};

export default ReservasAdminView;
