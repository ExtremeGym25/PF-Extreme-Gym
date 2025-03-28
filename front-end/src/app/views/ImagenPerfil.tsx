import React, { useRef } from "react";
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
      "Solo se permiten imágenes (JPG, JPEG, PNG)",
      (value) =>
        value &&
        ["image/jpeg", "image/jpg", "image/png"].includes((value as File).type)
    ),
});

interface FormValues {
  profileImage: File | null;
}

const ImagenPerfil = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { resetUserData } = useAuth();
  const router = useRouter();
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
          const imageUrl = await uploadProfileImageService(values.profileImage);
          console.log("Imagen subida con éxito:", imageUrl);
          toast.success("Imagen subida correctamente");

          resetForm();
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }

          resetUserData();
          setTimeout(() => {
            router.push(routes.login);
          }, 1000);
        } catch (error) {
          console.error("Error al subir la imagen:", error);
          toast.error("Error al subir la imagen");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ setFieldValue, errors, touched, isSubmitting }) => (
        <Form className="flex flex-col space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
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
