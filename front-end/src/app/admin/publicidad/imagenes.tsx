"use client";
import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { imageService } from "@/app/servicios/imagenes";

const validationSchema = Yup.object().shape({
  imageUrl: Yup.mixed()
    .required("La imagen es obligatoria")
    .test(
      "fileSize",
      "El archivo debe ser menor a 2MB",
      (value) => value && (value as File).size <= 2 * 1024 * 1024
    )
    .test(
      "fileFormat",
      "Solo se permiten imágenes (JPEG, PNG, GIF)",
      (value) =>
        value &&
        ["image/jpeg", "image/gif", "image/png"].includes((value as File).type)
    ),
});

const ImagenesPublicidad = () => {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    console.log(storedToken, "token en imagenes publicidad");
    console.log(storedUser, "user en imagenes publicidad");

    if (storedToken) {
      setToken(storedToken);
    } else {
      toast.error("No hay token disponible");
    }

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        console.log(user.id, "userId en imagenes publicidad");
        setUserId(user.id);
        console.log(user.id, "userId después de setUserId");
      } catch (error) {
        toast.error("Error al parsear el objeto usuario");
      }
    } else {
      toast.error("No hay usuario disponible");
    }
  }, []);

  const handleSubmit = async (values: {
    imageUrl: File | null;
    category: string;
    userId: string | null;
  }) => {
    console.log(userId, "userId tomado del estado");
    console.log(values.userId, "user en el handle");
    if (!values.imageUrl) {
      toast.error("No se seleccionó un archivo.");
      return;
    }
    if (!values.userId) {
      toast.error("No se ha encontrado el userId.");
      return;
    }

    const formData = new FormData();
    formData.append("file", values.imageUrl);
    formData.append("category", "image");
    formData.append("userId", values.userId);
    console.log(formData, "formdata");
    console.log("FormData antes de enviar:");
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });
    try {
      console.log("🔍 Datos enviados a la API:");
      for (const pair of formData.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }
      const response = await imageService(formData, token);
      console.log(response);
      console.log("Imagen subida con éxito:", response.imageUrl);
    } catch (error: any) {
      toast.error(error.message || "Error subiendo la imagen.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 ">
      <div className="w-full max-w-lg p-6 shadow-md bg-azul2 rounded-xl">
        <h2 className="mb-4 text-2xl font-bold text-center text-blanco">
          Sube tus imágenes
        </h2>
        <h2 className="mb-4 font-bold text-center text-l text-blanco">
          Ancho: 1920px Altura: 1080px
        </h2>
        <Formik
          initialValues={{
            imageUrl: null,
            category: "image",
            userId: userId || "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            console.log(values, "Valores enviados a handleSubmit");
            handleSubmit(values);
          }}
          enableReinitialize={true}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form className="flex flex-col gap-4">
              <Field
                name="imageUrl"
                render={({ field, form }: any) => (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      className="w-full p-2 text-black rounded bg-blanco"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setFieldValue("imageUrl", e.target.files[0]);
                        }
                      }}
                    />
                    <ErrorMessage
                      name="imageUrl"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                )}
              />

              <button
                type="submit"
                className="w-full px-4 py-2 mt-4 text-sm transition rounded-md bg-verde text-foreground hover:bg-lime-200 hover:scale-110 ring-2 ring-lime-900"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Subiendo..." : "Subir Imagen"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ImagenesPublicidad;
