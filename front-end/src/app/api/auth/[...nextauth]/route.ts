import NextAuth from "next-auth";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    // Tus proveedores OAuth (Google, etc.)
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Mantén exactamente lo que tenías
      if (account && user) {
        token.accessToken = account?.access_token;
        token.user = {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role, // Asegúrate que user.role viene del backend
          provider: user.provider, // Asegúrate que user.provider viene del backend
          profileImage: user.profileImage,
        };
      }
      return token;
    },
    async session({ session, token }) {
      // Session mantiene la estructura que esperas
      session.accessToken = token.accessToken;
      session.user = {
        ...session.user,
        ...token.user, // Incluye todas las propiedades personalizadas
      };
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
