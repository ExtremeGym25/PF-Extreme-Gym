// /* eslint-disable @next/next/no-img-element */

// "use client";
// import React, { useEffect, useState } from "react";
// import { getEvents } from "../servicios/eventos";

// const EventosView = () => {
//   const [eventos, setEventos] = useState([]);

//   useEffect(() => {
//     const fetchEventos = async () => {
//       const data = await getEvents();
//       setEventos(data);
//     };
//     fetchEventos();
//   }, []);

//   return (
//     <div className="min-h-screen p-6 bg-blanco text-azul1">
//       <h1 className="mb-6 text-4xl font-bold text-center">Lista de Eventos</h1>
//       <div className="max-w-4xl mx-auto space-y-6">
//         {eventos.length === 0 ? (
//           <p className="text-2xl text-center text-black">No hay eventos disponibles.</p>
//         ) : (
//           eventos.map((evento) => (
//             <div
//               key={evento.id}
//               className="flex flex-col items-center p-4 border rounded-lg shadow-lg bg-blanco border-verde md:flex-row"
//             >
//               {evento.image && (
//                 <img
//                   src={evento.image}
//                   alt={evento.name}
//                   className="object-cover w-40 h-40 mb-4 rounded-lg md:mb-0 md:mr-6"
//                 />
//               )}
//               <div className="flex-1">
//                 <h2 className="text-xl font-semibold text-black uppercase">{evento.name}</h2>
//                 <p className="text-naranja">{new Date(evento.date).toLocaleDateString()} - {evento.time}</p>
//                 <p className="mt-2 text-black">{evento.description}</p>
//                 <p className="mt-2 font-bold text-black uppercase">{evento.location}</p>
//                 <p className="font-semibold text-verde">Capacidad: {evento.capacity}</p>
//               </div>
//               <button className="px-4 py-2 mt-4 text-white transition rounded-lg md:mt-0 bg-verde hover:bg-green-600">
//                 Registrarse
//               </button>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default EventosView;
