export default function Header() {
    return (
      <header className="bg-blue shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Dashboard de Administrador</h1>
        <div className="flex items-center space-x-4">
          <span className="text-gray-100">Administrador</span>
          <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
            Cerrar Sesión
          </button>
        </div>
      </header>
    );
  }
  