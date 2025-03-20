/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { routes } from "../../routes/routes";

const Navbar = () => {
  return (
    <div className="sticky flex justify-center pt-6 bg-fondo font-poppins ">
      <nav
        className="bg-fondo text-blanco ring-4 ring-azul ring-opacity-100 
        w-[90%] max-w-7xl rounded-2xl shadow-xl 
      backdrop-blur-lg bg-opacity-80 font-poppins"
      >
        <div className="flex items-center justify-between h-20 px-6 mx-auto max-w-7xl">
          <div>
            {" "}
            <Link href={routes.home}>
              <img
                alt="logo"
                className="w-auto transition-transform duration-300 h-28 animate-pulse hover:scale-110"
              ></img>
            </Link>
          </div>

          <div className="flex space-x-6">
            <Link href={routes.home} className="transition hover:text-verde">
              Inicio
            </Link>
            <Link
              href={routes.nosotros}
              className="transition hover:text-verde"
            >
              Nosotros
            </Link>

            <Link
              href={routes.planesRutinas}
              className="transition hover:text-verde"
            >
              Planes y Rutinas
            </Link>
            <Link
              href={routes.casosExito}
              className="transition hover:text-verde"
            >
              Casos de Exito
            </Link>
            <Link href={routes.tarifas} className="transition hover:text-verde">
              Tarifas
            </Link>
            <Link href={routes.eventos} className="transition hover:text-verde">
              Eventos
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
