/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { IUserLogin } from "@/app/tipos";
import { useAuth } from "@/app/contextos/contextoAuth";
import { toast } from "react-toastify";
import { routes } from "@/app/routes/routes";
import { loginService } from "@/app/servicios/auth";
import { useRouter } from "next/navigation";
import usePublic from "@/app/hooks/usePublic";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("El formato de correo no es válido")
    .required("El correo es obligatorio"),
  password: Yup.string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .matches(/[A-Z]/, "Debe contener al menos una letra mayúscula")
    .matches(/[a-z]/, "Debe contener al menos una letra minúscula")
    .matches(/\d/, "Debe contener al menos un número")
    .matches(/[@$!%*?&]/, "Debe contener al menos un carácter especial")
    .required("La contraseña es obligatoria"),
});

const Login = () => {
  const loading = usePublic();

  const { saveUserData } = useAuth();
  const router = useRouter();

  const handleOnSubmit = async (values: IUserLogin, { setSubmitting }: any) => {
    try {
      const res = await loginService(values);
      if (res?.token) {
        toast.success("Inicio de sesión exitoso");
        saveUserData(res);
        setTimeout(() => {
          if (res.user.isAdmin) {
            router.push(routes.admin);
          } else {
            router.push(routes.miPerfil);
          }
        }, 1000);
      } else {
        toast.error("Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Error al iniciar sesión", error);
      toast.error(
        "Error al iniciar sesión. Verifica tus datos e intenta de nuevo."
      );
    } finally {
      setSubmitting(false);
    }
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl font-bold text-foreground">Cargando...</p>
      </div>
    );
  }
  return (
    <div
      className="flex items-center justify-center min-h-screen bg-center bg-no-repeat bg-cover"
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/dixcrmeue/image/upload/v1743014897/fondologin_lojsm9.png')",
      }}
    >
      <div className="w-full max-w-md p-8 bg-white shadow-lg bg-opacity-20 rounded-2xl backdrop-blur-md">
        <h2 className="mb-6 text-3xl font-bold text-center text-foreground">
          Iniciar Sesión
        </h2>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleOnSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div className="space-y-2">
                <Field
                  type="email"
                  name="email"
                  placeholder="Correo Electrónico"
                  className="w-full p-3 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-verde"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500"
                />

                <Field
                  type="password"
                  name="password"
                  placeholder="Contraseña"
                  className="w-full p-3 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-verde"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full p-3 font-semibold text-foreground  px-6 py-2 mt-4 transition rounded-md  font-poppins bg-fondo text-foreground hover:bg-verde hover:scale-110 ring-2 ring-gray-300 ring-opacity-100
                  ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isSubmitting ? "Iniciando..." : "Iniciar Sesión"}
              </button>
            </Form>
          )}
        </Formik>

        <div className="mt-4 text-center text-foreground">
          ¿No tienes una cuenta?{" "}
          <Link href="/auth/registro" className="text-blue-400 hover:underline">
            Regístrate aquí
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
