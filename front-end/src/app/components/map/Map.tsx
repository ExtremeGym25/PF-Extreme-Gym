import React from "react";

const Map = () => {
  return (
    <div className="w-full h-96">
      <iframe
        className="w-full h-full rounded-lg shadow-lg"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.590598574419!2d-74.05257259999999!3d4.666848000000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f9af5539e0589%3A0x58f8536449f01c72!2sCentro%20Comercial%20Andino!5e0!3m2!1ses-419!2sco!4v1740863286562!5m2!1ses-419!2sco"
        width="600"
        height="450"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
};

export default Map;
