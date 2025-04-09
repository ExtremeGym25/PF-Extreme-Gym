import axios from "axios";

const axiosApiBack = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const loginWithGoogle = async (profile: any) => {
  const response = await axiosApiBack.post("/api/oauth-login", {
    profile,
    provider: "google",
  });

  return response.data;
};
