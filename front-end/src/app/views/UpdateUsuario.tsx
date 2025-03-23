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
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    <div className="p-4 mx-auto transition-transform duration-300 rounded-lg shadow-md w-96">
      <h3 className="text-xl font-bold text-center capitalize">Mi Perfil</h3>
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
          className="w-full p-2 capitalize border border-gray-300 rounded "
        />
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="Ciudad"
          className="w-full p-2 capitalize rounded"
        />
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Dirección"
          className="w-full p-2 capitalize rounded"
        />
        <input
          type="number"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Teléfono"
          className="w-full p-2 rounded"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-2 rounded"
        />
        <input
          type="password"
          name="Contraseña"
          value={"contraseña"}
          onChange={handleChange}
          placeholder="Contraseña"
          className="w-full p-2 rounded"
        />

        <button
          type="submit"
          className="w-full p-2 mt-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Actualizar Perfil
        </button>
      </form>
    </div>
  );
};

export default UpdatePerfilUsuario;
