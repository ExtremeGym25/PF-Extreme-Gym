import React from "react";
import Link from "next/link";
import ButtonPrimary from "@/app/components/buttons/buttonPrimary";
import Registro from "@/app/views/Registro";

const registroView = () => {
  return (
    <div className="grid w-full min-h-screen grid-cols-1 overflow-hidden font-poppins md:grid-cols-2">
      <div
        className="relative flex flex-col items-center justify-center w-full min-h-screen transform scale-105 bg-no-repeat bg-cover border-l-4 border-grisP"
        style={{ backgroundImage: "url('/landing1.jpg')" }}
      >
        <p className="mb-6 text-lg transition-transform duration-300 text-foreground hover:scale-110 hover:text-black">
          ¿Ya tienes cuenta?
        </p>
        <Link href="/auth/login">
          <ButtonPrimary>inicia Sesion</ButtonPrimary>
        </Link>
        <img
          src="/logo.png"
          alt="Logo"
          className="h-16 pt-8 transition-transform duration-300 animate-pulse hover:scale-110"
        ></img>
      </div>

      <div
        className="flex flex-col items-center justify-center p-10 shadow-lg bg-background text-foreground "
        style={{ backgroundImage: "/landing1.jpg" }}
      >
        <Registro />
      </div>
    </div>
  );
};

export default registroView;
