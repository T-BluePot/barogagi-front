import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { RegionSearchItemType } from "@/types/api/scheduleTypes";
import { getPersistStorage } from "@/utils/bridgeStorage";

type RegionSelectionStore = {
  // 선택된 지역 목록(최대 3개)
  selectedRegions: RegionSearchItemType[];

  // 전체 교체(서버/페이지 이동 시 동기화용)
  setSelectedRegions: (regions: RegionSearchItemType[]) => void;

  // 단건 추가(최대 3개, 중복 방지)
  addRegion: (item: RegionSearchItemType) => {
    ok: boolean;
    reason?: "MAX" | "DUPLICATE";
    next?: RegionSearchItemType[];
  };

  // 단건 제거
  removeRegionByNum: (regionNum: number) => void;

  // 전체 초기화
  clearRegions: () => void;
};

export const useRegionSelectionStore = create<RegionSelectionStore>()(
  persist(
    (set, get) => ({
      selectedRegions: [],

      setSelectedRegions: (regions) => {
        // 중복 제거 + 최대 3개 강제
        const unique = regions.filter(
          (r, idx, arr) =>
            arr.findIndex((x) => x.regionNum === r.regionNum) === idx
        );
        set({ selectedRegions: unique.slice(0, 3) });
      },

      addRegion: (item) => {
        const { selectedRegions } = get();

        // 중복 방지
        const already = selectedRegions.some(
          (r) => r.regionNum === item.regionNum
        );
        if (already) {
          return { ok: false, reason: "DUPLICATE" };
        }

        // 최대 3개 제한
        if (selectedRegions.length >= 3) {
          return { ok: false, reason: "MAX" };
        }

        set({ selectedRegions: [...selectedRegions, item] });
        return { ok: true, next: [...selectedRegions, item] };
      },

      removeRegionByNum: (regionNum) =>
        set((state) => ({
          selectedRegions: state.selectedRegions.filter(
            (r) => r.regionNum !== regionNum
          ),
        })),

      clearRegions: () => set({ selectedRegions: [] }),
    }),
    {
      name: "plan:create:selected-regions",
      storage: createJSONStorage(() => getPersistStorage("session")),
      partialize: (state) => ({ selectedRegions: state.selectedRegions }),
    }
  )
);
