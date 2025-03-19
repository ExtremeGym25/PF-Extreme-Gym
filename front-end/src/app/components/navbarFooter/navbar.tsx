/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { routes } from "../../routes/routes";

const Navbar = () => {
  return (
    <div className="sticky flex justify-center pt-6 bg-fondo ">
      <nav
        className="bg-fondo text-blanco ring-4 ring-azul ring-opacity-100 
        w-[90%] max-w-7xl rounded-2xl shadow-xl 
      backdrop-blur-lg bg-opacity-80 font-poppins"
      >
        <div className=" max-w-7xl mx-auto px-6 flex justify-between items-center h-20">
          <div>
            {" "}
            <Link href={routes.home}>
              <img
                alt="logo"
                className="h-28 w-auto animate-pulse transition-transform duration-300 hover:scale-110"
              ></img>
            </Link>
          </div>

          {/* Links de navegación */}
          <div className="flex space-x-6">
            <Link href={routes.home} className="hover:text-verde transition">
              Inicio
            </Link>
            <Link
              href={routes.nosotros}
              className="hover:text-verde transition"
            >
              Quienes Somos
            </Link>

            <Link
              href={routes.planesRutinas}
              className="hover:text-verde transition"
            >
              Planes y Rutinas
            </Link>
            <Link
              href={routes.casosExito}
              className="hover:text-verde transition"
            >
              Casos de Exito
            </Link>
            <Link href={routes.tarifas} className="hover:text-verde transition">
              Tarifas
            </Link>
            <Link href={routes.eventos} className="hover:text-verde transition">
              Eventos
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
