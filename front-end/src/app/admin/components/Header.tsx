export default function Header() {
  return (
    <header className="flex flex-col items-center justify-between p-4 shadow-md sm:flex-row">
      <div className="flex flex-col items-center space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
        <span className="text-gray-100">Administrador</span>
      </div>
      <div className="sm:ml-auto">
        <button className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600">
          Cerrar Sesión
        </button>
      </div>
    </header>
  );
}
