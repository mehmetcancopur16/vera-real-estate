import api from "@/lib/axios";

export async function createContactMessage(payload) {
  const { data } = await api.post("/contact", payload);
  return data;
}
