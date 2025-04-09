import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { uploadProfileImageService } from "../servicios/auth";
import { useAuth } from "../contextos/contextoAuth";
import { routes } from "../routes/routes";

const validationSchema = Yup.object().shape({
  profileImage: Yup.mixed()
    .required("La imagen de perfil es obligatoria")
    .test(
      "fileSize",
      "El archivo debe ser menor a 2MB",
      (value) => value && (value as File).size <= 2 * 1024 * 1024
    )
    .test(
      "fileFormat",
      "Solo se permiten imágenes ( JPEG, PNG,GIF)",
      (value) =>
        value &&
        ["image/jpeg", "gif", "image/png"].includes((value as File).type)
    ),
});

interface FormValues {
  profileImage: File | null;
}

const ImagenPerfil = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");

  return (
    <Formik<FormValues>
      initialValues={{ profileImage: null }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        if (!values.profileImage) {
          toast.error("Por favor, selecciona una imagen");
          return;
        }

        try {
          const token = localStorage.getItem("token");
          if (!token) {
            setError("No hay token disponible");
            return;
          }
          const userId = user?.id ?? "";
          if (!userId) {
            toast.error("Error: No se encontró el usuario");
            return;
          }
          const userData = await uploadProfileImageService(
            values.profileImage,
            userId,
            token
          );
          console.log("Datos recibidos del servicio:", userData);

          localStorage.setItem("user", JSON.stringify(userData));

          toast.success("Imagen subida con exito");

          resetForm();
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
          window.location.reload();
        } catch (error: any) {
          console.error("Error al subir la imagen:", error);
          toast.error(error.message);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ setFieldValue, errors, touched, isSubmitting }) => (
        <Form className="flex flex-col space-y-4">
          <input
            name="profileImage"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                console.log("Archivo seleccionado:", e.target.files[0]);

                setFieldValue("profileImage", e.target.files[0]);
              }
            }}
            className="w-full p-2 bg-white rounded-lg text-azul focus:outline-none focus:ring-2 focus:ring-verde"
          />
          {touched.profileImage && errors.profileImage && (
            <div className="text-sm text-red-500">{errors.profileImage}</div>
          )}
          <button
            type="submit"
            className="p-2 mt-2 font-bold border-gray-300 rounded shadow-md bg-azul1 text-blanco hover:bg-verde"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Subiendo..." : "Subir Imagen"}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default ImagenPerfil;
