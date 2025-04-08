"use client";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import React, { useState } from "react";

const containerStyle = {
  width: "100%",
  height: "400px",
};

interface MapaProps {
  latitude: number;
  longitude: number;
}

const MapaEventos: React.FC<MapaProps> = ({ latitude, longitude }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });
  const [mostrarModal, setMostrarModal] = useState(false);

  if (!isLoaded) {
    return <p>Cargando mapa...</p>;
  }
  return (
    <div>
      <button
        className="text-sm text-verde"
        onClick={() => setMostrarModal(true)}
      >
        Ver Mapa
      </button>
      {mostrarModal && (
        <div className="fixed inset-0 flex items-center justify-center pt-32 bg-black bg-opacity-50 ">
          <div className="relative w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
            <button
              onClick={() => setMostrarModal(false)}
              className="absolute text-2xl text-gray-600 top-2 right-3 hover:text-black"
            >
              ✖
            </button>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={{ lat: latitude, lng: longitude }}
              zoom={15}
            >
              <Marker position={{ lat: latitude, lng: longitude }} />
            </GoogleMap>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapaEventos;
