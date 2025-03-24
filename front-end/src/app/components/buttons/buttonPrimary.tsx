import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}
const ButtonPrimary = ({ children, ...props }: ButtonProps) => {
  return (
    <button
      className="px-6 py-2 mt-4 transition rounded-md  font-poppins bg-fondo text-foreground hover:bg-verde hover:scale-110 ring-2 ring-gray-300 ring-opacity-100"
      {...props}
    >
      {children}
    </button>
  );
};
export default ButtonPrimary;
