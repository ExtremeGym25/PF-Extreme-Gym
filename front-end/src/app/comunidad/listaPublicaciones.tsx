"use client";
import React, { useEffect, useState } from "react";
import { IComment, IPublication } from "../tipos";
import {
  createPublication,
  deletePublication,
  getPublications,
  updatePublication as updatePublicationService,
} from "../servicios/servicioComunidad/publicacion";
import {
  createComment,
  deleteComments,
  getCommentsByPublicationId,
  updateComment,
} from "../servicios/servicioComunidad/comentarios";
import { Send } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../contextos/contextoAuth";

const ListaPublicaciones = () => {
  const { user } = useAuth();
  const [publicaciones, setPublicaciones] = useState<IPublication[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [editando, setEditando] = useState<string | null>(null);
  const [nuevoContenido, setNuevoContenido] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [comentariosPorPublicacion, setComentariosPorPublicacion] = useState<{
    [key: string]: IComment[];
  }>({});
  const [newComments, setNewComments] = useState<{ [key: string]: string }>({});
  const [comentarioEditando, setComentarioEditando] = useState<string | null>(
    null
  );
  const [nuevoComentarioContenido, setNuevoComentarioContenido] = useState("");

  const fetchPublications = async () => {
    if (!user) {
      toast.success("Inicia sesión para ver las publicaciones");
      return;
    }
    try {
      const data = await getPublications();
      console.log("publicaciones recibidas Holaaaaaaa", data);

      setPublicaciones(data);

      data.forEach((pub) => {
        fetchComentariosPorPublicacion(pub.id);
      });
    } catch (error) {
      toast.error("Error obteniendo publicaciones");
      console.error("Error obteniendo publicaciones:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComentariosPorPublicacion = async (publicationId: string) => {
    try {
      const comentarios = await getCommentsByPublicationId(publicationId);
      console.log(`comentarios de publicaciones ${publicationId}`, comentarios);

      setComentariosPorPublicacion((prev) => ({
        ...prev,
        [publicationId]: comentarios,
      }));
    } catch (error) {
      console.error(
        "Error al obtener comentarios para la publicación",
        publicationId,
        error
      );
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    fetchPublications();
  }, []);

  const handleCommentChange = (publicationId: string, value: string) => {
    setNewComments((prev) => ({ ...prev, [publicationId]: value }));
  };

  const handleCreateComment = async (
    e: React.MouseEvent<HTMLButtonElement>,
    publicationId: string
  ) => {
    e.preventDefault();
    if (!currentUser) return;
    const content = newComments[publicationId]?.trim();
    if (!content) return alert("No puedes enviar un comentario vacío");

    const token = localStorage.getItem("token");
    if (!token) return alert("Usuario no autenticado");

    try {
      const nuevoComentario = await createComment(
        { content, publicationId },
        token
      );

      setNewComments((prev) => ({
        ...prev,
        [publicationId]: "",
      }));

      setComentariosPorPublicacion((prev) => ({
        ...prev,
        [publicationId]: [...(prev[publicationId] || []), nuevoComentario],
      }));
      setTimeout(() => {
        location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error al crear comentario", error);
    }
  };

  const handleCreatePublication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    if (!content.trim()) {
      setErrorMsg("No puedes publicar contenido vacío");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.log("Usuario no autenticado");
      return;
    }

    try {
      const newPublication = await createPublication(
        content,
        currentUser.id,
        token
      );
      const publicationOnUser = {
        ...newPublication,
        user: currentUser,
      };
      setPublicaciones((prev) => [publicationOnUser, ...prev]);
      setContent("");
      setErrorMsg("");
      toast.success("Publicacion Creada");
    } catch (error: any) {
      console.log("Error en la publicación", error);
      toast.error(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Debes iniciar sesión");

    const confirmDelete = confirm(
      "¿Estás seguro de que quieres eliminar esta publicación?"
    );
    if (!confirmDelete) return;

    try {
      await deletePublication(id, token);
      setPublicaciones((prev) => prev.filter((pub) => pub.id !== id));
      toast.success("Publicacion Eliminada");
    } catch (error: any) {
      console.error("Error al eliminar la publicación:", error);
      alert("Ocurrió un error al eliminar la publicación.");
      toast.error(error.message);
    }
  };

  const handleDeleteComments = async (
    publicacionId: string,
    comentarioId: string
  ) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Debes iniciar sesión");

    const confirmDelete = confirm(
      "¿Estás seguro de que quieres eliminar este comentario?"
    );
    if (!confirmDelete) return;

    try {
      await deleteComments(comentarioId, token);
      toast.success("Comentario Eliminado");

      setComentariosPorPublicacion((prev) => {
        const nuevoComentario = { ...prev };
        if (nuevoComentario[publicacionId]) {
          nuevoComentario[publicacionId] = nuevoComentario[
            publicacionId
          ].filter((comment) => comment.id !== comentarioId);
        }
        return nuevoComentario;
      });
    } catch (error) {
      console.error("Error al eliminar el comentario:", error);
      toast.error("Ocurrió un error al eliminar el comentario.");
    }
  };

  const handleUpdateComentario = async (
    publicationId: string,
    commentId: string
  ) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const updated = await updateComment(
        commentId,
        nuevoComentarioContenido,
        token
      );
      setComentariosPorPublicacion((prev) => ({
        ...prev,
        [publicationId]: prev[publicationId].map((coment) =>
          coment.id === commentId
            ? { ...coment, content: updated.content }
            : coment
        ),
      }));
      setComentarioEditando(null);
      setNuevoComentarioContenido("");
      toast.success("Comentario Editado");
    } catch (error: any) {
      console.error("Error al actualizar comentario", error);
      toast.error(error.message);
    }
  };

  const handleEdit = (pub: IPublication) => {
    setEditando(pub.id);
    setNuevoContenido(pub.content);
  };
  {
    console.log(currentUser);
  }
  {
    console.log(nuevoComentarioContenido);
  }
  const handleUpdate = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Usuario no autenticado");

      await updatePublicationService(id, nuevoContenido, token);
      setEditando(null);
      setNuevoContenido("");
      fetchPublications();
      toast.success("Publicacion editada con exito");
    } catch (error: any) {
      console.log("Error al actualizar publicación");
      toast.error(error.message);
    }
  };

  return (
    <div className="max-w-4xl p-2 mx-auto text-foreground">
      <h2 className="py-4 text-3xl font-bold text-center transition-transform duration-300 hover:scale-110">
        Publicaciones de Nuestra Comunidad
      </h2>

      <div className="p-4 pt-10 border rounded-lg shadow-lg bg-verde">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
          {publicaciones.map((pub) => (
            <div
              key={pub.id}
              className="relative p-4 mb-4 transition duration-300 border rounded-lg shadow-lg bg-fondo hover:shadow-xl"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold text-gray-800">
                  {pub.user?.name || "Usuario desconocido"}
                </p>
                <span className="text-sm text-gray-500">
                  {new Date(pub.date).toLocaleString()}
                </span>
              </div>

              {editando === pub.id ? (
                <div className="my-2">
                  <textarea
                    value={nuevoContenido}
                    onChange={(e) => setNuevoContenido(e.target.value)}
                    className="w-full p-2 border rounded-md bg-gray-50"
                  />
                  <button
                    onClick={() => handleUpdate(pub.id)}
                    disabled={nuevoContenido === pub.content}
                    className={`mt-2 px-4 py-2 rounded text-white ${
                      nuevoContenido === pub.content
                        ? "bg-gray-400"
                        : "bg-verde"
                    }`}
                  >
                    Guardar
                  </button>
                  <button
                    className="ml-2 text-sm text-red-500"
                    onClick={() => {
                      setEditando(null);
                      setNuevoContenido("");
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <p className="text-gray-700">{pub.content}</p>
              )}

              {/* Comentarios */}
              {/* Comentarios */}
              <h3 className="mt-4 font-semibold text-gray-800">Comentarios:</h3>
              <div className="p-2 mt-2 overflow-y-auto bg-gray-100 rounded-md max-h-40">
                {comentariosPorPublicacion[pub.id]?.length > 0 ? (
                  comentariosPorPublicacion[pub.id].map((coment) => (
                    <div
                      key={coment.id}
                      className="relative pb-2 mb-3 border-b border-gray-300"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-semibold text-gray-800">
                          {coment.user || "Anónimo"}:
                        </p>
                        <span className="text-xs text-gray-400">
                          {new Date(coment.date).toLocaleString()}
                        </span>
                      </div>

                      {comentarioEditando === coment.id ? (
                        <div className="flex items-center">
                          <input
                            type="text"
                            value={nuevoComentarioContenido}
                            onChange={(e) =>
                              setNuevoComentarioContenido(e.target.value)
                            }
                            className="w-full p-2 border rounded-md bg-gray-50"
                          />
                          <div className="ml-2">
                            <button
                              className="text-sm text-verde"
                              onClick={() =>
                                handleUpdateComentario(pub.id, coment.id)
                              }
                            >
                              Guardar
                            </button>
                            <button
                              className="ml-2 text-sm text-red-500"
                              onClick={() => setComentarioEditando(null)}
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-sm text-gray-700">
                            {coment.content}
                          </p>

                          {currentUser && currentUser.name === coment.user && (
                            <div className="absolute flex items-center gap-2 bottom-1 right-2">
                              <button
                                className="text-xs text-verde"
                                onClick={() => {
                                  setComentarioEditando(coment.id);
                                  setNuevoComentarioContenido(coment.content);
                                }}
                              >
                                Editar
                              </button>
                              <button
                                className="text-sm text-red-500"
                                onClick={() =>
                                  handleDeleteComments(pub.id, coment.id)
                                }
                                title="Eliminar comentario"
                              >
                                🗑
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Sin comentarios aún</p>
                )}
              </div>

              {/* Campo para agregar un nuevo comentario */}
              {currentUser && (
                <div className="w-full mt-4">
                  <div className="flex items-center px-3 py-1 bg-gray-200 rounded-full">
                    <input
                      type="text"
                      value={newComments[pub.id] ?? ""}
                      onChange={(e) =>
                        handleCommentChange(pub.id, e.target.value)
                      }
                      placeholder="Escribe un comentario..."
                      className="flex-grow px-2 py-1 text-sm bg-transparent outline-none"
                    />
                    <button
                      onClick={(e) => handleCreateComment(e, pub.id)}
                      className="p-2 ml-2 text-white bg-gray-300 rounded-full hover:bg-verde"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Botones de editar y eliminar publicación */}
              {currentUser && currentUser.id === pub.user?.id && (
                <div className="absolute flex gap-2 top-12 right-4">
                  <button
                    onClick={() => handleEdit(pub)}
                    className="px-3 py-1 text-sm rounded-md bg-fondo text-foreground hover:bg-verde"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(pub.id)}
                    className="text-2xl text-red-600 hover:text-red-700"
                  >
                    🗑
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Formulario de nueva publicación */}
      {currentUser && (
        <form
          onSubmit={handleCreatePublication}
          className="p-4 mt-8 border rounded-lg shadow-md bg-fondo"
        >
          {errorMsg && (
            <p className="mb-2 font-medium text-red-500">{errorMsg}</p>
          )}
          <textarea
            placeholder="Escribe tu publicación aquí..."
            className="w-full p-2 mb-4 border rounded-md"
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              if (errorMsg) setErrorMsg("");
            }}
          />
          <button
            type="submit"
            className="px-4 py-2 text-white rounded-md bg-verde"
          >
            Publicar
          </button>
        </form>
      )}
    </div>
  );
};

export default ListaPublicaciones;
