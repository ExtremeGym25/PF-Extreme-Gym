export interface IUser {
  isAdmin?: boolean;
  isActive?: boolean;
  subscriptionExpirationDate?: Date | null | undefined;
  subscriptionType?: string;
  id?: string | null;
  name?: string;
  email?: string;
  address?: string;
  phone?: number | number;
  password?: string;
  confirmPassword?: string;
  country?: string;
  city?: string;
  profileImage?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId: string;
  role: string;
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
  id?: string | null;
  nombre: string;
  descripcion: string;
  categoria: PlanCategory;
  imageUrl?: string | File;
}
export enum ExtremeSportCategory {
  AERIAL_SPORTS = "Deportes Aéreos",
  WATER_SPORTS = "Deportes Acuáticos",
  MOUNTAIN_SPORTS = "Deportes de Montaña",
  MOTOR_SPORTS = "Deportes de Motor",
  ADVENTURE_SPORTS = "Deportes de Aventura",
  WINTER_SPORTS = "Deportes de Invierno",
}
export interface IEvent {
  isActive: boolean;
  imageUrl: any;
  isCancelled: any;
  id: string;
  name: string;
  description: string;
  location: string;
  date: Date;
  time: string;
  capacity: number;
  category: ExtremeSportCategory;
  userId: string;
  file?: File;
  numberOfPeople?: number;
  latitude: number;
  longitude: number;
}

export interface IReservas {
  isCancelled: any;
  id: string;
  name: string;
  bookingsDate: Date;
  capacity: number;
  userId: string;
  numberOfPeople?: number;
  event: IEvent;
  user: IUser;
}
export interface IPublication {
  newPublication: { name: string };

  id: string;
  content: string;
  date: Date;
  user: {
    id: string;
    name: string;
  };
  plan?:
    | {
        id: string;
        name: string;
      }[]
    | null;
  event?:
    | {
        id: string;
        title: string;
      }[]
    | null;
  comments: {
    id: string;
    content: string;
    userId: string;
    userName: string;
  }[];
}
export interface IListaComentarios {
  publicationId: string;
  comments?: IComment[];
}
export interface IComment {
  id: string;
  content: string;
  date: string;
  userId: string;

  user: string;


}
