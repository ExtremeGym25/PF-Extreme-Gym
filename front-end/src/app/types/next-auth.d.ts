import "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    user: {
      id: string;
      email?: string;
      name?: string;
      role?: string;
      provider?: string;
      profileImage?: string;
    };
  }

  interface User {
    id: string;
    email?: string;
    name?: string;
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
      email?: string;
      name?: string;
      role?: string;
      provider?: string;
      profileImage?: string;
    };
  }
}
