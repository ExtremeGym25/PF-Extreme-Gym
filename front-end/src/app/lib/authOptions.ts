import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";
import { Session, User } from "next-auth";

interface ExtendedUser extends User {
  id: string;
  role?: string;
  provider?: string;
  profileImage?: string;
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
    async jwt({ token, account, profile }: any): Promise<ExtendedJWT> {
      const extendedToken: ExtendedJWT = {
        ...token,
        accessToken: token.accessToken || "",
        user: {
          id: token.user?.id || "",
          name: token.user?.name || null,
          email: token.user?.email || null,
          role: token.user?.role,
          provider: token.user?.provider,
          profileImage: token.user?.profileImage,
        },
      };

      if (account?.provider === "google" && profile) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/oauth/callback`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                profile: {
                  email: profile.email,
                  name: profile.name,
                  sub: profile.sub,
                  accessToken: account?.access_token,
                  expires_in: account?.expires_at,
                  token_type: account?.token_type,
                  scope: account?.scope,
                },
                provider: account.provider,
              }),
            }
          );

          if (!response.ok)
            throw new Error(`Error backend: ${response.status}`);

          const backendData = await response.json();
          const user = backendData?.user;
          const accessToken = backendData?.accessToken;

          if (!user) throw new Error("El backend no devolvió un usuario");

          extendedToken.accessToken = accessToken;
          extendedToken.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            provider: user.provider,
            profileImage: user.profileImage,
          };
        } catch (error) {
          console.error("Error al conectar con el backend:", error);
        }
      }

      return extendedToken;
    },

    async session({
      session,
      token,
    }: {
      session: Session;
      token: ExtendedJWT;
    }): Promise<ExtendedSession> {
      return {
        ...session,
        accessToken: token.accessToken,
        user: {
          ...session.user,
          ...token.user,
        },
      };
    },
  },
};
