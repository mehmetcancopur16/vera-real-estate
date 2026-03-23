import api from "@/lib/axios";

export async function login(payload = {}) {
  const requestBody = {
    ...payload,
    rememberMe: Boolean(payload.rememberMe),
  };
  const { data } = await api.post("/auth/login", requestBody);
  return data;
}

export async function register(payload) {
  const { data } = await api.post("/auth/register", payload);
  return data;
}

export async function getMe() {
  const { data } = await api.get("/auth/me");
  return data;
}
