import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { UserAddedPlaceDTO } from "@/api/types";

const MAX_RECENT = 5;

interface UserPlaceState {
  place: UserAddedPlaceDTO | null;
  recentPlaces: UserAddedPlaceDTO[];
  setPlace: (place: UserAddedPlaceDTO) => void;
  clearPlace: () => void;
  clearRecentPlaces: () => void;
}

export const useUserPlaceStore = create<UserPlaceState>()(
  persist(
    (set) => ({
      place: null,
      recentPlaces: [],

      setPlace: (place) =>
        set((state) => ({
          place,
          recentPlaces: [
            place,
            ...state.recentPlaces.filter((p) => p.placeUrl !== place.placeUrl),
          ].slice(0, MAX_RECENT),
        })),

      clearPlace: () => set({ place: null }),
      clearRecentPlaces: () => set({ recentPlaces: [] }),
    }),
    {
      name: "user-place",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ recentPlaces: state.recentPlaces }), // place는 영속 불필요
    }
  )
);
