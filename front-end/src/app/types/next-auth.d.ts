import "next-auth";
import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken: string;
    user: {
      id: string;
      role?: string;
      provider?: string;
      profileImage?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    role?: string;
    provider?: string;
    profileImage?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    user: {
      id: string;
      role?: string;
      provider?: string;
      profileImage?: string;
    };
  }
}
