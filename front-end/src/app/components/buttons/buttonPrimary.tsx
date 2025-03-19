import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}
const ButtonPrimary = ({ children, ...props }: ButtonProps) => {
  return (
    <button
      className=" font-poppins mt-4 px-6 py-2 bg-fondo text-blanco rounded-md hover:bg-verde hover:scale-110 transition ring-2 ring-azul ring-opacity-100"
      {...props}
    >
      {children}
    </button>
  );
};
export default ButtonPrimary;
