"use client";
import { createEvent } from "../../servicios/eventos";
import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { ExtremeSportCategory, PlanCategory } from "@/app/tipos";

const validationSchema = Yup.object().shape({
  name: Yup.string().min(3).max(50).required("El nombre es obligatorio"),
  description: Yup.string()
    .min(10)
    .max(200)
    .required("La descripción es obligatoria"),
  location: Yup.string().required("La ubicación es obligatoria"),
  date: Yup.date()
    .min(new Date(), "La fecha no puede ser en el pasado")
    .required("La fecha es obligatoria"),
  time: Yup.string().required("La hora es obligatoria"),
  capacity: Yup.number()
    .positive("Debe ser un número positivo")
    .integer("Debe ser un número entero")
    .required("La capacidad es obligatoria"),
  category: Yup.mixed<ExtremeSportCategory>()
    .oneOf(Object.values(ExtremeSportCategory))
    .required("La categoría es obligatoria"),
});

const CrearEvento = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    } else {
      toast.error("Debe iniciar sesión para crear un evento");
    }
  }, []);

  return (
    <div className="flex items-center justify-center p-2">
      <div className="w-full max-w-lg p-6 shadow-md bg-azul2 rounded-xl">
        <h2 className="mb-4 text-2xl font-bold text-center text-blanco">
          Crear Evento
        </h2>
        <Formik
          initialValues={{
            name: "",
            description: "",
            location: "",
            date: "",
            time: "",
            capacity: 10,
            category: "",
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm }) => {
            console.log("Enviando formulario...", values);
            try {
              if (!token) {
                toast.error("No hay token disponible");
                return;
              }

              const decoded = JSON.parse(atob(token.split(".")[1]));
              const userId = decoded.id;
              console.log(decoded, userId, "userid y token");
              const uuidRegex =
                /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
              if (!uuidRegex.test(userId)) {
                throw new Error("El userId no es un UUID válido");
              }
              console.log(uuidRegex, "el userid");
              const eventFormData = new FormData();
              eventFormData.append("name", values.name);
              eventFormData.append("description", values.description);
              eventFormData.append("location", values.location);
              eventFormData.append("date", new Date(values.date).toISOString());
              eventFormData.append("time", values.time);
              eventFormData.append("capacity", values.capacity.toString());
              eventFormData.append("category", values.category);
              eventFormData.append("userId", userId);
              console.log(eventFormData, "lo que se envias");
              await createEvent(eventFormData, token);
              toast.success("Evento creado exitosamente");

              resetForm();
            } catch (error: any) {
              console.error(" Error:", error);
              toast.error(
                error.response?.data?.message || "Error al crear el evento"
              );
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col gap-4">
              <Field
                type="text"
                name="name"
                placeholder="Nombre del evento"
                className="w-full p-2 text-black rounded bg-blanco"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500"
              />

              <Field
                as="textarea"
                name="description"
                placeholder="Descripción"
                className="w-full p-2 text-black rounded bg-blanco"
              />
              <ErrorMessage
                name="description"
                component="div"
                className="text-red-500"
              />

              <Field
                type="text"
                name="location"
                placeholder="Ubicación"
                className="w-full p-2 text-black rounded bg-blanco"
              />
              <ErrorMessage
                name="location"
                component="div"
                className="text-red-500"
              />

              <Field
                type="date"
                name="date"
                className="w-full p-2 text-black rounded bg-blanco"
              />
              <ErrorMessage
                name="date"
                component="div"
                className="text-red-500"
              />

              <Field
                type="time"
                name="time"
                className="w-full p-2 text-black rounded bg-blanco"
              />
              <ErrorMessage
                name="time"
                component="div"
                className="text-red-500"
              />

              <Field
                type="number"
                name="capacity"
                placeholder="Capacidad"
                className="w-full p-2 text-black rounded bg-blanco"
              />
              <ErrorMessage
                name="capacity"
                component="div"
                className="text-red-500"
              />

              <Field
                as="select"
                name="categoria"
                className="w-full p-2 text-black rounded bg-blanco"
              >
                <option value="">Selecciona una categoría</option>
                {Object.values(ExtremeSportCategory).map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Field>

              <button
                type="submit"
                className="w-full px-4 py-2 mt-4 text-sm transition rounded-md bg-verde text-foreground hover:bg-lime-200 hover:scale-110 ring-2 ring-lime-900"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creando..." : "Crear Evento"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CrearEvento;
