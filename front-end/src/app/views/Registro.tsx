"use client";
import React, { useState } from "react";
import { routes } from "../routes/routes";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { loginService, registerService } from "@/app/servicios/auth";
import ButtonPrimary from "@/app/components/buttons/buttonPrimary";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../contextos/contextoAuth";
import usePublic from "../hooks/usePublic";

export interface IForm {
  name: string;
  email: string;
  address: string;
  phone: string;
  password: string;
  confirmPassword: string;
  country: string;
  city: string;
}

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .required("El nombre es obligatorio"),
  phone: Yup.number()
    .typeError("El teléfono debe ser un número")
    .required("El teléfono es obligatorio"),
  city: Yup.string()
    .min(5, "La ciudad debe tener al menos 5 caracteres")
    .max(20, "La ciudad no puede tener más de 20 caracteres")
    .required("La ciudad es obligatoria"),
  address: Yup.string().required("La dirección es obligatoria"),
  email: Yup.string()
    .email("Correo inválido")
    .required("El correo es obligatorio"),
  password: Yup.string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(15, "La contraseña no puede tener más de 15 caracteres")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$^&*])/,
      "La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial."
    )
    .required("La contraseña es obligatoria"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Las contraseñas deben coincidir")
    .required("La confirmación de la contraseña es obligatoria"),
  country: Yup.string()
    .min(5, "El país debe tener al menos 5 caracteres")
    .max(20, "El país no puede tener más de 20 caracteres")
    .required("El país es obligatorio"),
});

const Registro = () => {
  const router = useRouter();
  const { saveUserData } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleOnSubmit = async (values: IForm) => {
    console.log("Datos enviados:", values);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const formattedUserData = {
        name: values.name,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
        address: values.address,
        phone: Number(values.phone),
        country: values.country,
        city: values.city,
      };
      console.log("Datos enviados al backend:", formattedUserData);

      await registerService(formattedUserData);
      toast.success("Registro Exitoso");

      const loginResponse = await loginService({
        email: values.email,
        password: values.password,
      });

      if (loginResponse.token) {
        localStorage.setItem("token", loginResponse.token);
        toast.success("Inicio de sesión exitoso");
        saveUserData(loginResponse);
        router.push(routes.miPerfil);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Usuario Registrado");
      } else {
        toast.error("Ocurrió un error inesperado");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md p-8 rounded-lg ">
      <h2 className="mb-6 text-3xl font-semibold text-center">Registro</h2>
      <Formik
        initialValues={{
          name: "",
          email: "",
          address: "",
          phone: "",
          password: "",
          confirmPassword: "",
          country: "",
          city: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleOnSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col space-y-4 ">
            <Field
              name="name"
              type="text"
              placeholder="Nombre"
              className="w-full p-2 bg-white rounded-lg text-azul focus:outline-none focus:ring-2 focus:ring-verde"
            />
            <ErrorMessage
              name="name"
              component="div"
              className="text-sm text-red-500"
            />

            <Field
              name="email"
              type="email"
              placeholder="Email"
              className="w-full p-2 bg-white rounded-lg text-azul focus:outline-none focus:ring-2 focus:ring-verde"
            />
            <ErrorMessage
              name="email"
              component="div"
              className="text-sm text-red-500"
            />

            <Field
              name="address"
              type="text"
              placeholder="Direccion"
              className="w-full p-2 bg-white rounded-lg text-azul focus:outline-none focus:ring-2 focus:ring-verde"
            />
            <ErrorMessage
              name="address"
              component="div"
              className="text-sm text-red-500"
            />

            <Field
              name="phone"
              type="number"
              placeholder="Teléfono"
              className="w-full p-2 bg-white rounded-lg text-azul focus:outline-none focus:ring-2 focus:ring-verde"
            />
            <ErrorMessage
              name="phone"
              component="div"
              className="text-sm text-red-500"
            />

            <Field
              name="country"
              type="text"
              placeholder="Pais"
              className="w-full p-2 bg-white rounded-lg text-azul focus:outline-none focus:ring-2 focus:ring-verde"
            />
            <ErrorMessage
              name="country"
              component="div"
              className="text-sm text-red-500"
            />

            <Field
              name="city"
              type="text"
              placeholder="Ciudad"
              className="w-full p-2 bg-white rounded-lg text-azul focus:outline-none focus:ring-2 focus:ring-verde"
            />
            <ErrorMessage
              name="city"
              component="div"
              className="text-sm text-red-500"
            />
            <div className="relative">
              <Field
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                className="w-full p-2 pr-10 bg-white rounded-lg text-azul focus:outline-none focus:ring-2 focus:ring-verde"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute text-gray-600 transform -translate-y-1/2 right-4 top-1/2"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <ErrorMessage
              name="password"
              component="div"
              className="text-sm text-red-500"
            />

            <div className="relative">
              <Field
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirma Contraseña"
                className="w-full p-2 pr-10 bg-white rounded-lg text-azul focus:outline-none focus:ring-2 focus:ring-verde"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute text-gray-600 transform -translate-y-1/2 right-4 top-1/2"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <ErrorMessage
              name="confirmPassword"
              component="div"
              className="text-sm text-red-500"
            />

            <ButtonPrimary type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Registrando..." : "Registrarse"}
            </ButtonPrimary>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Registro;
