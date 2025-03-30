"use client";
import React, { useEffect, useState, ChangeEvent } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { imageService } from "@/app/servicios/imagenes";

const validationSchema = Yup.object().shape({
  imageUrl: Yup.mixed()
    .required("La imagen es obligatoria")
    .test("fileSize", "El archivo debe ser menor a 5MB", (value) =>
      value ? (value as File).size <= 5 * 1024 * 1024 : false
    )
    .test("fileFormat", "Solo se permiten imágenes (JPEG, PNG, GIF)", (value) =>
      value
        ? ["image/jpeg", "image/gif", "image/png"].includes(
            (value as File).type
          )
        : false
    ),
});

const ImagenesPublicidad = () => {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken) setToken(storedToken);
    else toast.error("No hay token disponible");

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserId(user.id);
      } catch (error) {
        toast.error("Error al parsear el objeto usuario");
      }
    } else {
      toast.error("No hay usuario disponible");
    }
  }, []);

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>,
    setFieldValue: any
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      toast.error("No se seleccionó ningún archivo.");
      return;
    }
    console.log("Archivo seleccionado:", file);
    setFieldValue("imageUrl", file);
  };

  const handleSubmit = async (values: {
    imageUrl: File | null;
    category: string;
    userId: string | null;
  }) => {
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

    try {
      console.log("🔍 Datos enviados a la API:");
      for (const pair of formData.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }
      const response = await imageService(formData, token);
      console.log("Imagen subida con éxito:", response.imageUrl);
      toast.success("Imagen subida con éxito");
    } catch (error: any) {
      toast.error(error.message || "Error subiendo la imagen.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
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
          onSubmit={(values) => handleSubmit(values)}
          enableReinitialize
        >
          {({ isSubmitting, setFieldValue, errors }) => (
            <Form className="flex flex-col gap-4">
              <Field
                name="imageUrl"
                render={() => (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      className="w-full p-2 text-black rounded bg-blanco"
                      onChange={(e) => handleFileChange(e, setFieldValue)}
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
