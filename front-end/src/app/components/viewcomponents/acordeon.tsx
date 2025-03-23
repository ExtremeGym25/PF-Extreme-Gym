import React, { useState } from "react";

interface AcordeonProps {
  title: string;
  children: React.ReactNode;
}

const Acordeon: React.FC<AcordeonProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="mb-4 border border-gray-300 rounded-lg shadow-md">
      <button
        onClick={toggleAccordion}
        className="flex items-center justify-between w-full px-4 py-2 rounded-lg text-foreground bg-azul focus:outline-none"
      >
        <span>{title}</span>
        <span>{isOpen ? "▲" : "▼"}</span>
      </button>
      {isOpen && <div className="p-4 ">{children}</div>}
    </div>
  );
};

export default Acordeon;
