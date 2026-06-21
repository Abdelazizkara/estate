import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Property, SearchFilters } from '../types';

interface PropertyStore {
  properties: Property[];
  favorites: string[];
  filters: SearchFilters;
  compareList: string[];

  // Actions
  setProperties: (properties: Property[]) => void;
  addProperty: (property: Property) => void;
  updateProperty: (property: Property) => void;
  deleteProperty: (id: string) => void;
  toggleFavorite: (propertyId: string) => void;
  setFilters: (filters: SearchFilters) => void;
  clearFilters: () => void;
  addToCompare: (propertyId: string) => void;
  removeFromCompare: (propertyId: string) => void;
  clearCompare: () => void;
  getFilteredProperties: () => Property[];
}

export const usePropertyStore = create<PropertyStore>()(
  persist(
    (set, get) => ({
      properties: [],
      favorites: [],
      filters: {},
      compareList: [],

      setProperties: (properties) => set({ properties }),

      addProperty: (property) =>
        set((state) => ({ properties: [...state.properties, property] })),

      updateProperty: (property) =>
        set((state) => ({
          properties: state.properties.map((p) =>
            p.id === property.id ? property : p
          ),
        })),

      deleteProperty: (id) =>
        set((state) => ({
          properties: state.properties.filter((p) => p.id !== id),
        })),

      toggleFavorite: (propertyId) =>
        set((state) => ({
          favorites: state.favorites.includes(propertyId)
            ? state.favorites.filter((id) => id !== propertyId)
            : [...state.favorites, propertyId],
        })),

      setFilters: (filters) => set({ filters }),

      clearFilters: () => set({ filters: {} }),

      addToCompare: (propertyId) =>
        set((state) => {
          if (state.compareList.includes(propertyId)) return state;
          if (state.compareList.length >= 3) {
            alert('You can compare up to 3 properties at once');
            return state;
          }
          return { compareList: [...state.compareList, propertyId] };
        }),

      removeFromCompare: (propertyId) =>
        set((state) => ({
          compareList: state.compareList.filter((id) => id !== propertyId),
        })),

      clearCompare: () => set({ compareList: [] }),

      getFilteredProperties: () => {
        const { properties, filters } = get();
        return properties.filter((property) => {
          if (filters.query) {
            const query = filters.query.toLowerCase();
            const matchesQuery =
              property.title.toLowerCase().includes(query) ||
              property.description.toLowerCase().includes(query) ||
              property.location.city.toLowerCase().includes(query) ||
              property.location.address.toLowerCase().includes(query);
            if (!matchesQuery) return false;
          }

          if (filters.type && property.type !== filters.type) return false;
          if (filters.status && property.status !== filters.status) return false;
          if (filters.city && property.location.city !== filters.city) return false;
          if (filters.minPrice && property.price < filters.minPrice) return false;
          if (filters.maxPrice && property.price > filters.maxPrice) return false;
          if (filters.minBedrooms && property.features.bedrooms < filters.minBedrooms) return false;
          if (filters.minArea && property.features.area < filters.minArea) return false;

          return true;
        });
      },
    }),
    {
      name: 'property-store',
      partialize: (state) => ({
        favorites: state.favorites,
        compareList: state.compareList,
      }),
    }
  )
);
