import React from "react";

const TerminosCondiciones = () => {
  return (
    <div className="py-12">
      <h1 className="text-3xl font-bold text-center transition-transform duration-300 hover:scale-110">
        Términos y condiciones de uso
      </h1>
      <p className="px-16 py-2">Última actualización: [Marzo 2025]</p>
      <div className="px-16 text-lg text-justify">
        1. Introducción: Estos términos regulan el uso de Extreme Gym. Al
        registrarse, los usuarios aceptan cumplirlos. <br></br>2. Requisitos:
        Debe tener al menos 18 años o contar con autorización de un tutor legal.
        <br></br> 3. Responsabilidades del usuario: Usar la plataforma de manera
        lícita y respetuosa, no compartir contenido ofensivo o fraudulento.{" "}
        <br></br>4. Modificaciones: Nos reservamos el derecho de actualizar
        estos términos en cualquier momento.<br></br> 5. Terminación de cuenta:
        Podemos suspender cuentas que violen estas condiciones.
      </div>
    </div>
  );
};

export default TerminosCondiciones;
