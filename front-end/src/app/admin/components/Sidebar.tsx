import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="h-screen p-5 text-white bg-gray-900 sm:w-20 md:w-30 lg:w-64">
      <h2 className="mb-6 font-bold sm:text-xs md:text-xs lg:text-xl">
        Panel de Administrador
      </h2>
      <nav>
        <ul className="space-y-4">
          <li>
            <Link
              href="/admin"
              className="block p-2 rounded sm:text-xs md:text-xs lg:text-xl hover:bg-verde hover:text-black hover:font-bold"
            >
              Inicio
            </Link>
          </li>
          <li>
            <Link
              href="/admin/usuarios"
              className="block p-2 rounded sm:text-xs md:text-xs lg:text-xl hover:bg-verde hover:text-black hover:font-bold"
            >
              Usuarios
            </Link>
          </li>
          <li>
            <Link
              href="/admin/eventos"
              className="block p-2 rounded sm:text-xs md:text-xs lg:text-xl hover:bg-verde hover:text-black hover:font-bold"
            >
              Eventos
            </Link>
          </li>
          <li>
            <Link
              href="/admin/rutinas"
              className="block p-2 rounded sm:text-xs md:text-xs lg:text-xl hover:bg-verde hover:text-black hover:font-bold"
            >
              Rutinas
            </Link>
          </li>
          <li>
            <Link
              href="/admin/entrenadores"
              className="block p-2 rounded sm:text-xs md:text-xs lg:text-xl hover:bg-verde hover:text-black hover:font-bold"
            >
              Entrenadores
            </Link>
          </li>
          <li>
            <Link
              href="/admin/publicidad"
              className="block p-2 rounded sm:text-xs md:text-xs lg:text-xl hover:bg-verde hover:text-black hover:font-bold"
            >
              Publicidad
            </Link>
          </li>
          <li>
            <Link
              href="/admin/casosDeExito"
              className="block p-2 rounded sm:text-xs md:text-xs lg:text-xl hover:bg-verde hover:text-black hover:font-bold"
            >
              Casos de Exito
            </Link>
          </li>
          <li>
            <Link
              href="/admin/vistaPrevia"
              className="block p-2 rounded sm:text-xs md:text-xs lg:text-xl hover:bg-verde hover:text-black hover:font-bold"
            >
              Vista Previa
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
