"use client"
import React, { useEffect, useState } from "react";
import { IComment, IPublication } from "../tipos";
import { 
  createPublication, 
  deletePublication, 
  getPublications, 
  updatePublication as updatePublicationService 
} from "../servicios/servicioComunidad/publicacion";
import { createComment, deleteComments, getCommentsByPublicationId, updateComment } from "../servicios/servicioComunidad/comentarios";
import { Send } from "lucide-react";

const ListaPublicaciones = () => {
  const [publicaciones, setPublicaciones] = useState<IPublication[]>([])
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<{id: string; name: string} | null>(null)
  const [editando, setEditando] = useState<string | null>(null)
  const [nuevoContenido, setNuevoContenido] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [comentariosPorPublicacion, setComentariosPorPublicacion] = useState<{ [key: string]: IComment[] }>({})
  const [newComments, setNewComments] = useState<{ [key: string]: string }>({})
  const [comentarioEditando, setComentarioEditando] = useState<string | null>(null)
  const [nuevoComentarioContenido, setNuevoComentarioContenido] = useState("")



  const fetchPublications = async () => {
    try {
      const data = await getPublications()
      console.log('publicaciones recibidas', data);
      
      setPublicaciones(data)

      data.forEach((pub) => {
        fetchComentariosPorPublicacion(pub.id)
      })
    } catch (error) {
      console.error("Error obteniendo publicaciones:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComentariosPorPublicacion = async (publicationId: string) => {
    try {
      const comentarios = await getCommentsByPublicationId(publicationId)
      console.log(`comentarios de publicaciones ${publicationId}`, comentarios);
      
      setComentariosPorPublicacion((prev) => ({
        ...prev,
        [publicationId]: comentarios,
      }))
    } catch (error) {
      console.error('Error al obtener comentarios para la publicación', publicationId, error);
    }
  }

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser))
    }
    fetchPublications()
  }, [])

  const handleCommentChange = (publicationId: string, value: string) => {
    setNewComments(prev => ({ ...prev, [publicationId]: value,}))
  }

  const handleCreateComment = async (
    e: React.MouseEvent<HTMLButtonElement>,
    publicationId: string
  ) => {
    e.preventDefault()
    if (!currentUser) return;
    const content = newComments[publicationId]?.trim();
    if (!content) return alert("No puedes enviar un comentario vacío");
  
    const token = localStorage.getItem("token");
    if (!token) return alert("Usuario no autenticado");
  
    try {
      const nuevoComentario = await createComment({ content, publicationId }, token);
  
      setNewComments((prev) => ({
        ...prev,
        [publicationId]: "",
      }));
  
      setComentariosPorPublicacion((prev) => ({
        ...prev,
        [publicationId]: [...(prev[publicationId] || []), nuevoComentario],
      }));
    } catch (error) {
      console.error("Error al crear comentario", error);
    }
  };
  
  const handleCreatePublication = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) return

    if (!content.trim()) {
      setErrorMsg("No puedes publicar contenido vacío")
      return
    }

    const token = localStorage.getItem("token")
    if (!token) {
      console.log("Usuario no autenticado");
      return;
    }

    try {
      const newPublication = await createPublication(content, currentUser.id, token)
      const publicationOnUser = {
        ...newPublication,
        user: currentUser,
      }
      setPublicaciones((prev) => [publicationOnUser, ...prev])
      setContent("")
      setErrorMsg("")
    } catch (error) {
      console.log("Error en la publicación", error);
    }
  }

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Debes iniciar sesión");

    const confirmDelete = confirm("¿Estás seguro de que quieres eliminar esta publicación?");
    if (!confirmDelete) return;

    try {
      await deletePublication(id, token);
      setPublicaciones((prev) => prev.filter((pub) => pub.id !== id));
    } catch (error) {
      console.error("Error al eliminar la publicación:", error);
      alert("Ocurrió un error al eliminar la publicación.");
    }
  };

  const handleDeleteComments = async (publicacionId: string, comentarioId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Debes iniciar sesión");
  
    const confirmDelete = confirm("¿Estás seguro de que quieres eliminar este comentario?");
    if (!confirmDelete) return;
  
    try {
      await deleteComments(comentarioId, token);
  
      setComentariosPorPublicacion((prev) => {
        const nuevoComentario = { ...prev };
        if (nuevoComentario[publicacionId]) {
          nuevoComentario[publicacionId] = nuevoComentario[publicacionId].filter(
            (comment) => comment.id !== comentarioId
          );
        }
        return nuevoComentario;
      });
  
    } catch (error) {
      console.error("Error al eliminar el comentario:", error);
      alert("Ocurrió un error al eliminar el comentario.");
    }
  };
  

  const handleUpdateComentario = async (publicationId: string, commentId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;
  
    try {
      const updated = await updateComment(commentId, nuevoComentarioContenido, token);
      setComentariosPorPublicacion((prev) => ({
        ...prev,
        [publicationId]: prev[publicationId].map((coment) =>
          coment.id === commentId ? { ...coment, content: updated.content } : coment
        ),
      }));
      setComentarioEditando(null);
      setNuevoComentarioContenido("");
    } catch (error) {
      console.error("Error al actualizar comentario", error);
    }
  };
  

  const handleEdit = (pub: IPublication) => {
    setEditando(pub.id)
    setNuevoContenido(pub.content)
  }

  const handleUpdate = async (id: string) => {
    try {
      const token = localStorage.getItem("token")
      await updatePublicationService(id, nuevoContenido, token)
      setEditando(null)
      setNuevoContenido('')
      fetchPublications()
    } catch (error) {
      console.log("Error al actualizar publicación");
    }
  }

  if (loading) return <p className="text-center">Cargando publicaciones...</p>;

  return (
    <div className="max-w-4xl p-4 mx-auto text-foreground">
      <h2 className="mb-4 text-lg font-bold text-center md:text-2xl">
        Publicaciones de Nuestra Comunidad
      </h2>
  
      <div className="max-h-72 overflow-y-auto border p-2 rounded-lg bg-gray-400 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 p-2">
          {publicaciones.map((pub) => (
            <div key={pub.id} className="relative mb-1 p-2 border rounded-lg bg-white shadow">
              <p className="font-semibold">{pub.user?.name || "Usuario desconocido"}</p>
  
              {editando === pub.id ? (
                <div className="my-2">
                  <textarea
                    value={nuevoContenido}
                    onChange={(e) => setNuevoContenido(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                  <button
                    onClick={() => handleUpdate(pub.id)}
                    disabled={nuevoContenido === pub.content}
                    className={`mt-1 px-3 py-1 rounded text-white ${
                      nuevoContenido === pub.content ? "bg-gray-400" : "bg-blue-500"
                    }`}
                  >
                    Guardar
                  </button>
                </div>
              ) : (
                <p>{pub.content}</p>
              )}
  
              <p className="text-sm text-gray-500 mb-2">
                {new Date(pub.date).toLocaleString()}
              </p>
  
              <h3 className="font-semibold">Comentarios:</h3>
              <div className="bg-gray-300 rounded-md p-2 max-h-20 overflow-y-auto mt-1">
                {comentariosPorPublicacion[pub.id]?.length > 0 ? (
                  comentariosPorPublicacion[pub.id]?.map((coment) => (
                    <div key={coment.id} className="mb-1 border-b border-gray-300 pb-1 relative">
                      <p className="text-sm font-semibold">
                        {coment.user || "Anónimo"}:
                      </p>
  
                      {comentarioEditando === coment.id ? (
                        <>
                          <input
                            type="text"
                            value={nuevoComentarioContenido}
                            onChange={(e) => setNuevoComentarioContenido(e.target.value)}
                            className="w-full p-1 border rounded"
                          />
                          <button
                            className="text-sm text-blue-600"
                            onClick={() => handleUpdateComentario(pub.id, coment.id)}
                          >
                            Guardar
                          </button>
                          <button
                            className="text-sm text-red-500 ml-2"
                            onClick={() => setComentarioEditando(null)}
                          >
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <>
                          <p className="text-sm">{coment.content}</p>
                          {currentUser && currentUser.id === coment.userId && (
                            <div className="absolute bottom-1 right-2 flex items-center gap-2">
                              <button
                                className="text-xs text-blue-500"
                                onClick={() => {
                                  setComentarioEditando(coment.id)
                                  setNuevoComentarioContenido(coment.content)
                                }}
                              >
                                Editar
                              </button>
                              <button
                                className="text-red-500 text-sm"
                                onClick={() => handleDeleteComments(pub.id,coment.id)}
                                title="Eliminar comentario"
                              >
                                🗑
                              </button>
                            </div>
                          )}
                        </>
                      )}
  
                      <p className="text-xs text-gray-500">
                        {new Date(coment.date).toLocaleString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Sin comentarios aún</p>
                )}
              </div>
  
              {currentUser && (
                <div className="mt-4 w-full">
                  <div className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                    <input
                      type="text"
                      value={newComments[pub.id] ?? ''}
                      onChange={(e) => handleCommentChange(pub.id, e.target.value)}
                      placeholder="Escribe un comentario..."
                      className="flex-grow bg-transparent outline-none px-2 py-1 text-sm"
                    />
                    <button
                      onClick={(e) => handleCreateComment(e, pub.id)}
                      className="ml-2 p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              )}
  
              {currentUser && currentUser.id === pub.user?.id && (
                <div className="absolute top-2 right-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(pub)}
                    className="text-black hover:text-green-500 px-2 py-1 rounded text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(pub.id)}
                    className="text-black hover:text-red-700 text-2xl"
                  >
                    🗑
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
  
      {currentUser && (
        <form
          onSubmit={handleCreatePublication}
          className="mb-4 p-4 border rounded-lg bg-white shadow"
        >
          {errorMsg && <p className="mb-2 text-red-500 font-medium">{errorMsg}</p>}
          <textarea
            placeholder="Escribe tu publicación aquí..."
            className="w-full p-2 mb-2 border rounded"
            value={content}
            onChange={(e) => {
              setContent(e.target.value)
              if (errorMsg) setErrorMsg('')
            }}
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Publicar
          </button>
        </form>
      )}
    </div>
  ) 
}

export default ListaPublicaciones
