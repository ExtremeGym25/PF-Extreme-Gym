"use client";
import React, { useState } from "react";
import { useAuth } from "../contextos/contextoAuth";
import { updateUser } from "../servicios/auth";
import { useRouter } from "next/navigation";
import { routes } from "../routes/routes";
import { toast } from "react-toastify";

const UpdatePerfilUsuario = () => {
  const router = useRouter();

  const { user, saveUserData } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    country: user?.country || "",
    city: user?.city || "",
    address: user?.address || "",
    phone: Number(user?.phone) || 0,
    email: user?.email || "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validación de la contraseña
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

    // Validación de la contraseña
    if (!validatePassword(formData.password)) {
      return;
    }

    if (!user || !user.id) {
      toast.error("Usuario no definido");
      return;
    }

    try {
      const updatedUser = await updateUser(user.id, formData);
      saveUserData({
        user: updatedUser,
        token: localStorage.getItem("token") || "",
      });
      toast.success("¡Datos actualizados correctamente!");
      router.push(routes.login);
    } catch (error) {
      console.error("Error al actualizar datos:", error);
      toast.error("Hubo un error al actualizar los datos.");
    }
  };

  return (
    <div className="p-4 mx-auto transition-transform duration-300 rounded-lg shadow-md text-foreground w-96">
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
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-2 border-gray-300 rounded shadow-md"
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
