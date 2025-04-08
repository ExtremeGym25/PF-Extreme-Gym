import { customNextAuthAdapter } from "./auth-adapter";

export const authOptions = {
  providers: [
    // Configura Google Provider u otros
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        const { user: backendUser, accessToken } = await customNextAuthAdapter(
          profile,
          account.provider
        );
        account.access_token = accessToken; // Guarda el JWT del backend
        user.id = backendUser.id; // Asegúrate que el ID del backend se propague
      }
      return true;
    },
  },
};
