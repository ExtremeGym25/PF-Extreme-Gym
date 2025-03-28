import React from "react";
import { IPlans } from "@/app/tipos";
import Image from "next/image";
interface ListaRutinasProps {
  rutinas: IPlans[];
}

const ListaRutinas: React.FC<ListaRutinasProps> = ({ rutinas }) => {
  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h2 className="mb-4 text-lg font-bold text-center">Lista de Rutinas</h2>

      {rutinas.length === 0 ? (
        <p className="text-gray-500">No hay rutinas disponibles.</p>
      ) : (
        <ul className="space-y-2">
          {rutinas.map((rutina) => (
            <li key={rutina.id} className="p-2 bg-gray-100 rounded">
              <h3 className="font-semibold">{rutina.nombre}</h3>
              <p className="text-sm text-gray-600">{rutina.descripcion}</p>
              {rutina.imageUrl && (
                <div className="mt-2">
                  <Image
                    src={rutina.imageUrl}
                    alt={rutina.nombre}
                    width={150}
                    className="rounded"
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default ListaRutinas;
