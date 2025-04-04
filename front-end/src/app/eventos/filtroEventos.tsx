import React from "react";
import { ExtremeSportCategory } from "../tipos";

export interface CategoriesFilterProps {
  categories: ExtremeSportCategory[];
  onCategoryChange: (category: ExtremeSportCategory | null) => void;
  currentCategory: ExtremeSportCategory | null;
}

const FiltroEventos: React.FC<CategoriesFilterProps> = ({
  categories,
  onCategoryChange,
  currentCategory,
}) => {
  return (
    <div className="max-w-full p-4 rounded-lg shadow-md bg-blackP font-poppins">
      <div className="flex flex-col gap-4 ">
        <button
          onClick={() => onCategoryChange(null)}
          className="w-full py-2 text-black transition-colors rounded-lg shadow-md bg-fondo hover:bg-verde"
        >
          Reset Filtros
        </button>

        <select
          value={currentCategory || ""}
          onChange={(e) =>
            onCategoryChange(
              e.target.value === ""
                ? null
                : (e.target.value as ExtremeSportCategory)
            )
          }
          className="w-full p-2 rounded-lg shadow-md bg-fondo font-poppins"
        >
          <option value="">Todas las categorías</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FiltroEventos;
