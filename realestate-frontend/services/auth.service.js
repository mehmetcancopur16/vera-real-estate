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

export async function updateMe(payload) {
  const { data } = await api.patch("/auth/me", payload);
  return data;
}

export async function changePassword(payload) {
  const { data } = await api.patch("/auth/password", payload);
  return data;
}

export async function uploadAvatar(file) {
  const fd = new FormData();
  fd.append("avatar", file);
  const { data } = await api.post("/auth/avatar", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function deleteAccount(payload) {
  const { data } = await api.delete("/auth/me", { data: payload });
  return data;
}
