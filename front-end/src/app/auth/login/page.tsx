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

const Login = () => {
  const { saveUserData } = useAuth();
  const router = useRouter();

  const handleOnSubmit = async (values: IUserLogin) => {
    try {
      const res = await loginService(values);
      console.log("Respuesta al iniciar sesión:", res);

      if (res?.token) {
        toast.success("Login Exitoso");
        // Persiste solo el token
        saveUserData(res.token);
        setTimeout(() => router.push(routes.miPerfil), 1000);
      } else {
        console.error("Token no encontrado en la respuesta");
        toast.error("Token no encontrado en la respuesta");
      }
    } catch (error) {
      console.warn("Error al iniciar sesión", error);
      toast.error("El Login no pudo completarse");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-fondo font-poppins">
      <div className="flex w-full max-w-4xl overflow-hidden rounded-lg shadow-lg bg-grisP">
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
            onSubmit={handleOnSubmit}
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
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="error-message"
                  />

                  <Field
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    className="input-field"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="error-message"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full p-2 mt-4 font-bold transition rounded bg-verde text-blanco hover:bg-opacity-90"
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
          className="flex flex-col items-center justify-center w-1/2 p-8 bg-center bg-cover"
          style={{ backgroundImage: "url('/tu-imagen.jpg')" }}
        >
          <div className="p-6 text-center bg-black rounded-lg bg-opacity-60">
            <h2 className="mb-4 text-2xl font-bold text-blanco">
              ¿Aún no tienes cuenta?
            </h2>
            <p className="mb-4 text-blanco">
              Regístrate y únete a nuestra comunidad.
            </p>
            <Link href="/registro">
              <button className="px-6 py-2 font-bold transition rounded bg-verde text-blanco hover:bg-opacity-90">
                Registrarse
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
