import React from "react";

const Tarifas = () => {
  return (
    <div className="px-4 py-4 md:px-16">
      <h2 className="py-1 text-3xl font-bold text-center transition-transform duration-300 hover:scale-110">
        Nuestras Tarifas
      </h2>
      <div className="grid items-center grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex justify-center w-full">
          <img
            src="/landing1.webp"
            alt="Banner"
            className="w-full h-auto max-w-md transition-transform duration-500 rounded-lg shadow-lg md:max-w-lg hover:scale-105"
          />
        </div>

        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <h2 className="py-2 text-3xl font-bold transition-transform duration-300 hover:scale-110">
            Atrévete
          </h2>
          <h3 className="text-lg transition-transform duration-300 hover:scale-110">
            Con clases como esta
          </h3>

          <div className="w-full max-w-md mt-4">
            <iframe
              className="w-full rounded-lg shadow-lg aspect-video"
              src="https://www.youtube.com/embed/b3xR3k87Jos?si=zbu72BCsI32z9olA2"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tarifas;
