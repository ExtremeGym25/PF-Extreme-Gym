"use client";
import { getUsers, getUserId } from "@/app/servicios/adminservices";
import { updateUser } from "@/app/servicios/auth";
import { IUser } from "@/app/tipos";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import DeleteUsers from "./deleteUsers";

const GetUsers = () => {
  const [usersList, setUsersList] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchId, setSearchId] = useState<string>("");
  const [searchedUser, setSearchedUser] = useState<IUser | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedUser, setEditedUser] = useState<IUser | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token") || "";
      console.log(token, "TOKEN EN GET USER");
      if (!token) {
        toast.error("No has iniciado sesión");
        setError("No has iniciado sesión");
        setLoading(false);
        return;
      }

      const users = await getUsers(token);
      console.log(users, "respuesta");
      setUsersList(users);
    } catch (error: any) {
      console.error("Error al obtener los usuarios:", error);
      toast.error(error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = async () => {
    if (!searchId.trim()) {
      toast.error("Ingresa un ID de usuario");
      return;
    }

    try {
      const token = localStorage.getItem("token") || "";
      if (!token) throw new Error("No hay un token disponible.");

      const respuesta = await getUserId(token, searchId);
      setSearchedUser(respuesta);
      toast.success("Usuario encontrado");
      setSearchId("");
    } catch (error: any) {
      setSearchedUser(null);
      toast.error(error.message);
    }
  };

  const handleEdit = (user: IUser) => {
    if (user.id !== undefined && user.id !== null) {
      setEditingId(user.id);
      setEditedUser({
        ...user,
        phone: user.phone != null ? Number(user.phone) : undefined,
      });
    }
  };

  const handleUpdate = async () => {
    if (!editedUser || !editedUser.id) return;
    console.log("Editando usuario:", editedUser); // 👈

    try {
      const token = localStorage.getItem("token") || "";
      if (!token) {
        setError("No hay token disponible");
        return;
      }

      const dataToSend: Partial<IUser> = {
        ...editedUser,
        phone: editedUser.phone ? Number(editedUser.phone) : undefined,
      };

      await updateUser(editedUser.id, dataToSend, token);

      setUsersList((prev) =>
        prev.map((u) => (u.id === editedUser.id ? { ...u, ...dataToSend } : u))
      );

      setEditingId(null);
      toast.success("Usuario actualizado");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      console.error("Error en updateUser:", err);
      setError("Error al actualizar el usuario");
    }
  };

  return (
    <div className="max-w-4xl p-6 mx-auto text-foreground">
      <h2 className="my-6 text-3xl font-bold text-center text-foreground md:text-4xl">
        Usuarios Registrados
      </h2>

      <div className="flex items-center gap-2 mb-6">
        <input
          type="text"
          placeholder="Ingrese ID del usuario"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="w-full p-2 text-black bg-white rounded"
        />
        {searchId && (
          <button
            onClick={handleSearch}
            className="px-4 py-2 text-white rounded bg-verde"
          >
            Buscar
          </button>
        )}
        {searchedUser && (
          <button
            onClick={() => {
              setSearchId("");
              setSearchedUser(null);
            }}
            className="px-2 text-sm text-white bg-red-600 rounded"
          >
            Limpiar Filtro
          </button>
        )}
      </div>

      {searchedUser && (
        <div className="w-full p-4 mb-6 border rounded-lg shadow-md text-foreground bg-fondo border-verde">
          <p>
            <strong>Nombre:</strong> {searchedUser.name}
          </p>
          <p>
            <strong>Id:</strong> {searchedUser.id}
          </p>
          <p>
            <strong>Email:</strong> {searchedUser.email}
          </p>
          <p>
            <strong>Teléfono:</strong> {searchedUser.phone}
          </p>
          <p>
            <strong>Suscripción:</strong> {searchedUser.subscriptionType}
          </p>
          <p>
            <strong>Vence:</strong>{" "}
            {searchedUser.subscriptionExpirationDate
              ? new Date(
                  searchedUser.subscriptionExpirationDate
                ).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "Sin fecha"}
          </p>
          <p>
            <strong>Tipo de Usuario:</strong>{" "}
            {!!searchedUser.isActive ? "Activo" : "Desactivado"}
          </p>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {usersList.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between w-full p-4 rounded-lg shadow-md text-foreground bg-fondo"
          >
            <div className="flex flex-col">
              {editingId === user.id ? (
                <>
                  <input
                    type="text"
                    value={editedUser?.name || ""}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser!, name: e.target.value })
                    }
                    className="p-2 mb-2 bg-white rounded text-foreground"
                  />
                  <input
                    type="text"
                    value={editedUser?.email || ""}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser!, email: e.target.value })
                    }
                    className="p-2 mb-2 bg-white rounded text-foreground"
                  />
                  <input
                    type="text"
                    className="p-2 mb-2 bg-white rounded text-foreground"
                    value={
                      editedUser?.phone != null
                        ? editedUser.phone.toString()
                        : ""
                    }
                    onChange={(e) =>
                      setEditedUser({
                        ...editedUser!,
                        phone: Number(e.target.value),
                      })
                    }
                  />

                  <input
                    type="date"
                    className="p-2 mb-2 bg-white rounded text-foreground"
                    value={
                      editedUser?.subscriptionExpirationDate
                        ? new Date(editedUser.subscriptionExpirationDate)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      setEditedUser({
                        ...editedUser!,
                        subscriptionExpirationDate: new Date(e.target.value),
                      })
                    }
                  />
                  <div className="flex justify-end gap-4 mt-2">
                    <button
                      onClick={handleUpdate}
                      className="p-2 text-white rounded bg-verde"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-2 text-white bg-red-500 rounded"
                    >
                      Cancelar
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-bold capitalize">{user.name}</h3>
                  <p>
                    <strong>Id:</strong> {user.id}
                  </p>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p>
                    <strong>Teléfono:</strong> {user.phone}
                  </p>
                  <p>
                    <strong>Suscripción:</strong> {user.subscriptionType}
                  </p>
                  <p>
                    <strong>Vence:</strong>{" "}
                    {user.subscriptionExpirationDate
                      ? new Date(
                          user.subscriptionExpirationDate
                        ).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Sin fecha"}
                  </p>
                  <p>
                    <strong>Tipo de Usuario:</strong>{" "}
                    {!!user.isActive ? "Activo" : "Desactivado"}
                  </p>
                </>
              )}
            </div>

            <div className="flex items-center gap-4">
              {!!user.isActive ? (
                <>
                  {editingId !== user.id && (
                    <button
                      onClick={() => handleEdit(user)}
                      className="p-2 text-white rounded bg-verde"
                    >
                      Editar
                    </button>
                  )}
                  {user.id && typeof user.id === "string" && (
                    <DeleteUsers id={user.id} />
                  )}
                </>
              ) : (
                "Usuario Desactivado"
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GetUsers;
