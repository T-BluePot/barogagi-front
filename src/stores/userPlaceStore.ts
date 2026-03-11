import { create } from "zustand";
import type { UserAddedPlaceDTO } from "@/api/types";

interface UserPlaceState {
  place: UserAddedPlaceDTO | null;
  setPlace: (place: UserAddedPlaceDTO) => void;
  clearPlace: () => void;
}

export const useUserPlaceStore = create<UserPlaceState>((set) => ({
  place: null,
  setPlace: (place) => set({ place }),
  clearPlace: () => set({ place: null }),
}));
