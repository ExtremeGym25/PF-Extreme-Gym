"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contextos/contextoAuth";

export default function Header() {
  const { user, resetUserData } = useAuth();
  const router = useRouter();

  const handlelogout = () => {
    resetUserData();
    router.push("/auth/login");
  };

  return (
    <header className="flex items-center justify-between p-4 shadow-md bg-blue">
      <h1 className="text-xl font-bold">Dashboard de Administrador</h1>
      <div className="flex items-center space-x-4">
        <span className="text-gray-100">{user?.name || "Usuario"}</span>
        <button
          onClick={handlelogout}
          className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
        >
          Cerrar Sesión
        </button>
      </div>
    </header>
  );
}
