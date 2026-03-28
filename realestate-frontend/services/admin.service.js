import api from "@/lib/axios";

/* ── Admin Stats ── */
export async function getAdminStats() {
  const { data } = await api.get("/admin/stats");
  return data;
}

/* ── Admin Users ── */
export async function getAdminUsers(params = {}) {
  const { data } = await api.get("/admin/users", { params });
  return data;
}

export async function updateAdminUser(id, payload) {
  const { data } = await api.patch(`/admin/users/${id}`, payload);
  return data;
}

export async function deleteAdminUser(id) {
  const { data } = await api.delete(`/admin/users/${id}`);
  return data;
}

/* ── Admin Listings ── */
export async function getAdminListings(params = {}) {
  const { data } = await api.get("/admin/listings", { params });
  return data;
}

export async function toggleAdminListing(id) {
  const { data } = await api.patch(`/admin/listings/${id}/toggle`);
  return data;
}

export async function deleteAdminListing(id) {
  const { data } = await api.delete(`/admin/listings/${id}`);
  return data;
}

/* ── Subscription ── */
export async function getSubscriptionPlans() {
  const { data } = await api.get("/subscription/plans");
  return data;
}

export async function upgradePlan(plan) {
  const { data } = await api.post("/subscription/upgrade", { plan });
  return data;
}
