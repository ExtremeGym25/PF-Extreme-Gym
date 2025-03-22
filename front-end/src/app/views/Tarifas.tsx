import React from "react";

const Tarifas = () => {
  return (
    <div>
      <div className="grid grid-cols-2 gap-4 py-4 md:px-16 md:grid-cols-2">
        <div className="object-cover w-full h-full mx-auto p-2relative max-w-10xl">
          <img
            src="/landing1.jpg"
            alt="Banner"
            className="object-cover w-full transition-transform duration-500 h-96"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h2 className="py-2 text-3xl font-bold text-center transition-transform duration-300 hover:scale-110">
            Atrévete
          </h2>
          <h3 className="text-center transition-transform duration-300 text-1xl hover:scale-110">
            Con clases como esta
          </h3>
          <iframe
            className="top-0 left-0 w-full h-full rounded-lg shadow-lg "
            src="https://www.youtube.com/embed/b3xR3k87Jos?si=zbu72BCsI32z9olA2"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Tarifas;
