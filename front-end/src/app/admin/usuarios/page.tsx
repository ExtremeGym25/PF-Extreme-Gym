import React from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import GetUsers from "./getUsers";

const Usuarios = () => {
  return (
    <div className="flex min-h-screen bg-[#0D1F2D]">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <GetUsers />
      </div>
    </div>
  );
};

export default Usuarios;
