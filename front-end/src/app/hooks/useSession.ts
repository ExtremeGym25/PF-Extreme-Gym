"use client";

import { useSession } from "next-auth/react";

type CustomSession = {
  accessToken?: string;
  user?: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
};

export function useSessionData() {
  const { data: session, status } = useSession() as {
    data: CustomSession;
    status: "loading" | "authenticated" | "unauthenticated";
  };

  return {
    user: session?.user,
    accessToken: session?.accessToken,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
  };
}
