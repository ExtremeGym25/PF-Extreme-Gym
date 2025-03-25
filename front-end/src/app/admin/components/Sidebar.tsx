import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-gray-900 text-white p-5">
      <h2 className="text-xl font-bold mb-6">Panel de Administrador</h2>
      <nav>
        <ul className="space-y-4">
          <li>
            <Link href="/dashboard" className="block p-2 rounded hover:bg-gray-700">
              Inicio
            </Link>
          </li>
          <li>
            <Link href="/dashboard/usuarios" className="block p-2 rounded hover:bg-gray-700">
              Usuarios
            </Link>
          </li>
          <li>
            <Link href="/dashboard/membresias" className="block p-2 rounded hover:bg-gray-700">
              Membresías
            </Link>
          </li>
          <li>
            <Link href="/dashboard/configuracion" className="block p-2 rounded hover:bg-gray-700">
              Configuración
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
