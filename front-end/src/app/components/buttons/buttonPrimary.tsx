interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const ButtonPrimary = ({ children, ...props }: ButtonProps) => {
  return (
    <button
      className="w-full px-4 py-2 mt-4 text-sm transition rounded-md md:w-auto md:px-6 font-poppins bg-fondo text-foreground hover:bg-verde hover:scale-110 ring-2 ring-gray-300 ring-opacity-100 md:text-base"
      {...props}
    >
      {children}
    </button>
  );
};

export default ButtonPrimary;
