import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router-dom";

import MagicSchedulePage from "./MagicSchedulePage";
import { useScheduleDraftStore } from "@/stores/scheduleStore";
import { useRegionSelectionStore } from "@/stores/regionSelectionStore";
import type { MagicTimeBand } from "@/types/api/scheduleTypes";

/** 스토리에서만 쓰는 store 시딩 — 실제 플로우에서는 앞 단계가 채운다 */
const seed = (bands: MagicTimeBand[]) => {
  useRegionSelectionStore.setState({
    selectedRegions: [
      { regionNum: 9510, regionNm: "서울특별시 중구" },
      { regionNum: 9511, regionNm: "서울특별시 종로구" },
    ],
  });
  useScheduleDraftStore.setState((state) => ({
    draft: {
      ...state.draft,
      startDate: "2026-09-20",
      endDate: "2026-09-20",
      creationMode: "MAGIC",
      magicTimeBands: bands,
      scheduleRegionRegistReqDTOList: [
        { regionNum: 9510 },
        { regionNum: 9511 },
      ],
    },
  }));
};

const meta: Meta<typeof MagicSchedulePage> = {
  title: "Pages/Plan/MagicSchedulePage",
  component: MagicSchedulePage,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div className="h-[812px] w-[375px] border border-gray-10">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

/** 기본값 — 점심 + 저녁 (12:00~21:00, 5칸) */
export const Default: Story = {
  decorators: [
    (Story) => {
      seed(["AFTERNOON", "EVENING"]);
      return <Story />;
    },
  ],
};

/** 전체 선택 — 09:00~21:00 (6칸) */
export const AllBands: Story = {
  decorators: [
    (Story) => {
      seed(["MORNING", "AFTERNOON", "EVENING"]);
      return <Story />;
    },
  ],
};

/** 아침만 — 저녁 칩이 비활성(연속 구간이 깨지므로) */
export const MorningOnly: Story = {
  decorators: [
    (Story) => {
      seed(["MORNING"]);
      return <Story />;
    },
  ],
};

/** 미선택 — 서버 기본값 11:00~19:00 로 미리보기 */
export const NoBand: Story = {
  decorators: [
    (Story) => {
      seed([]);
      return <Story />;
    },
  ],
};
