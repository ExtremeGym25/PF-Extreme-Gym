import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";
import { Session, User } from "next-auth";

export interface ExtendedUser extends User {
  id: string;
  role?: string;
  provider?: string;
  profileImage?: string;
  isAdmin?: boolean;
  isActive?: boolean;
  subscriptionExpirationDate?: Date | null;
  subscriptionType?: string;
  name?: string;
  email?: string;
  address?: string;
  phone?: number;
  password?: string;
  confirmPassword?: string;
  country?: string;
  city?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

interface ExtendedJWT extends JWT {
  accessToken: string;
  user: ExtendedUser;
}

interface ExtendedSession extends Session {
  accessToken: string;
  user: ExtendedUser;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }): Promise<ExtendedJWT> {
      let extendedToken: ExtendedJWT = {
        ...token,
        accessToken: token.accessToken || "",
        user: (token.user as ExtendedUser) || { id: "" },
      };

      if (account?.provider === "google" && profile && account.access_token) {
        try {
          const response = await fetch(
            `https://pf-extreme-gym.onrender.com/auth/oauth/callback`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                profile: {
                  email: profile.email,
                  name: profile.name,
                  sub: profile.sub,
                },
                provider: account.provider,
                accessToken: account.access_token,
              }),
            }
          );

          if (!response.ok)
            throw new Error(`Error backend: ${response.status}`);

          const backendData: { user: ExtendedUser; accessToken: string } =
            await response.json();

          const user = backendData.user;
          console.log(
            "AccessToken del backend en JWT callback:",
            backendData.accessToken
          );

          const accessToken = backendData.accessToken;

          if (!user || !accessToken)
            throw new Error("Datos incompletos del backend");

          extendedToken.accessToken = accessToken;
          extendedToken.user = user;
        } catch (error) {
          console.error("Error al conectar con el backend:", error);
        }
      }
      console.log("AccessToken desde Google:", account?.access_token);
      console.log("Token final enviado al cliente:", extendedToken);
      return extendedToken;
    },

    async session({ session, token }): Promise<ExtendedSession> {
      return {
        ...session,

        accessToken: token.accessToken,
        user: {
          ...(token.user as ExtendedUser),
        },
      };
    },
  },
};
