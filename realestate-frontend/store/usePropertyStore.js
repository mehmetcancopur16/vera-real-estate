import { create } from "zustand";

export const usePropertyStore = create((set) => ({
  properties: [],
  filters: {
    city: "",
    type: "",
    listingType: "",
    minPrice: "",
    maxPrice: "",
    rooms: "",
    search: "",
  },
  isLoading: false,
  setProperties: (properties) => set({ properties }),
  setFilters: (updates) =>
    set((state) => ({
      filters: {
        ...state.filters,
        ...updates,
      },
    })),
  setLoading: (isLoading) => set({ isLoading }),
}));
