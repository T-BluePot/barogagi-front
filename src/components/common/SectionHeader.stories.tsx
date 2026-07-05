import type { Meta, StoryObj } from "@storybook/react-vite";

import SectionHeader from "./SectionHeader";

const PlusIcon = (
  <svg
    width={22}
    height={22}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.2}
    strokeLinecap="round"
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const meta: Meta<typeof SectionHeader> = {
  title: "Components/Common/SectionHeader",
  component: SectionHeader,
  tags: ["autodocs"],
  args: {
    title: "오늘의 핫플레이스",
    onAction: () => console.log("action"),
  },
  // 넓은 캔버스에서 좌우 정렬(justify-between)이 보이도록 폭 고정
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

/** 타이틀만 (액션 없음) */
export const TitleOnly: Story = {
  args: { onAction: undefined },
};

/** 우측 텍스트 액션 */
export const WithTextAction: Story = {
  args: { title: "나의 일정", actionLabel: "전체보기" },
};

/** 우측 아이콘 액션 (aria-label 필수) */
export const WithIconAction: Story = {
  args: {
    title: "나의 일정",
    actionIcon: PlusIcon,
    actionAriaLabel: "일정 추가",
  },
};
