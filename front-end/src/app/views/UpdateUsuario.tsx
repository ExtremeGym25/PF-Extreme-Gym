"use client";

import { toast } from "react-toastify";
import { routes } from "../routes/routes";
import { updateUser } from "../servicios/auth";
import { useState } from "react";
import { useAuth } from "../contextos/contextoAuth";
import { useRouter } from "next/navigation";
import { IUser } from "../tipos";

const UpdatePerfilUsuario = () => {
  const router = useRouter();
  const { user, saveUserData } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    country: user?.country || "",
    city: user?.city || "",
    address: user?.address || "",
    phone: user?.phone ? Number(user.phone) : "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "phone" ? (value ? Number(value) : "") : value, // Evita NaN
    }));
  };

  const validatePassword = (password: string) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      toast.error(
        "La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una minúscula, un número y un carácter especial."
      );
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !user.id) {
      toast.error("Usuario no definido");

      return;
    }
    if (formData.password && !validatePassword(formData.password)) {
      return;
    }

    const token = localStorage.getItem("token") || "";
    console.log("token actualizar", token);
    if (!token) {
      toast.error("No hay token disponible");
      return;
    }
    console.log(token, "tokenenuodateperfil");
    const dataToSend: Partial<IUser> = {
      ...formData,
      phone: formData.phone ? Number(formData.phone) : undefined,
    };

    if (!dataToSend.password) {
      delete dataToSend.password;
    }
    console.log(dataToSend, "datatosend");
    console.log(user.id, "uSERid");
    console.log(token, "token update usuario");
    try {
      const updatedUser = await updateUser(user.id, dataToSend, token);
      saveUserData({ user: updatedUser.user, token });
      toast.success("¡Datos actualizados correctamente!");
      router.push(routes.miPerfil);
    } catch (error: any) {
      console.error("Error al actualizar datos:", error);
      toast.error(error.message);
    }
  };

  return (
    <div className="w-full max-w-md p-4 mx-auto transition-transform duration-300 rounded-lg shadow-md text-foreground">
      <h3 className="text-xl font-bold text-center capitalize text-foreground">
        Mi Perfil
      </h3>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Nombre"
          className="w-full p-2 capitalize border border-gray-300 rounded shadow-md"
        />
        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={handleChange}
          placeholder="País"
          className="w-full p-2 capitalize border border-gray-300 rounded shadow-md "
        />
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="Ciudad"
          className="w-full p-2 capitalize border-gray-300 rounded shadow-md"
        />
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Dirección"
          className="w-full p-2 capitalize border-gray-300 rounded shadow-md"
        />
        <input
          type="number"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Teléfono"
          className="w-full p-2 border-gray-300 rounded shadow-md "
        />

        <input
          type="text"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Nueva Contraseña"
          className="w-full p-2 border-gray-300 rounded shadow-md"
        />

        <button
          type="submit"
          className="w-full p-2 mt-2 font-bold border-gray-300 rounded shadow-md bg-azul1 text-blanco hover:bg-verde"
        >
          Actualizar Perfil
        </button>
      </form>
    </div>
  );
};

export default UpdatePerfilUsuario;
