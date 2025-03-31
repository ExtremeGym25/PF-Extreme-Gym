import { Request } from 'express';
import { User } from 'auth0';

declare module 'express' {
  interface Request {
    oidc?: {
      user?: User;
      accessToken?: string;
      isAuthenticated?: () => boolean;
      // Añade otras propiedades que necesites
    };
  }
}
