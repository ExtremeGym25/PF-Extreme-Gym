"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contextos/contextoAuth";
import { IoIosLogOut } from "react-icons/io";

export default function Header() {
  const { user, resetUserData } = useAuth();
  const router = useRouter();

  const handlelogout = () => {
    resetUserData();
    router.push("/auth/login");
  };

  return (
    <header className="flex items-center p-4 bg-blue">
      <h1 className="text-xl font-bold"></h1>
      <div className="flex items-center justify-start ml-auto space-x-4">
        <span className="text-foreground sm:text-xs md:text-xs lg:text-xl">
          {user?.name || "Usuario"}
        </span>
        <button
          onClick={handlelogout}
          className="flex items-center text-sm rounded text-foreground gap-x-2 md:px-2 md:py-1 xl:px-3 xl:py-3 lg:px-3 lg:py-3 sm:px-1 sm:py-1 hover:bg-red-300"
        >
          Salir <p></p>
          <IoIosLogOut />
        </button>
      </div>
    </header>
  );
}
