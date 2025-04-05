import apiClient from "./api-client";

export async function customNextAuthAdapter(profile: any, provider: string) {
  const response = await apiClient.post("/oauth/callback", {
    profile,
    provider,
  });
  return response.data;
}
