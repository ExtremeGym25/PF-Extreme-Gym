"use client";
import React from "react";
import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const RegistroView = () => {
  const validationSchema = Yup.object().shape({
    nombre: Yup.string().required("El nombre es obligatorio"),
    apellido: Yup.string().required("El apellido es obligatorio"),
    fechaNacimiento: Yup.date().required("La fecha de nacimiento es obligatoria"),
    tipoDocumento: Yup.string().required("El tipo de documento es obligatorio"),
    numeroDocumento: Yup.string().required("El número de documento es obligatorio"),
    telefono: Yup.string().matches(/^\d{10}$/, "Debe ser un número de 10 dígitos").required("El teléfono es obligatorio"),
    ciudad: Yup.string().required("La ciudad es obligatoria"),
    direccion: Yup.string().required("La dirección es obligatoria"),
    email: Yup.string().email("Correo inválido").required("El correo es obligatorio"),
    password: Yup.string().min(6, "Mínimo 6 caracteres").required("La contraseña es obligatoria"),
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 font-poppins p-6">
      <div className="flex w-full max-w-5xl bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        {/* Sección del formulario */}
        <div className="w-1/2 p-8 bg-gray-700 flex flex-col justify-center">
          <h2 className="mb-6 text-3xl font-semibold text-center text-white">Registro</h2>

          <Formik
            initialValues={{
              nombre: "",
              apellido: "",
              fechaNacimiento: "",
              tipoDocumento: "",
              numeroDocumento: "",
              telefono: "",
              ciudad: "",
              direccion: "",
              email: "",
              password: "",
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => console.log("Datos enviados:", values)}
          >
            {({ isSubmitting }) => (
              <Form className="flex flex-col space-y-4">
                <Field name="nombre" type="text" placeholder="Nombre" className="input-field" />
                <ErrorMessage name="nombre" component="div" className="error-message" />

                <Field name="apellido" type="text" placeholder="Apellido" className="input-field" />
                <ErrorMessage name="apellido" component="div" className="error-message" />

                <Field name="fechaNacimiento" type="date" className="input-field" />
                <ErrorMessage name="fechaNacimiento" component="div" className="error-message" />

                <Field name="tipoDocumento" type="text" placeholder="Tipo de documento" className="input-field" />
                <ErrorMessage name="tipoDocumento" component="div" className="error-message" />

                <Field name="numeroDocumento" type="text" placeholder="Número de documento" className="input-field" />
                <ErrorMessage name="numeroDocumento" component="div" className="error-message" />

                <Field name="telefono" type="tel" placeholder="Teléfono móvil" className="input-field" />
                <ErrorMessage name="telefono" component="div" className="error-message" />

                <Field name="ciudad" type="text" placeholder="Ciudad" className="input-field" />
                <ErrorMessage name="ciudad" component="div" className="error-message" />

                <Field name="direccion" type="text" placeholder="Dirección" className="input-field" />
                <ErrorMessage name="direccion" component="div" className="error-message" />

                <Field name="email" type="email" placeholder="Correo electrónico" className="input-field" />
                <ErrorMessage name="email" component="div" className="error-message" />

                <Field name="password" type="password" placeholder="Contraseña" className="input-field" />
                <ErrorMessage name="password" component="div" className="error-message" />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-4 p-2 bg-verde text-blanco font-bold rounded hover:bg-opacity-90 transition"
                >
                  {isSubmitting ? "Registrando..." : "Registrarse"}
                </button>
              </Form>
            )}
          </Formik>
        </div>

        {/* Sección de imagen y mensaje */}
        <div className="w-1/2 flex flex-col items-center justify-center p-8 bg-cover bg-center relative" style={{ backgroundImage: "url('/tu-imagen.jpg')" }}>
          <div className="absolute inset-0 bg-black opacity-50 rounded-lg"></div>
          <div className="relative text-center">
            <h2 className="text-2xl font-bold text-white mb-4">¿Ya te registraste?</h2>
            <p className="text-white mb-4">Inicia sesión y accede a tu cuenta.</p>
            <Link href="/login">
              <button className="px-6 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-400 transition-transform transform hover:scale-105">
                Iniciar sesión
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistroView;
