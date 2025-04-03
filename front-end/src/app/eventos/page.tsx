"use client";
import React from "react";
import { useAuth } from "@/app/contextos/contextoAuth";
import GetEventos from "./getEventos";

const EventosView = () => {
  const { isAuth, user } = useAuth();
  console.log(user);
  if (isAuth === null) {
    return <div>loading</div>;
  }

  return (
    <div className="py-10 text-black bg-fondo font-poppins">
      <GetEventos />
    </div>
  );
};

export default EventosView;
