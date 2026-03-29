import api from "@/lib/axios";

export async function getPlans() {
  const { data } = await api.get("/subscription/plans");
  return data;
}

export async function upgradePlan(plan) {
  const { data } = await api.post("/subscription/upgrade", { plan });
  return data;
}
