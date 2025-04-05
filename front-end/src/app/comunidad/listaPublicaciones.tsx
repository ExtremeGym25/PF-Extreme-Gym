"use client"
import { useEffect, useState } from "react";
import { IPublication } from "../tipos";
import { createPublication, getPublications } from "../servicios/servicioComunidad/publicacion";

const ListaPublicaciones = () => {
    const [publicaciones, setPublicaciones] = useState<IPublication[]>([])
    const [content, setContent] = useState("")
    const [loading, setLoading] = useState(true)
    const [currentUser, setCurrentUser] = useState <{id: string; name: string } | null>(null)

    useEffect(() => {
        const storeduser = localStorage.getItem("user")
        if(storeduser) {
            setCurrentUser(JSON.parse(storeduser))
        }
        const fetchPublications = async () => {
            try {
              const data = await getPublications();
              setPublicaciones(data);
            } catch (error) {
              console.error("Error obteniendo publicaciones:", error);
            } finally {
              setLoading(false);
            }
          };
        fetchPublications()
    }, [])

    if (loading) return <p className="text-center">Cargando publicaciones...</p>;

    const handleCreatePublication = async (e: React.FormEvent) => {
        e.preventDefault()
        if(!currentUser) return

        const token = localStorage.getItem("token")
        

        if(!token) {
            console.log("usuario no autenticado");
            return;
        }
        try {
            const newPublication = await createPublication(content, currentUser.id, token)
            setPublicaciones((prev) => [newPublication, ...prev])
            setContent("")
        } catch (error) {
            console.log("Error en la publicacion", error);
            
        }
    }

    return (
        <div className="max-w-4xl p-4 mx-auto text-foreground">
            <h2 className="mb-4 text-lg font-bold text-center md:text-2xl">
                Publicaciones de Nuestra Comunidad
            </h2>
            <div className="max-h-72 overflow-y-auto border p-4 rounded-lg bg-gray-400 shadow-md w-full ">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {publicaciones.map((pub) => (
                <div key={pub.id} className="mb-4 p-4 border rounded-lg bg-white shadow">
                    <p className="font-semibold">
                    {pub.user?.name || "Usuario desconocido"}
                    </p>
                    <p>{pub.content}</p>
                <p className="text-sm text-gray-500">{new Date(pub.date).toLocaleString()}</p>

                {currentUser && (
                    <div className="mt-2 flex gap-2">
                        <button 
                            className="bg-orange-500 text-white px-2 py-1 rounded text-sm">
                        Comentar
                        </button>
                
                        <button 
                            className="bg-red-500 text-white px-2 py-1 rounded text-sm">
                        Editar / Eliminar
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
                className="mb-4 p-4 border rounded-lg bg-white shadow">
                    <textarea
                        placeholder="Escribe tu publicación aquí..."
                        className="w-full p-2 mb-2 border rounded"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
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