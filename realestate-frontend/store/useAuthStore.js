import { create } from "zustand";
import * as authService from "@/services/auth.service";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (credentials) => {
    set({ isLoading: true });
    try {
      const data = await authService.login(credentials);
      if (typeof window !== "undefined" && data?.token) {
        window.localStorage.setItem("token", data.token);
      }
      set({
        user: data?.user || null,
        isAuthenticated: true,
        isLoading: false,
      });
      return data;
    } catch (error) {
      set({ isLoading: false, user: null, isAuthenticated: false });
      throw error;
    }
  },

  register: async (payload) => {
    set({ isLoading: true });
    try {
      const data = await authService.register(payload);
      if (typeof window !== "undefined" && data?.token) {
        window.localStorage.setItem("token", data.token);
      }
      set({
        user: data?.user || null,
        isAuthenticated: true,
        isLoading: false,
      });
      return data;
    } catch (error) {
      set({ isLoading: false, user: null, isAuthenticated: false });
      throw error;
    }
  },

  logout: () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("token");
    }
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  checkAuth: async () => {
    if (typeof window === "undefined") return;

    const token = window.localStorage.getItem("token");
    if (!token) {
      set({ user: null, isAuthenticated: false, isLoading: false });
      return;
    }

    set({ isLoading: true });
    try {
      const data = await authService.getMe();
      set({
        user: data?.user || null,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      window.localStorage.removeItem("token");
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  refreshMe: async () => {
    const data = await authService.getMe();
    set({
      user: data?.user || null,
      isAuthenticated: Boolean(data?.user),
    });
    return data;
  },
}));
