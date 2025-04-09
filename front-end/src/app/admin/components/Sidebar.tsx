import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="h-screen p-5 shadow-md text-foreground bg-fondo sm:w-25 md:w-30 xl:w-40 lg-w-60">
      <h2 className="mb-6 text-xs font-bold sm:text-xs md:text-xs lg:text-xl">
        Panel de Administrador
      </h2>
      <nav>
        <ul className="space-y-4">
          <li>
            <Link
              href="/admin"
              className="block p-2 text-xs rounded sm:text-xs md:text-xs lg:text-xl hover:bg-verde hover:text-black hover:font-bold"
            >
              Inicio
            </Link>
          </li>
          <li>
            <Link
              href="/admin/usuarios"
              className="block p-2 text-xs rounded sm:text-xs md:text-xs lg:text-xl hover:bg-verde hover:text-black hover:font-bold"
            >
              Usuarios
            </Link>
          </li>
          <li>
            <Link
              href="/admin/rutinas"
              className="block p-2 text-xs rounded sm:text-xs md:text-xs lg:text-xl hover:bg-verde hover:text-black hover:font-bold"
            >
              Rutinas
            </Link>
          </li>
          <li>
            <Link
              href="/admin/eventos"
              className="block p-2 text-xs rounded sm:text-xs md:text-xs lg:text-xl hover:bg-verde hover:text-black hover:font-bold"
            >
              Eventos
            </Link>
          </li>
          <li>
            <Link
              href="/admin/reservas"
              className="block p-2 text-xs rounded sm:text-xs md:text-xs lg:text-xl hover:bg-verde hover:text-black hover:font-bold"
            >
              Reservas Eventos
            </Link>
          </li>

          <li>
            <Link
              href="/admin/publicidad"
              className="block p-2 text-xs rounded sm:text-xs md:text-xs lg:text-xl hover:bg-verde hover:text-black hover:font-bold"
            >
              Publicidad
            </Link>
          </li>

          <li>
            <Link
              href="/"
              className="block p-2 text-xs rounded sm:text-xs md:text-xs lg:text-xl hover:bg-verde hover:text-black hover:font-bold"
            >
              Home
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
