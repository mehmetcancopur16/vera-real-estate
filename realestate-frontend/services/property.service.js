import api from "@/lib/axios";

export async function getProperties(filters = {}) {
  const { data } = await api.get("/properties", { params: filters });
  return data;
}

export async function getPropertyById(id) {
  const { data } = await api.get(`/properties/${id}`);
  return data;
}

export async function createProperty(payload) {
  const { data } = await api.post("/properties", payload);
  return data;
}

export async function uploadPropertyImages(id, files) {
  const formData = new FormData();
  Array.from(files || []).forEach((file) => {
    formData.append("images", file);
  });

  const { data } = await api.post(`/properties/${id}/images`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
}

export async function getMyProperties(params = {}) {
  const { data } = await api.get("/properties/my", { params });
  return data;
}

export async function deleteMyProperty(id) {
  const { data } = await api.delete(`/properties/${id}`);
  return data;
}
