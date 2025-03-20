"use client";
import React from "react";
import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const LoginView = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-fondo font-poppins">
      <div className="flex w-full max-w-4xl bg-grisP rounded-lg shadow-lg overflow-hidden">
        {/* Sección del formulario */}
        <div className="w-1/2 p-8">
          <h2 className="mb-6 text-2xl font-bold text-center text-blanco">
            Iniciar Sesión
          </h2>
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={Yup.object({
              email: Yup.string()
                .email("Correo inválido")
                .required("El correo es obligatorio"),
              password: Yup.string()
                .min(6, "La contraseña debe tener al menos 6 caracteres")
                .required("La contraseña es obligatoria"),
            })}
            onSubmit={(values) => {
              console.log("Datos enviados:", values);
            }}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div className="space-y-3">
                  <Field
                    type="email"
                    name="email"
                    placeholder="Correo electrónico"
                    className="input-field"
                  />
                  <ErrorMessage name="email" component="div" className="error-message" />

                  <Field
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    className="input-field"
                  />
                  <ErrorMessage name="password" component="div" className="error-message" />
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 p-2 bg-verde text-blanco font-bold rounded hover:bg-opacity-90 transition"
                  disabled={isSubmitting}
                >
                  Iniciar Sesión
                </button>
              </Form>
            )}
          </Formik>
        </div>

        {/* Sección de imagen y mensaje */}
        <div
          className="w-1/2 flex flex-col items-center justify-center p-8 bg-cover bg-center"
          style={{ backgroundImage: "url('/tu-imagen.jpg')" }}
        >
          <div className="bg-black bg-opacity-60 p-6 rounded-lg text-center">
            <h2 className="text-2xl font-bold text-blanco mb-4">
              ¿Aún no tienes cuenta?
            </h2>
            <p className="text-blanco mb-4">Regístrate y únete a nuestra comunidad.</p>
            <Link href="/registro">
              <button className="px-6 py-2 bg-verde text-blanco font-bold rounded hover:bg-opacity-90 transition">
                Registrarse
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
