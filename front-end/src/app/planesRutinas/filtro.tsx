import React from "react";
import { PlanCategory } from "../tipos";

export interface CategoriesFilterProps {
  categories: PlanCategory[];
  onCategoryChange: (category: PlanCategory | null) => void;
  currentCategory: PlanCategory | null;
}

const CategoriesFilter: React.FC<CategoriesFilterProps> = ({
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
              e.target.value === "" ? null : (e.target.value as PlanCategory)
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

export default CategoriesFilter;
