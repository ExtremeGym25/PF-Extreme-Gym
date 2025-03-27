import Link from "next/link";
import { FaSquareFacebook } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const Footer = () => {
  return (
    <footer className="py-8 font-poppins bg-fondo ring-2 ring-verde ring-opacity-100">
      <div className="grid grid-cols-1 gap-8 px-6 mx-auto transition max-w-7xl md:grid-cols-3">
        <div className=" hover:text-verde">
          <h3 className="mb-3 text-lg font-semibold text-black ">
            Quienes Somos
          </h3>
          <p className="text-justify text-gray-400 hover:text-verde">
            Somos lo mejor de ambos mundos en un solo lugar. Un centro integral
            donde cualquiera puede entrenar de manera convencional y, al mismo
            tiempo, prepararse para desafíos extremos.
          </p>
        </div>

        <div className="transition hover:text-verde">
          <h3 className="mb-3 text-lg font-semibold">Políticas</h3>
          <div>
            <Link href="/politicas/protecciondedatos">
              <p className="text-justify text-gray-400 hover:text-verde">
                Proteccion de Datos
              </p>
            </Link>
            <Link href="/politicas/politicaprivacidad">
              <p className="text-justify text-gray-400 hover:text-verde">
                Política de Privacidad
              </p>
            </Link>
            <Link href="/politicas/terminoscondiciones">
              <p className="text-justify text-gray-400 hover:text-verde">
                Términos y Condiciones de Uso{" "}
              </p>
            </Link>
          </div>
          <h3 className="pt-2 mb-3 text-lg font-semibold">Contáctanos</h3>
          <Link href="tel:+123456789">
            <p className="text-justify text-gray-400 hover:text-verde">
              Llamanos{" "}
            </p>
          </Link>
          <Link href="mailto:extremegym25@gmail.com">
            <p className="text-justify text-gray-400 hover:text-verde">
              Email{" "}
            </p>
          </Link>
        </div>

        <div className=" hover:text-verde">
          <h3 className="mb-3 text-lg font-semibold text-center hover:text-verde">
            Síguenos
          </h3>
          <div className="flex justify-center space-x-8">
            <Link href="www.facebook.com">
              <FaSquareFacebook />
            </Link>
            <Link href="#">
              <FaInstagram />
            </Link>
            <Link href="#">
              <FaLinkedin />
            </Link>
            <Link href="#">
              <MdEmail />
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-8 text-sm text-center text-gray-500">
        © {new Date().getFullYear()} Xtreme Gym. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;
