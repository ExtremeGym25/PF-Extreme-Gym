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
    <header className="flex items-center p-4 shadow-md bg-blue">
      <h1 className="text-xl font-bold">Dashboard Administrador</h1>
      <div className="flex items-center justify-start ml-auto space-x-4">
        <span className="text-gray-100 sm:text-xs md:text-xs lg:text-xl">
          {user?.name || "Usuario"}
        </span>
        <button
          onClick={handlelogout}
          className="text-white bg-red-500 rounded md:px-3 md:py-1 xl:px-3 xl:py-3 lg:px-3 lg:py-3 sm:px-1 sm:py-1 hover:bg-red-600"
        >
          Cerrar Sesión
        </button>
      </div>
    </header>
  );
}
