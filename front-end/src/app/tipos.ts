export interface IUser {
  id?: string;
  name?: string;
  email?: string;
  address?: string;
  phone?: number;
  password?: string;
  confirmPassword?: string;
  country?: string;
  city?: string;
  profileImage?: string;
}
export interface IUserLogin {
  email: string;
  password: string;
}
export interface IResponseBack {
  email: string;
  id?: string;
  isAdmin?: boolean;
}
export enum PlanCategory {
  SALUD = "salud",
  FUERZA = "fuerza",
  ESPECIALIZADO = "especializado",
  FUNCIONAL = "funcional",
  ACUATICO = "acuatico",
  MENTECUERPO = "mentecuerpo",
  ARTESMARCIALES = "artesmarciales",
  AEROBICO = "aerobico",
}
export interface IPlans {
  id?: string;
  nombre: string;
  descripcion: string;
  categoria: PlanCategory;
  imageUrl?: string;
}
