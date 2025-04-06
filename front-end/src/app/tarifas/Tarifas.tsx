import React from "react";

const Tarifas = () => {
  return (
    <div className="px-4 py-6 md:px-16">
      <h2 className="py-1 text-3xl font-bold text-center transition-transform duration-300 hover:scale-110">
        Nuestras Tarifas
      </h2>
      <div className="grid items-center grid-cols-1 gap-6 pt-2 md:grid-cols-2">
        <div className="flex justify-center w-full">
          <img
            src="https://res.cloudinary.com/dixcrmeue/image/upload/v1743015236/landing1_lzoasu.webp"
            alt="Banner"
            className="w-full h-auto max-w-md transition-transform duration-500 rounded-lg shadow-lg md:max-w-lg hover:scale-105"
          />
        </div>

        <div className="flex flex-col items-center text-center ">
          <h2 className="py-2 text-2xl font-bold transition-transform duration-300 hover:scale-110">
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
