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
    sortBy: "newest",
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
  resetFilters: () =>
    set({
      filters: {
        city: "",
        type: "",
        listingType: "",
        minPrice: "",
        maxPrice: "",
        rooms: "",
        search: "",
        sortBy: "newest",
      },
    }),
}));
