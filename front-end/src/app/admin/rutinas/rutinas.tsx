"use client";
import { createPlanService, imagePlanService } from "../../servicios/planes";
import React, { useEffect, useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { PlanCategory, IPlans } from "@/app/tipos";

const validationSchema = Yup.object().shape({
  nombre: Yup.string().min(3).max(50).required("El nombre es obligatorio"),
  descripcion: Yup.string()
    .min(10)
    .max(200)
    .required("La descripción es obligatoria"),
  categoria: Yup.mixed<PlanCategory>()
    .oneOf(Object.values(PlanCategory))
    .required(),
  imageUrl: Yup.mixed<File>()
    .nullable()
    .test(
      "fileSize",
      "El video no debe superar los 15MB",
      (value) => !value || value.size <= 15 * 1024 * 1024
    )
    .test("fileFormat", "Formato no permitido (MP4, WEBM, AVI)", (value) => {
      if (!value) return true;
      return ["video/mp4", "video/webm", "video/avi"].includes(value.type);
    }),
});

const CreacionRutinas = () => {
  const [token, setToken] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageUrlRef = useRef<string>("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    } else {
      toast.error("No hay token disponible");
    }
  }, []);

  return (
    <div className="flex items-center justify-center p-2">
      <div className="w-full max-w-lg p-6 shadow-md bg-fondo rounded-xl">
        <h2 className="my-6 text-2xl font-bold text-center text-foreground md:text-4xl">
          Crear Rutina
        </h2>
        <Formik
          initialValues={{
            nombre: "",
            descripcion: "",
            categoria: "",
            imageUrl: null as File | null,
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm }) => {
            try {
              if (!token) {
                toast.error("No hay token disponible");
                return;
              }

              const formData = new FormData();
              formData.append("nombre", values.nombre);
              formData.append("descripcion", values.descripcion);
              formData.append("categoria", values.categoria);

              const nuevaRutina = await createPlanService(formData, token);

              if (!nuevaRutina?.id) {
                throw new Error("Error al crear la rutina");
              }

              if (values.imageUrl) {
                try {
                  const uploadResponse = await imagePlanService(
                    values.imageUrl,
                    nuevaRutina.id,
                    token
                  );

                  if (!uploadResponse?.imageUrl) {
                    throw new Error("No se recibió URL de imagen válida");
                  }

                  console.log(" URL Cloudinary:", uploadResponse.imageUrl);
                  imageUrlRef.current = uploadResponse.imageUrl;
                } catch (error: any) {
                  console.error(" Error subiendo imagen:", error.message);
                  toast.error(" Error subiendo imagen");
                }
              }

              toast.success("Rutina creada exitosamente");
              resetForm();
              if (fileInputRef.current) fileInputRef.current.value = "";
              window.location.reload();
            } catch (error: any) {
              const errorMessage =
                error.response?.data?.message || error.message;
              console.error(" Error:", errorMessage);
              toast.error(errorMessage);
            }
          }}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form className="flex flex-col gap-4">
              <Field
                type="text"
                name="nombre"
                placeholder="Nombre"
                className="w-full p-2 text-black bg-white rounded"
              />
              <ErrorMessage
                name="nombre"
                component="div"
                className="text-red-500"
              />

              <Field
                as="textarea"
                name="descripcion"
                placeholder="Descripción"
                className="w-full p-2 text-black bg-white rounded"
              />
              <ErrorMessage
                name="descripcion"
                component="div"
                className="text-red-500"
              />

              <Field
                as="select"
                name="categoria"
                className="w-full p-2 text-black bg-white rounded"
              >
                <option value="">Selecciona una categoría</option>
                {Object.values(PlanCategory).map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="categoria"
                component="div"
                className="text-red-500"
              />

              <input
                type="file"
                name="imageUrl"
                ref={fileInputRef}
                className="w-full p-2 text-black bg-white rounded"
                onChange={(event) =>
                  setFieldValue(
                    "imageUrl",
                    event.currentTarget.files?.[0] || null
                  )
                }
              />
              <ErrorMessage
                name="imageUrl"
                component="div"
                className="text-red-500"
              />

              <button
                type="submit"
                className="w-full px-4 py-2 mt-4 text-sm transition rounded-md md:w-auto md:px-6 font-poppins bg-fondo text-foreground hover:bg-verde hover:scale-110 ring-2 ring-gray-300 ring-opacity-100 md:text-base"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creando..." : "Crear Rutina"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CreacionRutinas;
