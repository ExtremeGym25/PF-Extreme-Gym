import Link from "next/link";
import ButtonPrimary from "./components/buttons/buttonPrimary";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen font-poppins bg-fondo text-foreground">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="mt-2 text-2xl">Página no encontrada</p>

      <img
        src="https://res.cloudinary.com/dixcrmeue/image/upload/v1743015555/logox_iy2aee.png"
        alt="Imagen pagina no existe"
        className="object-cover pt-2 transition-transform duration-300 h-28 hover:scale-110"
      ></img>
      <Link href="/">
        <ButtonPrimary>Volver al inicio</ButtonPrimary>
      </Link>
    </div>
  );
}
