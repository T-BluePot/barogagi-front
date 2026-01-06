import type { Meta, StoryObj } from "@storybook/react-vite";
import PlanCardList from "./PlanCardList";
import type { PlanData } from "./PlanCard";

const mockItems: PlanData[] = [
  {
    id: 1,
    emoji: "🥓",
    title: "브런치",
    startTime: "10:00",
    endTime: "11:30",
    location: "부천시",
  },
  {
    id: 2,
    emoji: "☕",
    title: "카페",
    startTime: "12:00",
    endTime: "13:00",
  },
  {
    id: 3,
    emoji: "🎬",
    title: "영화",
    startTime: "14:00",
    endTime: "16:30",
    location: "CGV 부천",
  },
  {
    id: 4,
    emoji: "🍜",
    title: "저녁",
    location: "서울시 강남구",
  },
];

const meta = {
  title: "Components/Main/Plan/PlanCardList",
  component: PlanCardList,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onOrderChange: { action: "order changed" },
    onDeleteClick: { action: "deleted" },
    onTimeClick: { action: "time clicked" },
    onLocationClick: { action: "location clicked" },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "360px" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PlanCardList>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 (드래그 & 스와이프 삭제)
export const Default: Story = {
  args: {
    items: mockItems,
  },
};

// 빈 리스트
export const EmptyList: Story = {
  args: {
    items: [],
  },
};

// 단일 아이템
export const SingleItem: Story = {
  args: {
    items: [mockItems[0]],
  },
};
