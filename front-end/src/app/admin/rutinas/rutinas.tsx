"use client";
import { createPlanService } from "../../servicios/planes";
import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { PlanCategory, IPlans } from "@/app/tipos";
import ListaRutinas from "./listaRutinas";

const validationSchema = Yup.object().shape({
  nombre: Yup.string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre no puede tener más de 50 caracteres")
    .required("El nombre es obligatorio"),

  descripcion: Yup.string()
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .max(200, "La descripción no puede tener más de 200 caracteres")
    .required("La descripción es obligatoria"),

  categoria: Yup.mixed<PlanCategory>()
    .oneOf(Object.values(PlanCategory), "Categoría no válida")
    .required("La categoría es obligatoria"),
  imageUrl: Yup.string().optional(),
});

const CreacionRutinas = () => {
  const [token, setToken] = useState<string | null>(null);
  const [rutinas, setRutinas] = useState<IPlans[]>([]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      setToken(storedToken);
      console.log("Token guardado en estado.");
    } else {
      console.warn("⚠ No hay token en localStorage.");
      toast.error("No hay token disponible");
    }
  }, []);

  return (
    <div>
      <div className="p-6 mx-auto mt-6 shadow-md bg-azul2 rounded-xl w-max">
        <h2 className="mb-4 text-2xl font-bold text-center text-white">
          Crear Rutina
        </h2>

        <Formik
          initialValues={{
            nombre: "",
            descripcion: "",
            categoria: "",
            imageUrl: "",
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm }) => {
            try {
              if (!token) {
                toast.error("No hay token disponible");
                return;
              }

              const formattedValues: IPlans = {
                ...values,
                categoria: values.categoria as PlanCategory,
              };
              console.log("Enviando datos:", formattedValues);

              const nuevaRutina = await createPlanService(
                formattedValues,
                token
              );
              if (!nuevaRutina) {
                throw new Error("No se recibió la rutina creada");
              }

              toast.success("Rutina creada exitosamente");
              resetForm();

              setRutinas((prevRutinas) => [...prevRutinas, nuevaRutina]);
            } catch (error: any) {
              console.error("Error al crear la rutina:", error);
              toast.error(error.message || "Error al crear rutina");
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col gap-4">
              <div>
                <Field
                  type="text"
                  name="nombre"
                  placeholder="Nombre"
                  className="w-full p-2 text-black rounded bg-blanco"
                />
                <ErrorMessage
                  name="nombre"
                  component="div"
                  className="text-red-500"
                />
              </div>

              <div>
                <Field
                  as="textarea"
                  name="descripcion"
                  placeholder="Descripción"
                  className="w-full p-2 text-black rounded bg-blanco"
                />
                <ErrorMessage
                  name="descripcion"
                  component="div"
                  className="text-red-500"
                />
              </div>

              <div>
                <Field
                  as="select"
                  name="categoria"
                  className="w-full p-2 text-black rounded bg-blanco"
                >
                  <option value="">Selecciona una categoría</option>
                  <option value="salud">Salud</option>
                  <option value="fuerza">Fuerza</option>
                  <option value="especializado">Especializado</option>
                  <option value="funcional">Funcional</option>
                  <option value="acuatico">Acuático</option>
                  <option value="mentecuerpo">Mente y Cuerpo</option>
                  <option value="artesmarciales">Artes Marciales</option>
                  <option value="aerobico">Aeróbico</option>
                </Field>
                <ErrorMessage
                  name="categoria"
                  component="div"
                  className="text-red-500"
                />
              </div>

              <div>
                <Field
                  type="text"
                  name="imageUrl"
                  placeholder="URL de la imagen (opcional)"
                  className="w-full p-2 text-black rounded bg-blanco"
                />
              </div>

              <button
                type="submit"
                className="p-2 mx-auto font-bold text-black rounded bg-verde w-80 hover:bg-green-600 hover:text-blanco"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creando..." : "Crear Rutina"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
      <div>
        <ListaRutinas rutinas={rutinas} />
      </div>
    </div>
  );
};

export default CreacionRutinas;
