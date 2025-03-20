"use client";
import Link from "next/link";
import React from "react";
import ButtonPrimary from "../buttons/buttonPrimary";
import { routes } from "@/app/routes/routes";
import { useAuth } from "@/app/contextos/contextoAuth";
//import { useCart } from "@/app/context/cartContext";
//import { MdOutlineShoppingCart } from "react-icons/md";
import { FaRegUserCircle } from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";
import { PiHeartBold } from "react-icons/pi";

const UserAuth = () => {
  const { isAuth, resetUserData } = useAuth();
  //const { total } = useCart();
  const { user } = useAuth();
  //cuando esta logueado

  if (isAuth === null) {
    return <div>loading</div>;
  }
  if (isAuth) {
    return (
      <div className="flex items-center gap-3 ">
        <Link className="transition hover:text-blueP" href={routes.favoritos}>
          <PiHeartBold />
        </Link>
        <Link
          href={routes.miPerfil}
          className="font-semibold transition text-foreground hover:text-blueP"
        >
          {user?.name || "Usuario"}
        </Link>
        <div className="transition hover:text-blueP">total</div>
        {/* <Link href={routes.cart} className="transition hover:text-blueP">
          <MdOutlineShoppingCart />
        </Link> */}
        <Link href={routes.miPerfil} className="transition hover:text-blueP">
          <FaRegUserCircle />
        </Link>
        <span onClick={resetUserData} className="transition hover:text-blueP">
          <IoIosLogOut />
        </span>
      </div>
    );
  }
  //cuando no
  return (
    <div className="flex items-center justify-center pb-4 mx-auto space-x-4 ">
      <Link href={routes.login}>
        <ButtonPrimary>Iniciar Sesión</ButtonPrimary>
      </Link>
      <Link href={routes.registro}>
        <ButtonPrimary>Registrarse</ButtonPrimary>
      </Link>
    </div>
  );
};

export default UserAuth;
