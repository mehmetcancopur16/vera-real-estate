import api from "@/lib/axios";

export async function getProperties(filters = {}) {
  const { data } = await api.get("/properties", { params: filters });
  return data;
}

export async function getPropertyById(id) {
  const { data } = await api.get(`/properties/${id}`);
  return data;
}
